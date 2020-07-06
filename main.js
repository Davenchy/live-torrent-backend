const app = require("./lib/server");
const config = require("./lib/config");
const createServer = require("./lib/create-server");

const chalk = require("chalk");
const cluster = require("cluster");

async function runServer({
  port = 3000,
  sslPort = 443,
  credentials = undefined,
  onHTTP = () => {},
  onHTTPS = () => {}
} = {}) {
  const { httpServer, httpsServer } = await createServer(app, credentials);
  httpServer.listen(port, onHTTP);
  if (httpsServer) httpsServer.listen(sslPort, onHTTPS);
}

async function main() {
  const { sslSupport, PORT, SSL_PORT, CLUSTERS, ENV } = config;
  const { SSL_CREDENTIALS, SSL_SUPPORTED } = await sslSupport();

  if (cluster.isMaster) {
    for (let i = 0; i < CLUSTERS; i++) cluster.fork();
    cluster.on("exit", () => cluster.fork());

    console.log(
      chalk`Main process is running on process {red ${process.pid}} in {blue ${ENV}} mode`
    );

    console.log(chalk`HTTP Server is running on port {green ${PORT}}`);
    if (SSL_SUPPORTED)
      console.log(chalk`HTTPS Server is running on port {green ${SSL_PORT}}`);

    console.log("");
  } else
    runServer({
      credentials: SSL_CREDENTIALS,
      port: PORT,
      sslPort: SSL_PORT,
      onHTTP() {
        console.log(
          chalk`{blue HTTP} server is running on process {red ${process.pid}}`
        );
      },
      onHTTPS() {
        console.log(
          chalk`{yellow HTTPS} server is running on process {red ${process.pid}}`
        );
      }
    });
}

// @ts-ignore
if (!module.parent) main();
else {
  module.exports = {
    app,
    config,
    createServer,
    runServer,
    services: {
      search: require("./services/search"),
      subtitles: require("./services/subtitles"),
      torrents: require("./services/torrents"),
      yts: require("./services/yts")
    },
    errors: require("./helpers/errors")
  };
}
