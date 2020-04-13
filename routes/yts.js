const router = require("express").Router();
const axios = require("axios").default;
const torrentsLib = require("../lib/torrents");
const mime = require("mime");

const handleError = res => err => {
  if (err.message) console.error(err);
  res.status(err.code || 500).send(err.msg || err.message || "try again later");
};

const createError = (msg = "try again later", code = 500) =>
  Promise.reject({ msg, code });

// search movies
router.get("/search", (req, res) => {
  const { query: q } = req;
  getMovies({
    query_term: q.query || q.q || 0,
    page: q.page || q.p || 1,
    genre: q.genre || q.g || "all",
    limit: q.limit || q.l || 20,
    minimum_rating: q.rate || q.r || 0,
    sort_by: q.sort || q.s || "date_added",
    order_by: q.order || q.o || "desc",
    with_rt_ratings: true
  })
    .then(r => res.send(r))
    .catch(handleError(res));
});

// get movie details by its imdbid
router.get("/movie/:imdbid", (req, res) =>
  getMovies(req.params.imdbid, 1)
    .then(getFirstMovie)
    .then(getMovie)
    .then(m => res.send(m))
    .catch(handleError(res))
);

// get movie suggestions by its imdbid
router.get("/movie/:imdbid/suggestions", (req, res) =>
  getMovies(req.params.imdbid, 1)
    .then(getFirstMovie)
    .then(({ id: movie_id }) => {
      return axios
        .get("https://yts.lt/api/v2/movie_suggestions.json", {
          params: { movie_id }
        })
        .then(({ data }) => {
          console.log("movies received");
          if (data.status !== "ok")
            return createError(
              data.status_message || "movie not found",
              data.status_message ? 500 : 404
            );
          const movies = data.data.movies;
          res.send(movies);
        });
    })
    .catch(handleError(res))
);

// get movie torrents by its imdbid
router.get("/torrents/:imdbid", (req, res) =>
  getMovies(req.params.imdbid)
    .then(getFirstMovie)
    .then(movie => res.send(movie.torrents))
    .catch(handleError(res))
);

// stream movie by imdbid
router.get("/stream/:imdbid", (req, res) => {
  const r = req.query;
  const quality = r.quality || r.q;
  const type = r.type || r.t;

  getMovies(req.params.imdbid, 1)
    .then(getFirstMovie)
    .then(movie => {
      const { torrent, err } = selectMovieTorrent(
        movie.torrents,
        quality,
        type
      );

      if (err) return createError(err.msg, err.code);

      torrentsLib.request(torrent.hash, (err, torrent) => {
        if (err) return handleError(res)({ msg: err.message, code: 500 });

        const file = torrent.files.find(
          f => mime.getType(f.name).indexOf("video") !== -1
        );

        console.log("stream is ready");
        torrentsLib.serveFile(file, req, res);
      });
    })
    .catch(handleError(res));
});

// ===================================
// functions
// ===================================

function selectMovieTorrent(torrents, quality, type) {
  if (torrents.length === 0)
    return {
      err: {
        msg: "not found",
        code: 404
      }
    };

  let data = [];

  // select type
  if (!type) {
    const types = ["bluray", "web"];
    for (const ty of types) {
      const exists = torrents.some(t => t.type === ty);
      if (exists) {
        data = torrents.filter(t => t.type === ty);
        break;
      }
    }
  } else data = torrents.filter(t => t.type === type);

  if (data.length === 0)
    return {
      err: {
        msg: "no results",
        code: 404
      }
    };

  // select quality
  if (!quality) {
    const qualities = ["3D", "2160p", "1080p", "720p"];
    for (const q of qualities) {
      const exists = data.some(t => t.quality === q);
      if (exists) {
        data = data.filter(t => t.quality === q);
        break;
      }
    }
  } else data = data.filter(t => t.quality === quality);

  // if selected torrent has no data
  if (data.length === 0)
    return {
      err: {
        msg: "no results",
        code: 404
      }
    };

  // return the first torrent in the list should be the only remaining one
  return {
    torrent: data[0]
  };
}

// get movies list
function getMovies(params, limit = 20) {
  if (typeof params === "string") params = { query_term: params, limit };
  console.log("loading all movies");
  return axios
    .get("https://yts.lt/api/v2/list_movies.json", { params })
    .then(({ data }) => {
      if (data.status !== "ok")
        return createError(
          data.status_message || "movie not found",
          data.status_message ? 500 : 404
        );
      return data.data;
    });
}

// get the first movie from the movies list
function getFirstMovie(data) {
  console.log("selecting the first movie in the list");
  return new Promise((resolve, reject) => {
    const movie = data.movies[0];
    if (!movie) reject({ code: 404, msg: "movie not found" });
    else resolve(movie);
  });
}

// get movie data by its id
function getMovie(movie) {
  console.log("collection movie details");
  if (!movie) return createError("movie not found", 404);
  return axios("https://yts.lt/api/v2/movie_details.json", {
    params: { movie_id: movie.id }
  }).then(({ data }) => {
    if (data.status !== "ok")
      return createError(
        data.status_message || "movie not found",
        data.status_message ? 500 : 404
      );
    const movie = data.data.movie;
    if (!movie) return createError("movie not found", 404);
    return Promise.resolve(movie);
  });
}

module.exports = router;
