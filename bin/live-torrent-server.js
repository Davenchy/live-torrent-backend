#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const ora = require("ora");

const cluster = require("cluster");
const server = require("../server");
// @ts-ignore
const { version } = require("../package.json");

const spinner = ora();

if (cluster.isMaster) {
  const { argv } = yargs
    .usage("Usage: live-torrent <options>")
    .usage(
      "Note: to stop clusters kill the master process with the signal 'SIGUSR2' "
    )
    .env(true)
    .option("p", {
      alias: "port",
      describe: "internal server port",
      default: 8080
    })
    .option("clusters", {
      describe: "run the server in clusters",
      default: 1
    })
    .option("full-core-clusters", {
      describe: "run the server in full core clusters"
    })
    .option("cpus", {
      describe: "print the number of cpus"
    })
    .number("port")
    .number("clusters")
    .boolean("full-core-clusters")
    .boolean("cpus")
    .help("help", "Show this help message and exit")
    .version(version);

  spinner.start();

  if (argv.cpus) {
    spinner.succeed(chalk`CPUS: {blue ${require("os").cpus().length}}`);
    process.exit();
  } else if (typeof argv.port !== "number" || isNaN(argv.port)) {
    spinner.fail(
      chalk`Invalid Argument: {yellow 'port'} must be a number e.g.: {green 8080}`
    );
    process.exit(1);
  }

  let clusters = 0;

  if (argv.fullCoreClusters) {
    clusters = require("os").cpus().length;
  } else if (argv.clusters > 0) {
    clusters = argv.clusters;
  }

  spinner.info(chalk`Master Process: {green ${process.pid}}`);

  if (clusters > 0)
    for (let i = 0; i < clusters; i++) cluster.fork({ PORT: argv.port });

  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      spinner.fail(
        chalk`worker {green ${worker.id}} on process {blue ${worker.process.pid}} {red crashed}.`
      );
      spinner.succeed("Starting a new worker...");
      cluster.fork({ PORT: argv.port });
    }
  });

  const killClusters = () => {
    Object.values(cluster.workers).forEach(worker => {
      spinner.succeed(
        chalk`Killing cluster {blue ${worker.id}} on process {red ${worker.process.pid}}`
      );
      worker.disconnect();
    });
    process.exit();
  };

  process.on("SIGUSR2", killClusters);
  process.on("SIGINT", killClusters);

  spinner.succeed("Clusters loaded");
} else {
  spinner.start();

  const PORT = process.env.PORT;
  server().listen(PORT, () => {
    spinner.succeed(
      chalk`Server is running on process {green ${process.pid}} port {blue ${PORT}}`
    );
  });
  process.on("SIGINT", () => {
    spinner.succeed(
      chalk`Killing worker {blue ${cluster.worker.id}} on process {red ${process.pid}}`
    );
    process.exit();
  });
}
