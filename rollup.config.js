import typescript from "@rollup/plugin-typescript";

const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/server/index.ts",
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
  {
    input: "src/client/index.ts",
    output: [
      {
        file: "public/js/chat.js",
        format: "es",
        sourcemap: !isProduction,
      },
    ],
    plugins: [typescript()],
    external: ["socket.io-client"],
  },
];
