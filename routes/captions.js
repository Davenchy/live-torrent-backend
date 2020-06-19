const app = require("express")();
const service = require("../services/captions");
const { CustomError } = require("../helpers/errors");

// is logged in middleware
app.use(
  // @ts-ignore
  async (req, res, next) => {
    if (!service.isLoggedIn) await service.login();
    next();
  },
  // @ts-ignore
  (req, res, next) => {
    if (!service.isLoggedIn)
      throw new CustomError(500, "OpenSubtitles.org Login Failed!");
    next();
  }
);

app.get("/search", async (req, res) => {
  const rq = req.query;
  const sublanguageid = rq.lang || rq.ln || "all";
  const query = rq.query || rq.q;
  const limit = rq.limit || rq.l || "best";
  const season = rq.season || rq.s;
  const episode = rq.episode || rq.e;
  const imdbid = rq.imdbid || rq.im;
  const fps = rq.fps || rq.f;

  const results = await service.search({
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
  });

  res.send(results);
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
const movieCaption = async (req, res, next) => {
  const { id, lang, fps } = req.movie;
  const caption = await service.findMovieCaption(id, lang, fps);
  req.movie.caption = caption;
  next();
};

// download and process the caption
// @ts-ignore
const processCaption = async (req, res, next) => {
  const movie = req.movie;
  req.movie.caption = await service.downloadCaption(movie.caption, !!movie.srt);
  next();
};

// send caption
const sendCaptions = (req, res) => {
  const { caption } = req.movie;
  res.attachment(caption.filename);
  res.setHeader("Content-Length", caption.data.length);
  res.setHeader("Content-Type", "text/vtt");
  req.connection.setTimeout(30000);
  console.log("sending");
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
app.get("/movie/:imdbid/langs", async (req, res) => {
  const id = req.params.imdbid;
  const langs = await service.getSupportedLanguages(id);
  res.send(langs);
});

module.exports = app;
