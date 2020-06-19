const app = require("express")();
const service = require("../services/search");
const { CustomError } = require("../helpers/errors");

app.get("/providers", (req, res) => res.send(service.providers));

app.get("/", async (req, res) => {
  const rq = req.query,
    query = rq.query || rq.q,
    category = rq.category || rq.c,
    limit = rq.limit || rq.l,
    provider = rq.provider || rq.p;

  if (!query) throw new CustomError(400, "Invalid query");

  // @ts-ignore
  const results = await service.search({ query, category, limit, provider });
  res.send(results);
});

module.exports = app;
