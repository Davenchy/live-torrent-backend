const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// env vars
require("dotenv").config();

function main(disableMiddleWares = false) {
  // middle wares
  if (!disableMiddleWares) {
    app.use(cors());
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  // routes
  app.use("/torrent", require("./routes/torrent"));
  app.use("/search", require("./routes/search"));
  app.use("/captions", require("./routes/captions"));
  app.get("/", (req, res) =>
    res.send("Live-Torrent-Backend server is running")
  );
  app.get("/ping", (req, res) => res.send());
}

// server listener
// @ts-ignore
if (!module.parent) {
  main();
  const PORT = process.env.PORT || 3000;
  const env = process.env.NODE_ENV || "production";
  app.listen(PORT, () =>
    console.log(`server is running in ${env} mode on port ${PORT}`)
  );
} else {
  /**
   * live torrent backend express.js middle ware
   * @param {boolean} [disableMiddleWares=false] - disable the default middle wares used by the backend
   * @return {object} express.js app object
   */
  module.exports = (disableMiddleWares = false) => {
    main(!!disableMiddleWares);
    return app;
  };
}
