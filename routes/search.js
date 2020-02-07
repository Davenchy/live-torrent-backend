const app = require("express")();
const tsapi = require("torrent-search-api");

tsapi.enablePublicProviders();
tsapi.disableProvider("Torrent9");
tsapi.disableProvider("TorrentProject");
tsapi.disableProvider("Torrentz2");

app.get("/providers", (req, res) => {
  res.send(
    tsapi
      .getActiveProviders()
      .map(p => ({ name: p.name, categories: p.categories }))
  );
});

app.get("/", async (req, res) => {
  const rq = req.query,
    query = rq.query || rq.q,
    category = rq.category || rq.c,
    limit = rq.limit || rq.l,
    provider = rq.provider || rq.p;

  if (!query) return res.status(400).send("query is needed!");

  try {
    /**
     * @type {object[]}
     */
    let results = await tsapi.search.apply(tsapi, [
      ...(() => (provider ? [[provider]] : []))(),
      query || "",
      category || "All",
      limit || 10
    ]);

    for (let i in results) {
      const magnet = await tsapi.getMagnet(results[i]);
      results[i].magnet = magnet;
      results[i].hash = magnet.match(/magnet:.+:.+:(.{40})/)[1];
    }

    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "");
  }
});

module.exports = app;
