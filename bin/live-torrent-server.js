#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const signale = require("signale");
const { existsSync: exists } = require("fs");
const updateNotifier = require("update-notifier");

const cluster = require("cluster");
const servers = require("../server")();
// @ts-ignore
const pkg = require("../package.json");
const cpus = require("os").cpus().length;
const notifier = updateNotifier({ pkg });

if (cluster.isMaster) {
  const { argv } = yargs
    .usage("Usage: live-torrent <options>")
    .usage("Note: to stop clusters kill the master process")
    .env(true)
    .option("p", {
      alias: "port",
      describe: "internal server port",
      default: 8080
    })
    .option("ssl-port", {
      describe: "using ssl protocol",
      default: 443
    })
    .option("key", {
      describe: "ssl private key file path"
    })
    .option("cert", {
      describe: "ssl certificate file path"
    })
    .option("clusters", {
      describe: "run the server in number of clusters",
      default: 1
    })
    .option("full-core-clusters", {
      describe: chalk`run the server in {blue ${cpus}} clusters`
    })
    .option("cpus", {
      describe: "print the number of cpus"
    })
    .number("port")
    .number("ssl-port")
    .number("clusters")
    .boolean("full-core-clusters")
    .boolean("cpus")
    .string("key")
    .string("cert")
    .help("help", "Show this help message and exit")
    .version(pkg.version);

  notifier.notify({
    isGlobal: true
  });

  if (argv.cpus) {
    signale.log(chalk`CPUS: {blue ${cpus}}`);
    process.exit();
  } else if (typeof argv.port !== "number" || isNaN(argv.port)) {
    signale.info(
      chalk`Invalid Argument: {yellow 'port'} must be a number e.g.: {green 8080}`
    );
    process.exit(1);
  }

  runMasterProcess(argv);
} else {
  runWorkerProcess();
}

function runMasterProcess(argv) {
  let clusters = 0;
  if (argv.fullCoreClusters) clusters = cpus;
  else if (argv.clusters > 0) clusters = argv.clusters;

  signale.info(chalk`Master Process: {green ${process.pid}}`);
  signale.info(chalk`Server Port: {green ${argv.port}}`);

  if (servers.isSSLSupported || (exists(argv.key) && exists(argv.cert)))
    signale.info(chalk`Server SSL Port: {green ${argv.sslPort}}`);

  const envs = {
    PORT: argv.port || servers.PORT,
    SSL_PORT: argv.sslPort || servers.SSL_PORT,
    SERVER_KEY: argv.key || servers.SERVER_KEY,
    SERVER_CERT: argv.cert || servers.SERVER_CERT
  };

  if (clusters > 0) for (let i = 0; i < clusters; i++) cluster.fork(envs);

  // restart cluster if crashed
  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      signale.fatal(
        chalk`worker {green ${worker.id}} on process {blue ${worker.process.pid}} {red crashed}.`
      );
      signale.await("Starting a new worker...");
      cluster.fork(envs);
    } else {
      signale.warn(
        chalk`Worker {green ${worker.id}} on process {blue ${worker.process.pid}} is {red offline}`
      );
    }
  });

  // kill all clusters
  const killClusters = () => {
    Object.values(cluster.workers).forEach(worker => {
      signale.success(
        chalk`Worker {green ${worker.id}} on process {blue ${worker.process.pid}} is {red offline}`
      );
      worker.send("death");
    });
    process.exit();
  };
  process.on("SIGINT", killClusters);
  process.on("SIGTERM", killClusters);
}

function runWorkerProcess() {
  const { httpServer, httpsServer, PORT, SSL_PORT, isSSLSupported } = servers;

  const server = httpServer.listen(PORT, () =>
    signale.success(
      chalk`Worker {green ${cluster.worker.id}} on process {blue ${process.pid}} with {yellow HTTP} support is {green online}`
    )
  );

  let sslServer;

  if (isSSLSupported)
    sslServer = httpsServer.listen(SSL_PORT, () =>
      signale.success(
        chalk`Worker {green ${cluster.worker.id}} on process {blue ${process.pid}} with {yellow HTTPS} support is {green online}`
      )
    );

  const kill = () => {
    server.close();
    if (isSSLSupported) sslServer.close();
    process.exit(0);
  };

  process.on("message", msg => {
    if (msg === "death") kill();
  });

  process.on("SIGTERM", kill);
  process.on("SIGINT", kill);
}
