const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const chalk = require("chalk");
const cluster = require("cluster");
const os = require("os");
const historyApi = require("connect-history-api-fallback");

// env vars
require("dotenv").config();

const servers = require("./create-server");
const app = servers.app;

function main(disableMiddleWares = false, logs = true) {
  // middle wares
  if (!disableMiddleWares) {
    app.use(cors());
    if (logs) app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  // routes
  app.use("/torrent", require("./routes/torrent"));
  app.use("/search", require("./routes/search"));
  app.use("/captions", require("./routes/captions"));
  app.use("/yts", require("./routes/yts"));
  app.use(historyApi());
  app.use(express.static(path.resolve("docs", ".vuepress", "dist")));
}

// server listener
// @ts-ignore
if (!module.parent) {
  if (cluster.isMaster) {
    const cpus = os.cpus().length;
    const PORT = process.env.PORT || 3000;
    const SSL_PORT = process.env.SSL_PORT || 443;
    const env = process.env.NODE_ENV || "development";

    for (let i = 0; i < cpus; i++) cluster.fork();
    cluster.on("exit", () =>
      cluster.fork({
        PORT,
        SSL_PORT
      })
    );

    console.log(
      chalk`Main process is running on process {red ${process.pid}} in {blue ${env}} mode`
    );

    console.log(chalk`HTTP Server is running on port {green ${PORT}}`);
    if (servers.isSSLSupported)
      console.log(chalk`HTTPS Server is running on port {green ${SSL_PORT}}`);

    console.log("");
  } else {
    main();
    const PORT = process.env.PORT;
    const SSL_PORT = process.env.SSL_PORT;

    servers.httpServer.listen(PORT, () =>
      console.log(
        chalk`{blue HTTP} server is running on process {red ${process.pid}}`
      )
    );

    if (servers.isSSLSupported)
      servers.httpsServer.listen(SSL_PORT, () => {
        console.log(
          chalk`{yellow HTTPS} server is running on process {red ${process.pid}}`
        );
      });
  }
} else {
  /**
   * live torrent backend express.js middle ware
   * @param {boolean} [disableMiddleWares=false] - disable the default middle wares used by the backend
   * @param {boolean} [logs=true] - show logs in the console
   * @return {object} express.js app object
   */
  module.exports = (disableMiddleWares = false, logs = true) => {
    main(!!disableMiddleWares, !!logs);
    return servers;
  };
}
