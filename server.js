const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const chalk = require("chalk");
const cluster = require("cluster");
const os = require("os");
const historyApi = require("connect-history-api-fallback");

const servers = require("./create-server");
const app = servers.app;

/**
 * setup live-torrent-backend core
 */
function liveTorrentCore() {
  app.use("/torrent", require("./routes"));
  app.use(historyApi());
  app.use(require("./helpers/errors").handleErrors);
  app.use(express.static(path.resolve("docs", ".vuepress", "dist")));
}

function main(logs = true) {
  if (logs) app.use(morgan("dev"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  liveTorrentCore();
}

// server listener
// @ts-ignore
if (!module.parent) {
  if (cluster.isMaster) {
    const cpus = parseInt(process.env.CLUSTERS) || os.cpus().length;
    const { ENV, PORT, SSL_PORT } = servers;

    for (let i = 0; i < cpus; i++) cluster.fork();
    cluster.on("exit", () => cluster.fork());

    console.log(
      chalk`Main process is running on process {red ${process.pid}} in {blue ${ENV}} mode`
    );

    console.log(chalk`HTTP Server is running on port {green ${PORT}}`);
    if (servers.isSSLSupported)
      console.log(chalk`HTTPS Server is running on port {green ${SSL_PORT}}`);

    console.log("");
  } else {
    main();
    const { PORT, SSL_PORT } = servers;

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
   * @param {boolean} [coreOnly=false] - get the core only
   * @param {boolean} [logs=true] - show logs in the console
   * @return {object} express.js app object
   */
  module.exports = (coreOnly = true, logs = true) => {
    if (coreOnly) liveTorrentCore();
    else main(logs);
    return servers;
  };
}
