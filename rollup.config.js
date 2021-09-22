import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import pkg from "./package.json";

const comments = function(_node, comment) {
  const { value, type } = comment;
  return type === "comment2" && /@preserve|@license/i.test(value);
};

export default [
  {
    input: "lib/index.ts",
    output: [
      {
        file: pkg.main,
        format: "umd",
        name: "psbrush",
        globals: {
          fabric: "fabric"
        }
      },
      {
        file: pkg.module,
        format: "es",
        globals: {
          fabric: "fabric"
        }
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript"),
        tsconfig: "tsconfig.json"
      }),
      terser({
        output: {
          comments
        }
      }),
      copy({
        targets: [
          { src: "dist/index.js", dest: "docs/public", rename: "lib.js" }
        ],
        hook: "writeBundle"
      })
    ]
  }
];
