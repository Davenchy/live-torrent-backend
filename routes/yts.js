const router = require("express").Router();
const axios = require("axios").default;
const torrentsLib = require("../lib/torrents");
const mime = require("mime");

router.get("/search", (req, res) => {
  const { query: q } = req;
  axios
    .get("https://yts.lt/api/v2/list_movies.json", {
      params: {
        query_term: q.query || q.q || 0,
        page: q.page || q.p || 1,
        genre: q.genre || q.g || "all",
        limit: q.limit || q.l || 20,
        minimum_rating: q.rate || q.r || 0,
        sort_by: q.sort || q.s || "date_added",
        order_by: q.order || q.o || "desc",
        with_rt_ratings: true
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err));
});

router.get("/movie/:id", (req, res) =>
  axios
    .get("https://yts.lt/api/v2/movie_details.json", {
      params: {
        with_images: true,
        with_cast: true,
        movie_id: req.params.id
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err))
);

router.get("/movie/:id/suggestions", (req, res) =>
  axios
    .get("https://yts.lt/api/v2/movie_suggestions.json", {
      params: {
        movie_id: req.params.id
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err))
);

router.get("/stream/:imdbid", (req, res) => {
  let id = req.params.imdbid.toLowerCase();
  if (!id) return res.sendStatus(404);
  if (!id.startsWith("tt")) id = "tt" + id;

  // quality and size are integers each one belongs to [1, 10]
  const r = req.query;
  const quality = r.quality || r.q || 10;
  const size = r.size || r.s || 0;

  axios
    .get("https://yts.lt/api/v2/list_movies.json", {
      params: {
        query_term: id,
        limit: 1
      }
    })
    .then(({ data }) => {
      console.log("movie data is here");
      if (data.status !== "ok") throw new Error(data.status_message);
      if (data.data.movie_count === 0) return res.sendStatus(404);
      const { torrents } = data.data.movies[0];
      const torrent = selectMovieTorrent(torrents, quality, size);
      if (!torrent) return res.sendStatus(404);
      if (torrent.err) return res.status(torrent.code).send(torrent.err);
      console.log(torrent.type, torrent.quality);
      torrentsLib.request(torrent.hash, (err, torrent) => {
        if (err) throw new Error(err);
        console.log("load");
        const file = torrent.files.find(
          f => mime.getType(f.name).indexOf("video") !== -1
        );
        torrentsLib.serveFile(file, req, res);
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.message || "something went wrong");
    });
});

function selectMovieTorrent(torrents, quality, size) {
  if (torrents.length === 0) return;
  try {
    quality = parseInt(quality);
    size = parseInt(size);
  } catch (e) {
    return { err: "quality and size must be integers", code: 400 };
  }

  if (size < 0 || size > 10)
    return { err: "size must be in range [1, 10]", code: 400 };
  if (quality > 10 || quality < 1)
    return { err: "quality must be in range [1, 10]", code: 400 };

  const len = torrents.length;

  if (size === 0) {
    torrents.sort((a, b) => {
      const Ap = a.type === "blueray" ? 10 : 2;
      const Bp = b.type === "blueray" ? 10 : 2;

      const A = a.quality === "3D" ? 3000 : parseInt(a.quality);
      const B = b.quality === "3D" ? 3000 : parseInt(b.quality);
      const t = A * Ap - B * Bp;
      return t === 0 ? 0 : t > 0 ? 1 : -1;
    });
    return torrents[Math.round((((len - 1) * quality) / 10) % 10)];
  } else {
    torrents.sort((a, b) => {
      const A = a.size_bytes,
        B = b.size_bytes;
      return A === B ? 0 : A > B ? 1 : -1;
    });
    return torrents[Math.round((((len - 1) * size) / 10) % 10)];
  }
}

module.exports = router;
