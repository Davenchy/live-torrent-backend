const app = require("express")();
const service = require("../services/search");
const { CustomError } = require("../helpers/errors");

app.get("/providers", (req, res) => res.send(service.providers));

app.get("/", (req, res, next) => {
  const rq = req.query,
    query = rq.query || rq.q,
    category = rq.category || rq.c,
    limit = rq.limit || rq.l,
    provider = rq.provider || rq.p;

  if (!query) throw new CustomError(400, "invalid query");

  service
    // @ts-ignore
    .search({ query, category, limit, provider })
    .then(results => res.send(results))
    .catch(err => next(err));
});

module.exports = app;
