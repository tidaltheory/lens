import type { Sharp } from 'sharp'

export async function getDominantPalette(image: Sharp) {
	let { dominant } = await image.stats()
	return [`rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`]
}
