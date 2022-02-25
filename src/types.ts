import { ResizeOptions } from 'sharp'
import { RequireAtLeastOne } from 'type-fest'

type WebpFormat = { webp: string }
type AvifFormat = { avif: string }
export type ImageDimensions = {
	width: number
	height: number
}
export type ImageFormat = WebpFormat | AvifFormat

export interface ImageFile {
	/** Path to the original image format.  */
	path: string
	dimensions: ImageDimensions
	/**
	 * Alternative image formats, either for one-off use or in a
	 * `<picture>` element.
	 */
	formats?: Record<string, string>
}

export type ImageThumbnails = Record<string, ImageFile>

/** Data for each image stored in the library. */
export interface ImageRecord extends ImageFile {
	/** Array of dominant colours, in hex format. */
	colors?: string[]
	/** Encoded blurha.sh placeholder. */
	blurhash?: string
	/** Resized versions, keyed to thumbnail size label. */
	thumbnails?: ImageThumbnails
}

type ThumbResizeOptions = RequireAtLeastOne<ResizeOptions, 'width' | 'height'>
export type ThumbnailOption = Record<string, ThumbResizeOptions>

export interface LensConfig {
	/** Path to JSON database file. */
	store?: string
	thumbnails?: ThumbnailOption[]
}
