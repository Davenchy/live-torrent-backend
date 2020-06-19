const app = require("express")();

app.use("/torrent", require("./torrents"));
app.use("/search", require("./search"));
app.use("/captions", require("./captions"));
app.use("/yts", require("./yts"));

module.exports = app;
