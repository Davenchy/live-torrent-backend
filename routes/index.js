const app = require("express")();

app.use("/torrent", require("./torrent"));
app.use("/search", require("./search"));
app.use("/captions", require("./captions"));
app.use("/yts", require("./yts"));

module.exports = app;
