const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// env vars
require("dotenv").config();

// middle wares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use("/torrent", require("./routes/torrent"));
app.use("/search", require("./routes/search"));
app.use("/captions", require("./routes/captions"));

// server listener
if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () =>
    console.log(
      `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
} else {
  module.exports = app;
}
