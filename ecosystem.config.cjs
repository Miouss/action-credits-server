const { watch } = require("fs");

module.exports = {
  apps: [
    {
      name: "server",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/index.ts",
      autorestart: false,
      watch: ["./"],
      ignore_watch: [
        "node_modules",
        "\\.git",
        "./src/data/file-based/user-actions.json",
      ],
      watch_options: {
        followSymlinks: false,
      },
    },
    {
      name: "worker",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/worker.ts",
      autorestart: false,
      watch: ["./"],
      ignore_watch: [
        "node_modules",
        "\\.git",
        "./src/data/file-based/user-actions.json",
      ],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
