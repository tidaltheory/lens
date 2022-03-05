# @tidaltheory/lens

## 0.4.0

### Minor Changes

- [#96](https://github.com/tidaltheory/lens/pull/96) [`43814f9`](https://github.com/tidaltheory/lens/commit/43814f9d1617799e2ab6a3e59bdfdc5ae3d178ee) Thanks [@stormwarning](https://github.com/stormwarning)! - Generate AVIF and WebP formats of original image

* [#95](https://github.com/tidaltheory/lens/pull/95) [`4345c16`](https://github.com/tidaltheory/lens/commit/4345c168536befcb48b9a20e13d40acc506ccaec) Thanks [@stormwarning](https://github.com/stormwarning)! - Extract dominant colour from image

- [#92](https://github.com/tidaltheory/lens/pull/92) [`ed8c9e9`](https://github.com/tidaltheory/lens/commit/ed8c9e97c95dbc54dfcede724b1ea52e26ebdea2) Thanks [@stormwarning](https://github.com/stormwarning)! - Allow glob paths for input source

## 0.3.0 — 2022-03-03

#### 🐛 Fixed

- Fix JPG thumbnail file output [#83](https://github.com/tidaltheory/lens/pull/83)

  JPG thumbnail images were sometimes ending up somewhat corrupted or
  otherwise not displaying properly in macOS finder or Safari (although
  seemed to work fine in Firefox). Thumbnail images are now explicitly
  output as JPG, regardless of original image format.

#### 🎁 Added

- `jpg` command to convert an image to a high-quality JPG file [#87](https://github.com/tidaltheory/lens/pull/87)
- Add `useFilenameDirectory` option [#90](https://github.com/tidaltheory/lens/pull/90)

  Uses the filename (without extension) as a subdirectory next to the
  source image to contain optimised formats and thumbnails.

## 0.2.0 — 2022-02-25

#### 🎁 Added

- Add basic `add` command [#69](https://github.com/tidaltheory/lens/pull/69)
- Enable thumbnail generation during `add` command [#80](https://github.com/tidaltheory/lens/pull/80)
- Add `files` setting to thumbnail options [#81](https://github.com/tidaltheory/lens/pull/81)

  Accepts a glob pattern (or array of patterns) to match against the
  current image path.
