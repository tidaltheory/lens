---
'@tidaltheory/lens': major
---

Change dominant colour strategy

Switched to using `node-vibrant` for finding dominant colours, rather than `sharp`’s built-in helper.

The `colors` key of each image object is now an object with the following keys:

-   `palette` is an array of six hex colours (`node-vibrant`’s default output)
-   `dominant` is the colour from that array with the highest `population`
