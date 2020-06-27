const app = require("express")();
const service = require("../services/captions");
const { CustomError } = require("../helpers/errors");

// is logged in middleware
app.use((req, res, next) => {
  if (!service.isLoggedIn)
    service
      .login()
      .then(() => next())
      .catch(err => next(err));
});

app.get("/search", (req, res, next) => {
  const rq = req.query;
  const sublanguageid = rq.lang || rq.ln || "all";
  const query = rq.query || rq.q;
  const limit = rq.limit || rq.l || "best";
  const season = rq.season || rq.s;
  const episode = rq.episode || rq.e;
  const imdbid = rq.imdbid || rq.im;
  const fps = rq.fps || rq.f;

  service
    .search({
      // @ts-ignore
      sublanguageid,
      // @ts-ignore
      query,
      // @ts-ignore
      limit,
      // @ts-ignore
      season,
      // @ts-ignore
      episode,
      // @ts-ignore
      imdbid,
      // @ts-ignore
      fps,
      extensions: ["srt", "vtt"]
    })
    .then(results => res.send(results))
    .catch(err => next(err));
});

// load movie's data
// @ts-ignore
const loadMovieData = (req, res, next) => {
  const { query: q, params: p } = req;
  req.movie = {
    id: p.imdbid,
    lang: q.lang || q.l || "eng",
    fps: q.fps || q.f,
    srt: q.allow_srt || q.s
  };
  next();
};

// find movie's caption
// @ts-ignore
const movieCaption = (req, res, next) => {
  const { id, lang, fps } = req.movie;
  service
    .findMovieCaption(id, lang, fps)
    .then(caption => {
      req.movie.caption = caption;
      next();
    })
    .catch(err => next(err));
};

// download and process the caption
// @ts-ignore
const processCaption = (req, res, next) => {
  const movie = req.movie;
  service
    .downloadCaption(movie.caption, !!movie.srt)
    .then(caption => {
      req.movie.caption = caption;
      next();
    })
    .catch(err => next(err));
};

// send caption
const sendCaptions = (req, res) => {
  const { caption } = req.movie;
  res.attachment(caption.filename);
  res.setHeader("Content-Length", caption.data.length);
  res.setHeader("Content-Type", "text/vtt");
  req.connection.setTimeout(30000);
  res.send(caption.data);
};

// get movie caption
app.get(
  "/movie/:imdbid",
  loadMovieData,
  movieCaption,
  processCaption,
  sendCaptions
);

// get all supported languages
app.get("/movie/:imdbid/langs", (req, res, next) =>
  service
    .getSupportedLanguages(req.params.imdbid)
    .then(langs => res.send(langs))
    .catch(err => next(err))
);

module.exports = app;
