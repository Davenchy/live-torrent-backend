#!/usr/bin/env node

// @ts-ignore
if (!module.parent)
  global["argv"] = require("yargs")
    .env()
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
