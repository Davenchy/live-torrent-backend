const app = require("express")();
const service = require("../services/subtitles");

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
    format: q.format || q.ft || "vtt",
    encoding: q.encoding || q.e
  };
  next();
};

// find movie's subtitle
// @ts-ignore
const movieSubtitle = (req, res, next) => {
  const { id, lang, fps } = req.movie;
  service
    .findMovieSubtitle(id, lang, fps)
    .then(subtitle => {
      req.movie.subtitle = subtitle;
      next();
    })
    .catch(err => next(err));
};

// download and process the subtitle
const processSubtitle = (req, res, next) => {
  const movie = req.movie;
  service
    .downloadSubtitle(movie.subtitle, movie.format === "vtt")
    .then(subtitle => {
      req.movie.subtitle = subtitle;
      next();
    })
    .catch(err => next(err));
};

// change subtitle encoding
const encodeSubtitle = (req, res, next) => {
  const { encoding, subtitle } = req.movie;
  if (!encoding) return next();
  service
    .changeSubtitleEncoding(subtitle.data, subtitle.encoding, encoding)
    .then(file => {
      req.movie.subtitle.data = file;
      req.movie.subtitle.encoding = encoding;
      next();
    })
    .catch(err => next(err));
};

// send subtitle
const sendSubtitles = (req, res) => {
  const { subtitle } = req.movie;
  res.attachment(subtitle.filename);
  res.setHeader("Content-Length", subtitle.data.length);
  res.setHeader(
    "Content-Type",
    `text/${subtitle.format}; charset=${subtitle.encoding}`
  );
  req.connection.setTimeout(10000);
  res.send(subtitle.data);
};

// get movie subtitle
app.get(
  "/movie/:imdbid",
  loadMovieData,
  movieSubtitle,
  processSubtitle,
  encodeSubtitle,
  sendSubtitles
);

// get all supported languages
app.get("/movie/:imdbid/langs", (req, res, next) =>
  service
    .getSupportedLanguages(req.params.imdbid)
    .then(langs => res.send(langs))
    .catch(err => next(err))
);

module.exports = app;
