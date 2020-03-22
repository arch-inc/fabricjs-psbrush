### fabricjs-psbrush

[![build](https://github.com/arch-inc/fabricjs-psbrush/workflows/npm-publish/badge.svg)](https://github.com/arch-inc/fabricjs-psbrush/actions?query=workflow%3Anpm-publish)
[![npm version](https://img.shields.io/npm/v/@arch-inc/fabricjs-psbrush)](https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush)

**fabricjs-psbrush** is a lightweight pressure-sensitive brush implementation for Fabric.js v3.x and v4.x.

### Usage

```html
<canvas id="main" width="720" height="480"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.2/fabric.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush@latest/dist/index.js"></script>
<script>

  // Create a Fabric.js canvas
  let canvas = new fabric.Canvas(document.getElementById("main"), {
    isDrawingMode: true,
    enablePointerEvents: true
  });

  // Initialize a brush
  let brush = new fabric.PSBrush(canvas);
  brush.width = 10;
  brush.color = "#000";
  canvas.freeDrawingBrush = brush;

</script>
```

If you use `Webpack` or other similar solutions, simply install the npm package and start using it.

TypeScript definitions are available by default. (e.g., [PSBrush.d.ts](https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush@latest/dist/PSBrush.d.ts))

```sh
npm i @arch-inc/fabricjs-psbrush
```

```javascript
import { PSBrush } from "@arch-inc/fabricjs-psbrush"
```

For more information, please refer to the following websites:

- npm package: https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush
- Demo site: https://arch-inc.github.io/fabricjs-psbrush/

### Credits

- [Jun Kato](https://junkato.jp), core algorithm developer
- [Kenta Hara](https://twitter.com/mactkg), developer
- [And all the other GitHub contributors in the original Fabric.js implementation](https://github.com/fabricjs/fabric.js/graphs/contributors)

### Dependencies

Except for the dependency for Fabric.js, this library contains a TypeScript port of [Simplify.js](https://mourner.github.io/simplify-js/), a high-performance JS polyline simplification library.

### Staying in touch

We have developed this extension in collaboration with the core developers of Fabric.js and relevant information can be found in their issue tracker.

- [Pressure support for styluses? #4885
](https://github.com/fabricjs/fabric.js/issues/4885)

---
Copyright (c) 2020 Arch Inc. (Jun Kato, Kenta Hara)