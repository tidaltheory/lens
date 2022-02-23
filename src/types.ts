type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif'
type ImageDimensions = {
	width: number
	height: number
}

export interface ImageFile {
	/** Path to the original image format.  */
	path: string
	dimensions: ImageDimensions
	/**
	 * Alternative image formats, either for one-off use or in a
	 * `<picture>` element.
	 */
	formats?: Record<ImageFormat, string>
}

/** Data for each image stored in the library. */
export interface ImageRecord extends ImageFile {
	/** Array of dominant colours, in hex format. */
	colors?: string[]
	/** Encoded blurha.sh placeholder. */
	blurhash?: string
	/** Resized versions, keyed to thumbnail size label. */
	thumbnails?: Record<string, ImageFile>
}

export interface LensConfig {
	/** Path to JSON database file. */
	store?: string
	thumbnails?: string[]
}
