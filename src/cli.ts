import { existsSync } from 'node:fs'
import { FileHandle, mkdir, open } from 'node:fs/promises'
import path, { parse } from 'node:path'
import process from 'node:process'

import { globby } from 'globby'
import { JSONFile, Low } from 'lowdb'
import ora, { oraPromise } from 'ora'
import sade from 'sade'
import sharp from 'sharp'
import { PackageJson } from 'type-fest'

import { loadConfig } from './lib/context.js'
import { getDominantPalette } from './lib/dominant.js'
import { generateFingerprint } from './lib/fingerprint.js'
import { matchThumbnail, writeThumbnail } from './lib/thumbnail.js'
import type { ImageRecord, ImageThumbnails } from './types.js'

interface Options {
	/** Path to JSON file in which to store the image data. */
	store?: string
	/** Use the filename as a subdirectory for generated files. */
	useFilenameDirectory?: boolean
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
	.option('-s, --store', 'Path to JSON file in which to store the image data')
	.option(
		'-u, --useFilenameDirectory',
		'Use the filename as a subdirectory for generated files'
	)
	.action(async (source: string, options: Options) => {
		let spinner = ora().start()
		let config = await loadConfig()
		let useFilenameDirectory =
			options.useFilenameDirectory || config.useFilenameDirectory

		let sourceImages = await globby(source)
		let processed = 0

		for await (let source of sourceImages) {
			let sourceImage: FileHandle
			/**
			 * Check that source image exists.
			 */
			try {
				spinner.text = 'Checking image...'
				sourceImage = await open(source, 'r')
				await sourceImage.close()
			} catch (error: unknown) {
				spinner.fail(String(error))
				continue
			}

			processed++

			let sharpImage = sharp(source)
			let { width, height } = await sharpImage.metadata()
			let fingerprint = await generateFingerprint(sharpImage)
			let dominantPalette = await oraPromise(
				getDominantPalette(sharpImage),
				{ successText: 'Extracted dominant colours' }
			)

			let { dir, name: imageName, ext } = parse(source)
			let filename = useFilenameDirectory
				? `${dir}/${imageName}/${fingerprint}${ext}`
				: `${dir}/${imageName}.${fingerprint}${ext}`

			if (useFilenameDirectory && !existsSync(`${dir}/${imageName}`)) {
				spinner.info('Output directory did not exist, created')
				await mkdir(`${dir}/${imageName}`)
			}

			try {
				spinner.text = 'Optimising original image...'
				await sharpImage.withMetadata().toFile(filename)
				spinner.succeed('Optimised a copy of original image')
			} catch (error: unknown) {
				spinner.fail(String(error))
				continue
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

						// eslint-disable-next-line max-depth
						if (matchThumbnail(source, files)) {
							let { path, dimensions, formats } =
								await writeThumbnail(sharpImage, thumb, {
									dir,
									imageName,
									fingerprint,
									ext,
									useFilenameDirectory,
								})

							thumbs++
							entryThumbnails[key] = { path, dimensions, formats }
						}
					}

					// eslint-disable-next-line yoda
					if (0 < thumbs) {
						spinner.succeed(
							`Generated ${thumbs} thumbnail ${
								thumbs === 1 ? 'image' : 'images'
							}`
						)
					} else {
						spinner.info('No thumbnails to generate')
					}
				} catch (error: unknown) {
					spinner.fail(String(error))
					continue
				}
			}

			spinner.start('Adding entry to library...')

			/**
			 * New entry to add to library.
			 */
			let entry: ImageRecord = {
				path: filename,
				dimensions: { width, height },
				colors: dominantPalette,
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
				spinner.succeed('Added image entry to library')
			} catch (error: unknown) {
				spinner.fail(String(error))
				continue
			}
		}

		spinner.succeed(
			`Processed ${processed} ${
				processed === 1 ? 'image' : 'images'
			} ...DONE!`
		)
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
