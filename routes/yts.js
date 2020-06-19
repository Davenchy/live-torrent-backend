const router = require("express").Router();
const torrentsLib = require("../src/torrents");
const mime = require("mime");
const service = require("../services/yts");
const { CustomError } = require("../helpers/errors");

// search movies
router.get("/search", (req, res, next) =>
  service
    .getMovies(req.query)
    .then(results => res.send(results))
    .catch(err => next(err))
);

// get movie details by its imdbid
router.get("/movie/:imdbid", (req, res, next) =>
  service
    .getMovie(req.params.imdbid, true)
    .then(movie => res.send(movie))
    .catch(err => next(err))
);

// get movie suggestions by its imdbid
router.get("/movie/:imdbid/suggestions", (req, res, next) =>
  service
    .getMovieSuggestions(req.params.id)
    .then(movies => res.send(movies))
    .catch(err => next(err))
);

// get movie torrents by its imdbid
router.get("/torrents/:imdbid", (req, res, next) =>
  service
    .getMovieTorrents(req.params.imdbid)
    .then(torrents => res.send(torrents))
    .catch(err => next(err))
);

// stream movie by imdbid
router.get("/stream/:imdbid", async (req, res, next) => {
  const r = req.query;
  const quality = r.quality || r.q;
  const type = r.type || r.t;

  try {
    const torrent = await service.selectMovieTorrent(
      req.params.imdbid,
      // @ts-ignore
      quality,
      type
    );

    torrentsLib.request(torrent.hash, (err, torrent) => {
      if (err) throw new CustomError(500, err.message || "Torrents Lib Error");
      const file = torrent.files.find(
        f => mime.getType(f.name).indexOf("video") !== -1
      );
      torrentsLib.serveFile(file, req, res);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
