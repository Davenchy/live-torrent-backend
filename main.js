#!/usr/bin/env node

// load environment variables from .env
// require("dotenv").config();

// @ts-ignore
if (!module.parent)
  require("yargs")
    .env()
    .option("OSUA", {
      desc: "OpenSubtitles User Agent",
      type: "string",
      default: "TemporaryUserAgent"
    })
    .commandDir("./cli")
    .demandCommand()
    .help().argv;
else
  module.exports = {
    search: require("./services/search"),
    subtitles: require("./services/subtitles"),
    torrents: require("./services/torrents"),
    yts: require("./services/yts"),
    errors: require("./helpers/errors")
  };
