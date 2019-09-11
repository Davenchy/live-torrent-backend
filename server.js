const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// env vars
require("dotenv").config();

function main(disableMiddlewares = false) {
  // middle wares
  if (!disableMiddlewares) {
    app.use(cors());
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  // routes
  app.use("/torrent", require("./routes/torrent"));
  app.use("/search", require("./routes/search"));
  app.use("/captions", require("./routes/captions"));
}

// server listener
if (!module.parent) {
  main();
  const PORT = process.env.PORT || 3000;
  const env = process.env.NODE_ENV || "production";
  app.listen(PORT, () =>
    console.log(`server is running in ${env} mode on port ${PORT}`)
  );
} else {
  module.exports = (disableMiddlewares = false) => {
    main(!!disableMiddlewares);
    return app;
  };
}
