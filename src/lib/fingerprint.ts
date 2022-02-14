import crypto from 'node:crypto'

import type { Sharp } from 'sharp'

const md5 = crypto.createHash('md5')

export async function generateFingerprint(image: Sharp) {
	md5.update(await image.toBuffer())
	return md5.digest('hex')
}
