const { cpus } = require("os");
const { readFileSync: read, existsSync: exists } = require("fs");
const cluster = require("cluster");
const chalk = require("chalk");

module.exports = {
  command: ["$0", "run"],
  desc: "run live torrent server",
  builder: {
    port: {
      type: "number",
      alias: "p",
      default: 3000
    },
    sslPort: {
      type: "number",
      default: 443,
      group: "HTTPS:"
    },
    clusters: {
      type: "number",
      alias: "c",
      default: cpus().length
    },
    ssl: {
      type: "boolean",
      implies: ["cert", "key"],
      desc: "enable https",
      group: "HTTPS:"
    },
    cert: {
      type: "string",
      desc: "path to ssl cert file",
      normalize: true,
      coerce: arg => (exists(arg) ? read(arg) : undefined),
      requiresArg: "ssl",
      group: "HTTPS:"
    },
    key: {
      type: "string",
      desc: "path to ssl key file",
      normalize: true,
      coerce: arg => (exists(arg) ? read(arg) : undefined),
      requiresArg: "ssl",
      group: "HTTPS:"
    }
  },
  async handler(argv) {
    // auto enable ssl if requirements are valid
    if (argv.cert && argv.key) argv.ssl = true;

    // set important env vars
    ["OSUA"].forEach(
      k => (process.env[k] = process.env[k] ? process.env[k] : argv[k])
    );

    // support clusters
    if (cluster.isMaster) {
      for (let i = 0; i < argv.clusters; i++) cluster.fork({ argv });

      // restart cluster if crashed
      cluster.on("exit", (worker, code) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
          console.error(
            chalk`worker {green ${worker.id}} on process {blue ${worker.process.pid}} {red crashed}.`
          );
          console.log("Starting a new worker...");
          cluster.fork({ argv });
        } else {
          console.log(
            chalk`Worker {green ${worker.id}} on process {blue ${worker.process.pid}} is {red offline}`
          );
        }
      });

      // kill all clusters
      const killClusters = () => {
        Object.values(cluster.workers).forEach(worker => {
          console.error(
            chalk`Worker {green ${worker.id}} on process {blue ${worker.process.pid}} is {red offline}`
          );
          worker.send("death");
        });
        process.exit();
      };
      process.on("SIGINT", killClusters);
      process.on("SIGTERM", killClusters);

      // log server information
      console.log(chalk`Main Process: {green ${process.pid}}`);
      console.log(
        chalk`Running Mode: {green ${argv.NODE_ENV || "development"}}`
      );
      console.log(chalk`Clusters: {green ${argv.clusters}}`);
      console.log(chalk`HTTP Server Port: {green ${argv.port}}`);
      if (argv.ssl)
        console.log(chalk`HTTPS Server Port: {green ${argv.sslPort}}`);

      console.log("");
    } else {
      const app = require("../lib/server");
      const { runServer } = require("../lib/server-tools");
      const { cert, key, ssl, port, sslPort } = argv;
      const certificates = {
        cert,
        key
      };

      // create server
      const { httpServer, httpsServer } = await runServer({
        app,
        certificates: ssl ? certificates : undefined,
        port,
        sslPort,
        onHTTP() {
          console.log(
            chalk`Worker {green ${cluster.worker.id}} on process {blue ${process.pid}} with {yellow HTTP} enabled is {green online}`
          );
        },
        onHTTPS() {
          console.log(
            chalk`Worker {green ${cluster.worker.id}} on process {blue ${process.pid}} with {yellow HTTPS} enabled is {green online}`
          );
        }
      });

      const kill = () => {
        httpServer.close();
        if (httpsServer) httpsServer.close();
        process.exit(0);
      };

      process.on("message", msg => {
        if (msg === "death") kill();
      });

      process.on("SIGTERM", kill);
      process.on("SIGINT", kill);
    }
  }
};
