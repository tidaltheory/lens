# @tidaltheory/lens

## 0.3.0

### Minor Changes

- [#83](https://github.com/tidaltheory/lens/pull/83) [`bccd00a`](https://github.com/tidaltheory/lens/commit/bccd00ac77bf444ac414255df98f87261cfe066f) Thanks [@stormwarning](https://github.com/stormwarning)! - Fix JPG thumbnail file output

  JPG thumbnail images were sometimes ending up somewhat corrupted or otherwise not displaying properly in macOS finder or Safari (although seemed to work fine in Firefox). Thumbnail images are now explicitly output as JPG, regardless of original image format.

* [#87](https://github.com/tidaltheory/lens/pull/87) [`b84e304`](https://github.com/tidaltheory/lens/commit/b84e3041e1570339b8a1830d5aa56a8960ff9832) Thanks [@stormwarning](https://github.com/stormwarning)! - `jpg` command to convert an image to a high-quality JPG file

- [#90](https://github.com/tidaltheory/lens/pull/90) [`48b0449`](https://github.com/tidaltheory/lens/commit/48b0449ae3c8d25d257e834f1a7d5a01ced7beac) Thanks [@stormwarning](https://github.com/stormwarning)! - Add `useFilenameDirectory` option

  Uses the filename (without extension) as a subdirectory next to the
  source image to contain optimised formats and thumbnails.

## 0.2.0 — 2022-02-25

#### 🎁 Added

- Add basic `add` command [#69](https://github.com/tidaltheory/lens/pull/69)
- Enable thumbnail generation during `add` command [#80](https://github.com/tidaltheory/lens/pull/80)
- Add `files` setting to thumbnail options [#81](https://github.com/tidaltheory/lens/pull/81)

  Accepts a glob pattern (or array of patterns) to match against the
  current image path.
