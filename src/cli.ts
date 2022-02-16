import { FileHandle, open } from 'node:fs/promises'
import path, { parse } from 'node:path'
import process from 'node:process'

import { JSONFile, Low } from 'lowdb'
import ora from 'ora'
import sade from 'sade'
import sharp from 'sharp'
import { PackageJson } from 'type-fest'

import { generateFingerprint } from './lib/fingerprint.js'
import { ImageRecord } from './types.js'

interface Options {
	/** Path to JSON file in which to store the image data. */
	store?: string
}

interface Library {
	library: Record<string, ImageRecord>
}

/**
 * Basic CLI setup.
 *
 * @see https://github.com/lukeed/sade
 * @see https://github.com/sindresorhus/ora
 */
const prog = sade('lens')
// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const { version } = require('../package.json') as PackageJson

prog.version(version)

prog.command('add <src>')
	.describe('Process and store image metadata')
	.action(async (source: string, options: Options) => {
		let spinner = ora().start()

		let sourceImage: FileHandle
		try {
			spinner.text = 'Checking image...'
			sourceImage = await open(source, 'r')
			await sourceImage.close()
		} catch (error: unknown) {
			spinner.fail(String(error))
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1)
		}

		let sharpImage = sharp(source)
		let { width, height } = await sharpImage.metadata()
		let fingerprint = await generateFingerprint(sharpImage)

		let { dir, name: imageName, ext } = parse(source)
		let filename = `${dir}${imageName}.${fingerprint}${ext}`

		try {
			spinner.text = 'Optimising original image...'
			sourceImage = await open(source, 'r')
			await sharpImage.withMetadata().toFile(filename)
		} catch (error: unknown) {
			spinner.fail(String(error))
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1)
		}

		let entry: ImageRecord = {
			path: `${dir}${imageName}.${fingerprint}${ext}`,
			dimensions: { width, height },
		}

		let store = options.store || 'src/imagemeta.json'
		let adapter = new JSONFile<Library>(path.resolve(store))
		let database = new Low(adapter)

		await database.read()
		database.data ||= { library: {} }
		database.data.library[imageName] = entry

		try {
			await database.write()
			spinner.succeed('Image metadata added to library!')
		} catch (error: unknown) {
			spinner.fail(String(error))
		}
	})

prog.parse(process.argv)
