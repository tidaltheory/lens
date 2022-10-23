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

interface ImageColors {
	/**
	 * Array of hex values, ordered from node-vibrant:
	 *   1. "Vibrant"
	 *   2. "DarkVibrant"
	 *   3. "LightVibrant"
	 *   4. "Muted"
	 *   5. "DarkMuted"
	 *   6. "LightMuted"
	 */
	palette: string[]
	/** The colour from the `palette` array with the highest `population`. */
	dominant: string
}

export interface ImageMeta {
	/** Title field from the image’s EXIF data. */
	title?: string
	/** Description field from the image’s EXIF data. */
	caption?: string
}

/** Data for each image stored in the library. */
export interface ImageRecord extends ImageFile {
	colors: ImageColors
	/** Encoded blurha.sh placeholder. */
	blurhash?: string
	/** Resized versions, keyed to thumbnail size label. */
	thumbnails?: ImageThumbnails
	meta?: ImageMeta
}

type ThumbResizeOptions = RequireAtLeastOne<ResizeOptions, 'width' | 'height'>
type FilesOption = {
	/** A glob pattern or array of filenames to match against the current image. */
	files?: string | string[]
}
export type ThumbnailOption = Record<string, ThumbResizeOptions & FilesOption>

export interface LensConfig {
	/** Path to JSON file in which to store the image data. */
	store?: string
	/** Use the filename as a subdirectory for generated files. */
	useFilenameDirectory?: boolean
	thumbnails?: ThumbnailOption[]
	includeMetadata?: boolean
}

export interface PathParts {
	dir: string
	imageName: string
	fingerprint: string
	ext: string
	useFilenameDirectory: boolean
}
