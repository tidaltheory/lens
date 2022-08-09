import type { Sharp } from 'sharp'

import type { ImageFile, PathParts } from '../../types'

export async function optimiseImage(
	image: Sharp,
	{ dir, imageName, fingerprint, ext, useFilenameDirectory }: PathParts
) {
	let filename = useFilenameDirectory
		? `${dir}/${imageName}/${fingerprint}`
		: `${dir}/${imageName}.${fingerprint}`
	let formats: ImageFile['formats'] = {}

	await image.withMetadata().toFile(`${filename}${ext}`)

	formats.webp = await image
		.withMetadata()
		.toFile(`${filename}.webp`)
		.then(() => `${filename}.webp`)
	formats.avif = await image
		.withMetadata()
		.toFile(`${filename}.avif`)
		.then(() => `${filename}.avif`)

	return formats
}
