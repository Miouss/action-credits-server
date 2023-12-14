const commonConfig = {
  autorestart: false,
  watch: ["."],
  ignore_watch: [
    "node_modules",
    "\\.git",
    "./src/data/file-based/files/*.json",
    "./src/data/file-based/files/*.json.lock",
  ],
  watch_options: {
    followSymlinks: false,
  },
};

module.exports = {
  apps: [
    {
      ...commonConfig,
      name: "server",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/api/index.ts",
    },
    {
      ...commonConfig,
      name: "worker",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/workers/index.ts",
    },
  ],
};
