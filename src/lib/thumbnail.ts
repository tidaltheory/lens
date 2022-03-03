import multimatch from 'multimatch'
import sharp from 'sharp'
import type { Sharp } from 'sharp'

import type { ImageDimensions, ImageFile, ThumbnailOption } from '../types'

/**
 * Determine if the source path matches a glob pattern. Returns true if `files`
 * is undefined.
 */
export function matchThumbnail(source: string, files?: string | string[]) {
	if (!files) return true
	// eslint-disable-next-line etc/prefer-less-than
	return multimatch([source], files).length > 0
}

interface PathParts {
	dir: string
	imageName: string
	fingerprint: string
	ext: string
	useFilenameDirectory: boolean
}

/**
 * Writes a resized image to the same directory as the source image,
 * in the initial format as well as `webp` and `avif`.
 */
export async function writeThumbnail(
	image: Sharp,
	thumb: ThumbnailOption,
	{ dir, imageName, fingerprint, ext, useFilenameDirectory }: PathParts
) {
	let [key] = Object.keys(thumb)
	let [{ position = sharp.strategy.attention, ...resizeOptions }] =
		Object.values(thumb)
	let filename = useFilenameDirectory
		? `${dir}/${imageName}/${key}.${fingerprint}`
		: `${dir}/${imageName}-${key}.${fingerprint}`
	let dimensions: ImageDimensions
	let formats: ImageFile['formats'] = {}

	/**
	 * Resize image and write to different formats.
	 */
	dimensions = await image
		.resize({ position, ...resizeOptions })
		.withMetadata()
		.toFile(`${filename}.jpg`)
		.then(({ width, height }) => {
			return { width, height }
		})
	formats.webp = await image
		.resize({ position, ...resizeOptions })
		.withMetadata()
		.toFile(`${filename}.webp`)
		.then(() => `${filename}.webp`)
	formats.avif = await image
		.resize({ position, ...resizeOptions })
		.withMetadata()
		.toFile(`${filename}.avif`)
		.then(() => `${filename}.avif`)

	let results: ImageFile = {
		path: `${filename}${ext}`,
		dimensions,
		formats,
	}

	return results
}
