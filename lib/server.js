const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const historyApi = require("connect-history-api-fallback");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => res.redirect("/docs/"));
app.use(require("../routes"));
app.use("/docs", historyApi());
app.use("/docs", express.static(path.resolve("docs", ".vuepress", "dist")));
app.use(require("../helpers/errors").handleErrors);

module.exports = app;
