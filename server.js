const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// env vars
require("dotenv").config();

function main(ops) {
  // middle wares
  app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // routes
  if (ops.torrentAPI) app.use("/torrent", require("./routes/torrent"));
  if (ops.searchAPI) app.use("/search", require("./routes/search"));
  if (ops.captionsAPI)
    app.use("/captions", require("./routes/captions")(ops.OSUA));
}

const defaultOptions = {
  OSUA: "",
  torrentAPI: true,
  searchAPI: true,
  captionsAPI: true
};

// server listener
if (!module.parent) {
  // setup the server
  main(defaultOptions);

  const PORT = process.env.PORT || 3000;
  const env = process.env.NODE_ENV || "production";
  app.listen(PORT, () =>
    console.log(`server is running in ${env} mode on port ${PORT}`)
  );
} else {
  module.exports = options => {
    // set default values
    Object.assign(options, defaultOptions);

    main(options);
    return app;
  };
}
