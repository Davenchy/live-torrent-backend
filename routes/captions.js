const app = require("express")();
const OSAPI = require("opensubtitles-api");
const axios = require("axios").default;
const encodingDetector = require("jschardet");
const iconv = require("iconv-lite");
const srt2vtt = require("srt-to-vtt");
const isoCodes = require("iso-language-codes");
const { Readable } = require("stream");

// console.log(typeof formatConverter);

const api = new OSAPI(process.env.OSUA || "TemporaryUserAgent");
let isLoggedIn = null;

// is logged in middleware
app.use(
  (req, res, next) => {
    if (isLoggedIn === null)
      api
        .login()
        .then(() => {
          isLoggedIn = true;
          console.log("OpenSubtitles.org: LoggedIn");
          next();
        })
        .catch(err => {
          console.error("OpenSubtitles.org: Login Failed!!");
          console.error(err);
          next();
        });
    else next();
  },
  (req, res, next) => {
    if (!isLoggedIn) res.status(500).send("OpenSubtitles.org Login Failed!");
    else next();
  }
);

app.get("/search", (req, res) => {
  const rq = req.query,
    sublanguageid = rq.lang || rq.ln || "all",
    query = rq.query || rq.q,
    limit = rq.limit || rq.l || "best",
    season = rq.season || rq.s,
    episode = rq.episode || rq.e,
    imdbid = rq.imdbid || rq.im,
    fps = rq.fps || rq.f;

  api
    .search({
      sublanguageid,
      query,
      limit,
      season,
      episode,
      imdbid,
      fps,
      extensions: ["srt", "vtt"]
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(400).send(err.message || "try again later");
    });
});

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

const movieCaption = (req, res, next) => {
  const { id, lang, fps } = req.movie;

  api
    .search({
      sublanguageid: lang,
      imdbid: id,
      limit: 1,
      extensions: ["srt", "vtt"],
      fps
    })
    .then(data => {
      const captionLangObj = Object.values(data)[0];
      if (!captionLangObj) return res.sendStatus(404);
      const captionData = captionLangObj[0];
      if (!captionData) return res.sendStatus(404);
      const { format: f } = captionData;
      if (f !== "srt" && f !== "vtt") return res.sendStatus(404);
      req.movie.caption = captionData;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(400).send(err.message || "try again later");
    });
};

const processCaption = (req, res, next) => {
  const { caption, srt } = req.movie;
  axios
    .get(caption.utf8)
    .then(response => {
      let encoding = caption.encoding;
      let data = response.data;

      // detect encoding
      if (!encoding) encoding = encodingDetector.detect(data).encoding;
      if (!encoding)
        return res.status(500).send("cannot detect caption encoding");

      // convert caption data encoding to UTF-8 if it is not
      if (encoding !== "UTF-8") {
        const decodedData = iconv.decode(data, encoding);
        data = iconv.encode(decodedData, "utf8").toString();
      }

      // convert srt to vtt format
      if (caption.format === "srt" && !srt) {
        const stream = new Readable();
        stream._read = () => {};
        stream.push(data);
        stream.on("data", chunk => {
          req.movie.caption.data = chunk;
          req.movie.caption.format = "vtt";
          req.movie.caption.filename = req.movie.caption.filename.replace(
            ".srt",
            ".vtt"
          );
          next();
        });
        stream.pipe(srt2vtt());
      } else {
        req.movie.caption.data = data;
        next();
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.message || "cannot download the caption file");
    });
};

const sendCaptions = (req, res) => {
  const { caption } = req.movie;
  res.attachment(caption.filename);
  res.setHeader("Content-Length", caption.data.length);
  res.setHeader("Content-Type", "text/vtt");
  req.connection.setTimeout(30000);
  console.log("sending");
  res.send(caption.data);
};

// get all supported languages
app.get("/movie/:imdbid/langs", (req, res) => {
  const id = req.params.imdbid;
  api
    .search({
      imdbid: id,
      limit: "best"
    })
    .then(data => {
      const langs = Object.keys(data).map((a, i) => {
        const d = isoCodes.by639_1[a];
        const b = data[a];

        if (d)
          return {
            name: d.name,
            code: d.iso639_1,
            iso: d.iso639_2B
          };
        else
          return {
            name: b.lang,
            code: b.langcode,
            iso: b.langcode
          };
      });
      res.send(langs);
    });
});

app.get(
  "/movie/:imdbid",
  loadMovieData,
  movieCaption,
  processCaption,
  sendCaptions
);

module.exports = app;
