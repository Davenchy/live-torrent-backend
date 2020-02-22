#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const signale = require("signale");
const updateNotifier = require("update-notifier");

const cluster = require("cluster");
const getServer = require("../server");
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
    .number("clusters")
    .boolean("full-core-clusters")
    .boolean("cpus")
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

  if (clusters > 0)
    for (let i = 0; i < clusters; i++) cluster.fork({ PORT: argv.port });

  // restart cluster if crashed
  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      signale.fatal(
        chalk`worker {green ${worker.id}} on process {blue ${worker.process.pid}} {red crashed}.`
      );
      signale.await("Starting a new worker...");
      cluster.fork({ PORT: argv.port });
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
  const PORT = process.env.PORT;
  const server = getServer().listen(PORT, () => {
    signale.success(
      chalk`Worker {green ${cluster.worker.id}} on process {blue ${process.pid}} is {green online}`
    );
  });

  const kill = () => {
    server.close();
    process.exit(0);
  };

  process.on("message", msg => {
    if (msg === "death") kill();
  });

  process.on("SIGTERM", kill);
  process.on("SIGINT", kill);
}
