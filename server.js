const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const chalk = require("chalk");
const cluster = require("cluster");
const os = require("os");

// env vars
require("dotenv").config();

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
  app.use("/", express.static(path.resolve("views", "public")));
}

// server listener
// @ts-ignore
if (!module.parent) {
  if (cluster.isMaster) {
    const cpus = os.cpus().length;
    for (let i = 0; i < cpus; i++) cluster.fork();
    cluster.on("exit", () => cluster.fork());
  } else {
    main();
    const PORT = process.env.PORT || 3000;
    const env = process.env.NODE_ENV || "development";
    app.listen(PORT, () =>
      console.log(
        chalk`server is running on process {red ${process.pid}} in {blue ${env}} mode on port {green ${PORT}}`
      )
    );
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
    return app;
  };
}
