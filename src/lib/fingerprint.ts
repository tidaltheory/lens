import crypto from 'node:crypto'

import { Sharp } from 'sharp'

/**
 * Generates a short hash string from image data for fingerprinting
 * or cache-busting a filename.
 */
export async function generateFingerprint(image: Sharp) {
	/**
	 * Create hash instance within the function so it doesn't throw an
	 * error when used in a loop.
	 */
	let hash = crypto.createHash('shake256', { outputLength: 4 })

	hash.update(await image.toBuffer())
	return hash.digest('hex')
}
