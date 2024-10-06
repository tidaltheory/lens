# @tidaltheory/lens

## 1.2.1

### Patch Changes

- [#176](https://github.com/tidaltheory/lens/pull/176) [`b0f0f07`](https://github.com/tidaltheory/lens/commit/b0f0f07129decd8ca28d906e3f9e6258780e4e8c) Thanks [@stormwarning](https://github.com/stormwarning)! - Fix ModifyDate if filenames include characters after the timestamp

## 1.2.0 — 2023-04-27

### Minor Changes

- Add glob & ModifyDate metadata to `jpg` command [#161](https://github.com/tidaltheory/lens/pull/161)

## 1.1.2 — 2022-12-12

### Patch Changes

- Fix issue where an empty `meta` key would still be added if `includeMetadata` flag was false [`cb1f5cd`](https://github.com/tidaltheory/lens/commit/cb1f5cdeda88b76d8828bb59609289f13f6a87d3)
- Check for IPTC buffer before trying to parse [`6e40e54`](https://github.com/tidaltheory/lens/commit/6e40e54e56c0bf3b0d3cb8a0a54a4dde83f190fd)
- Update `sharp` to v0.31.2 [#144](https://github.com/tidaltheory/lens/pull/144)
- Update lowdb to v5.0.5 [#134](https://github.com/tidaltheory/lens/pull/134)

## 1.1.1 — 2022-10-23

### 🐛 Fixed

- Fix recording of metadata [`ba237fb`](https://github.com/tidaltheory/lens/commit/ba237fb218779e5fcff312a723933a8cc975994d)

## 1.1.0 — 2022-10-23

### 🎁 Added

- Add option to store IPTC metadata [#136](https://github.com/tidaltheory/lens/pull/136)

  Only stores `object_name` (as `title`) and `caption` currently.

## 1.0.0 — 2022-08-12

### 💣 Breaking

- Change dominant colour strategy [#119](https://github.com/tidaltheory/lens/pull/119)

  Switched to using `node-vibrant` for finding dominant colours, rather than `sharp`’s built-in helper.

  The `colors` key of each image object is now an object with the following keys:

  - `palette` is an array of six hex colours (`node-vibrant`’s default output)
  - `dominant` is the colour from that array with the highest `population`

### ♻️ Changed

- Update sharp to v0.30.7 [#99](https://github.com/tidaltheory/lens/pull/99)

## 0.5.2 — 2022-08-09

### 🐛 Fixed

- Include types in npm bundle [`b0eb237`](https://github.com/tidaltheory/lens/commit/b0eb237c35b539a12d2791d1d7544222ce39a9f2)

## 0.5.1 — 2022-08-08

### 🐛 Fixed

- Make types export more reliable [`02f93e4`](https://github.com/tidaltheory/lens/commit/02f93e486a46f359d23f0188663312322ff1ae5e)

## 0.5.0 — 2022-08-08

### 🎁 Added

- Export image object types [#112](https://github.com/tidaltheory/lens/pull/112)

  Should make it easier to work with the metadata objects in a typed environment.

## 0.4.0 — 2022-03-05

### 🎁 Added

- Allow glob paths for input source [#92](https://github.com/tidaltheory/lens/pull/92)
- Extract dominant colour from image [#95](https://github.com/tidaltheory/lens/pull/95)
- Generate AVIF and WebP formats of original image [#96](https://github.com/tidaltheory/lens/pull/96)

## 0.3.0 — 2022-03-03

### 🐛 Fixed

- Fix JPG thumbnail file output [#83](https://github.com/tidaltheory/lens/pull/83)

  JPG thumbnail images were sometimes ending up somewhat corrupted or
  otherwise not displaying properly in macOS finder or Safari (although
  seemed to work fine in Firefox). Thumbnail images are now explicitly
  output as JPG, regardless of original image format.

### 🎁 Added

- `jpg` command to convert an image to a high-quality JPG file [#87](https://github.com/tidaltheory/lens/pull/87)
- Add `useFilenameDirectory` option [#90](https://github.com/tidaltheory/lens/pull/90)

  Uses the filename (without extension) as a subdirectory next to the
  source image to contain optimised formats and thumbnails.

## 0.2.0 — 2022-02-25

### 🎁 Added

- Add basic `add` command [#69](https://github.com/tidaltheory/lens/pull/69)
- Enable thumbnail generation during `add` command [#80](https://github.com/tidaltheory/lens/pull/80)
- Add `files` setting to thumbnail options [#81](https://github.com/tidaltheory/lens/pull/81)

  Accepts a glob pattern (or array of patterns) to match against the
  current image path.
