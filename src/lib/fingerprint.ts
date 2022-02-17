import crypto from 'node:crypto'

import type { Sharp } from 'sharp'

const hash = crypto.createHash('shake256', { outputLength: 4 })

/**
 * Generates a short hash string from image data for fingerprinting
 * or cache-busting a filename.
 */
export async function generateFingerprint(image: Sharp) {
	hash.update(await image.toBuffer())
	return hash.digest('hex')
}
