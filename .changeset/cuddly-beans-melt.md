---
'@tidaltheory/lens': minor
---

Fix JPG thumbnail file output

JPG thumbnail images were sometimes ending up somewhat corrupted or otherwise not displaying properly in macOS finder or Safari (although seemed to work fine in Firefox). Thumbnail images are now explicitly output as JPG, regardless of original image format.
