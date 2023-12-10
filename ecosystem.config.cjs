module.exports = {
  apps: [
    {
      name: "server",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/index.ts",
      autorestart: false,
    },
    {
      name: "worker",
      script: "node",
      args: "--experimental-specifier-resolution=node --loader ts-node/esm ./src/worker.ts",
      autorestart: false,
    },
  ],
};
