### fabricjs-psbrush

[![build](https://github.com/arch-inc/fabricjs-psbrush/workflows/npm-publish/badge.svg)](https://github.com/arch-inc/fabricjs-psbrush/actions?query=workflow%3Anpm-publish)
[![npm version](https://img.shields.io/npm/v/@arch-inc/fabricjs-psbrush)](https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farch-inc%2Ffabricjs-psbrush.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farch-inc%2Ffabricjs-psbrush?ref=badge_shield)

**fabricjs-psbrush** is a lightweight pressure-sensitive brush implementation for Fabric.js v3.x and v4.x.

**fabricjs-psbrush** は Fabric.js  v3.x および v4.x 用の軽量な感圧ブラシの実装です。

- npm package: https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush
- API document: https://arch-inc.github.io/fabricjs-psbrush/api/globals.html
- Demo site: https://arch-inc.github.io/fabricjs-psbrush/

### Usage / 使い方

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

`Webpack` 等を使っている場合は `npm install` でインストールできます。TypeScriptの型定義がついてきます。

```sh
npm i @arch-inc/fabricjs-psbrush
```

```javascript
import { PSBrush } from "@arch-inc/fabricjs-psbrush"
```

### API Documentation / APIドキュメント

All of the exported classes and interfaces are listed in [TypeDoc](https://arch-inc.github.io/fabricjs-psbrush/api/globals.html).

For instance, `PSBrush` can be constructed by [`new PSBrush(canvas)`](https://arch-inc.github.io/fabricjs-psbrush/api/globals.html#psbrush) and its instance has [various properties](https://arch-inc.github.io/fabricjs-psbrush/api/interfaces/psbrushiface.html) including `color`, `opacity`, `width`, `simplifyTolerance`, `pressureCoeff` etc. Use of these properties can be observed in [Griffith Sketch](https://gs.archinc.jp/), a web-based lightweight tool for sketching ideas.

Please note that `PSBrush` and `PSStroke` classes are listed as variables and their fields are defined separately as `PSBrushIface` and `PSStrokeIface`. This is because Fabric.js requires all relevant classes to be defined through its `fabric.util.createClass` helper function.

このモジュールが export しているすべてのクラスとインタフェースは [TypeDoc](https://arch-inc.github.io/fabricjs-psbrush/api/globals.html) で閲覧できます。

例えば `PSBrush` クラスは [`new PSBrush(canvas)`](https://arch-inc.github.io/fabricjs-psbrush/api/globals.html#psbrush) でインスタンス化でき、 [さまざまなプロパティ](https://arch-inc.github.io/fabricjs-psbrush/api/interfaces/psbrushiface.html) （`color`, `opacity`, `width`, `simplifyTolerance`, `pressureCoeff` など）を持っています。これらのプロパティの実際の利用例は、アイデアスケッチ作成用のWebサービス [Griffith Sketch](https://gs.archinc.jp/) で確認できます。

なお、 `PSBrush` と `PSStroke` は実際にはクラスですが変数 (Variables) としてリストアップされ、メンバー変数は `PSBrushIface` と `PSStrokeIface` という別のインタフェースで定義されています。これは Fabric.js 本体がクラス定義を `fabric.util.createClass` というヘルパー関数で行うように実装されているためです。

### Credits / 開発者

- [Jun Kato](https://junkato.jp), core algorithm developer
- [Kenta Hara](https://twitter.com/mactkg), developer
- See the full list of contributors [here](https://github.com/arch-inc/fabricjs-psbrush/graphs/contributors)

### Dependencies / 依存パッケージ

Except for the dependency for Fabric.js, this library contains a TypeScript port of [Simplify.js](https://mourner.github.io/simplify-js/), a high-performance JS polyline simplification library.

Fabric.js の他にパス単純化のためのライブラリ [Simplify.js](https://mourner.github.io/simplify-js/) をTypeScriptで書き直して利用しています。

### Staying in touch / 開発者に連絡

We have developed this extension in collaboration with the core developers of Fabric.js and relevant information can be found in their issue tracker.

Twitter [@ArchResearchJp](https://twitter.com/ArchResearchJp) で連絡がつきます。 Fabric.js 本家の issue でも活動しています。

- [Pressure support for styluses? #4885
](https://github.com/fabricjs/fabric.js/issues/4885)

### Library in action / 利用例

- [Demo site](https://arch-inc.github.io/fabricjs-psbrush/): GitHub Pages accompanied with this library
- [Griffith Sketch](https://gs.archinc.jp/): a web-based lightweight tool for sketching ideas.

---
Copyright (c) 2020-2021 Arch Inc. (Jun Kato, Kenta Hara)
