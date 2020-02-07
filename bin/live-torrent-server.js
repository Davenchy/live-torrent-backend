#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const ora = require("ora");

const server = require("../server");
const { version } = require("../package.json");

const { argv } = yargs
  .usage("Usage: live-torrent <options>")
  .env(true)
  .option("p", {
    alias: "port",
    describe: "internal server port",
    default: 8080
  })
  .number("port")
  .help("help", "Show this help message and exit")
  .version(version);

const spinner = ora("Starting the server").start();

if (typeof argv.port !== "number" || isNaN(argv.port)) {
  spinner.fail(
    chalk`Invalid Argument: {yellow 'port'} must be a number e.g.: {green 8080}`
  );
  process.exit(1);
}

server().listen(argv.port, () => {
  spinner.succeed(chalk`Server is running on port {blue ${argv.port}}`);
});
