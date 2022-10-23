import Vibrant from 'node-vibrant'
import { Sharp } from 'sharp'

export async function getDominantPalette(image: Sharp) {
	let buffer = await image.toBuffer()
	let swatches = await Vibrant.from(buffer).getPalette()
	let [dominant] = Object.values(swatches)
		.sort((a, b) => (a.population < b.population ? -1 : 1))
		.reverse()
		.map((swatch) => swatch.hex)
	let palette = Object.values(swatches).map((swatch) => swatch.hex)

	return {
		palette,
		dominant,
	}
}
