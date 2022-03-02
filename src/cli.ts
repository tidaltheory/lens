import { FileHandle, open } from 'node:fs/promises'
import path, { parse } from 'node:path'
import process from 'node:process'

import { JSONFile, Low } from 'lowdb'
import ora from 'ora'
import sade from 'sade'
import sharp from 'sharp'
import { PackageJson } from 'type-fest'

import { loadConfig } from './lib/context.js'
import { generateFingerprint } from './lib/fingerprint.js'
import { matchThumbnail, writeThumbnail } from './lib/thumbnail.js'
import type { ImageRecord, ImageThumbnails } from './types.js'

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
		function failAndExit(error: unknown) {
			spinner.fail(String(error))
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1)
		}

		let spinner = ora().start()
		let config = await loadConfig()

		/**
		 * Check that source image exists.
		 */
		let sourceImage: FileHandle
		try {
			spinner.text = 'Checking image...'
			sourceImage = await open(source, 'r')
			await sourceImage.close()
		} catch (error: unknown) {
			failAndExit(error)
		}

		let sharpImage = sharp(source)
		let { width, height } = await sharpImage.metadata()
		let fingerprint = await generateFingerprint(sharpImage)

		let { dir, name: imageName, ext } = parse(source)
		let filename = `${dir}/${imageName}.${fingerprint}${ext}`

		try {
			spinner.text = 'Optimising original image...'
			sourceImage = await open(source, 'r')
			await sharpImage.withMetadata().toFile(filename)
			spinner.succeed('Copy of original image optimised')
		} catch (error: unknown) {
			failAndExit(error)
		}

		let entryThumbnails: ImageThumbnails = {}
		/**
		 * Generate thumbnail images.
		 */
		// eslint-disable-next-line etc/prefer-less-than
		if (config.thumbnails.length > 0) {
			try {
				spinner.start('Generating thumbnail images...')

				let thumbs = 0

				for await (let thumb of config.thumbnails) {
					let [key] = Object.keys(thumb)
					let [{ files }] = Object.values(thumb)

					if (matchThumbnail(source, files)) {
						let { path, dimensions, formats } =
							await writeThumbnail(sharpImage, thumb, {
								dir,
								imageName,
								fingerprint,
								ext,
							})

						thumbs++
						entryThumbnails[key] = { path, dimensions, formats }
					}
				}

				// eslint-disable-next-line yoda
				if (0 < thumbs) {
					spinner.succeed(`${thumbs} thumbnail images generated`)
				} else {
					spinner.info('No thumbnails to generate')
				}
			} catch (error: unknown) {
				failAndExit(error)
			}
		}

		spinner.start('Adding entry to library...')

		/**
		 * New entry to add to library.
		 */
		let entry: ImageRecord = {
			path: `${dir}/${imageName}.${fingerprint}${ext}`,
			dimensions: { width, height },
			thumbnails: entryThumbnails,
		}

		let store = options.store || config.store || 'imagemeta.json'
		let adapter = new JSONFile<Library>(path.resolve(store))
		let database = new Low(adapter)

		/**
		 * Load image store, add new entry, and write to JSON file.
		 */
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

prog.command('jpg <src>')
	.describe('Convert an image to high-quality JPG')
	.action(async (source: string) => {
		let spinner = ora().start()
		let { name, ext } = parse(source)

		if (ext.endsWith('jpg')) {
			spinner.succeed('Image is already in JPG format!')
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(0)
		}

		let sharpImage = sharp(source)
		spinner.text = 'Converting to JPG...'

		try {
			await sharpImage
				.withMetadata()
				.toFormat('jpg', { quality: 100, chromaSubsampling: '4:4:4' })
				.toFile(`${name}.jpg`)
			spinner.succeed(`${name} converted to JPG format!`)
		} catch (error: unknown) {
			spinner.fail(String(error))
		}
	})

prog.parse(process.argv)
