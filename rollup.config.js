import typescript from "@rollup/plugin-typescript";

const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: !isProduction,
      },
    ],
    plugins: [typescript()],
    external: ["express", "cors", "node:url"],
  },
];
