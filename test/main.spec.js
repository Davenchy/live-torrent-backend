/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const { expect } = chai;

const { httpServer, app } = require("../server")();
const getPort = require("get-port");
let agent;

before(function() {
  return new Promise(resolve => {
    getPort().then(port => {
      httpServer.listen(port, () => {
        console.log("testing http server on port", port);
        agent = chai.request.agent(app);
        resolve();
      });
    });
  });
});

const isGoodResponse = (err, res) => {
  if (err) throw err;
  expect(err).to.be.null;
  expect(res).status(200);
  expect(res).to.be.json;
};

// captions section
describe("Captions API", function() {
  this.timeout(15000);
  this.retries(4);

  it("search for Shazam arabic caption", function(done) {
    agent
      .get("/captions/search")
      .query({
        query: "shazam",
        limit: "best",
        lang: "ara"
      })
      .end((err, res) => {
        isGoodResponse(err, res);
        const body = res.body;
        const langs = Object.keys(body);
        expect(langs.length).eqls(1);
        expect(langs[0]).eqls("ar");
        expect(body.ar).to.be.an("object");
        expect(body.ar.filename).contains("Shazam");
        done();
      });
  });

  it("search for Shazam english caption using its imdb id 'tt0448115'", function(done) {
    agent
      .get("/captions/search")
      .query({
        imdbid: "tt0448115",
        limit: "best",
        lang: "eng"
      })
      .end((err, res) => {
        isGoodResponse(err, res);
        const body = res.body;
        const langs = Object.keys(body);
        expect(langs.length).eqls(1);
        expect(langs[0]).eqls("en");
        expect(body.en).to.be.an("object");
        expect(body.en.filename).contains("Shazam");
        done();
      });
  });

  it("get Shazam arabic caption using its movie imdbid 'tt0448115'", function(done) {
    agent
      .get("/captions/movie/tt0448115")
      .query({
        lang: "ara"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).status(200);
        expect(res.type).eqls("text/vtt");
        done();
      });
  });

  it("get all supported languages 'tt0448115'", function(done) {
    agent.get("/captions/movie/tt0448115/langs").end((err, res) => {
      isGoodResponse(err, res);
      expect(res.body)
        .to.be.an("Array")
        .with.length.greaterThan(0);
      done();
    });
  });
});

describe("Search API", function() {
  this.timeout(30000);
  this.retries(4);

  it("engine providers", function(done) {
    agent.get("/search/providers").end((err, res) => {
      isGoodResponse(err, res);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(1);
      done();
    });
  });

  it("searching for Shazam movie", function(done) {
    this.timeout(30000);
    this.retries(4);
    agent
      .get("/search")
      .query({
        query: "Shazam",
        provider: "1337x",
        limit: 1
      })
      .end((err, res) => {
        isGoodResponse(err, res);
        expect(res.body).to.be.an("array");
        expect(res.body.length).eqls(1);
        expect(res.body[0].title).contains("Shazam");
        done();
      });
  });
});

describe("YTS API", function() {
  let movie;
  this.timeout(30000);
  this.retries(4);

  it("search for Shazam movie", function(done) {
    agent
      .get("/yts/search")
      .query({
        query: "shazam",
        limit: 1,
        sort: "year",
        order: "asc"
      })
      .end((err, res) => {
        isGoodResponse(err, res);
        const data = res.body;
        expect(data.movie_count).eqls(1);
        expect(data.movies)
          .to.be.an("Array")
          .length(1);

        movie = data.movies[0];
        expect(movie.title).contains("Shazam");
        done();
      });
  });

  it("get Shazam movie details", function(done) {
    if (!movie) this.skip();
    agent.get(`/yts/movie/${movie.imdb_code}`).end((err, res) => {
      isGoodResponse(err, res);
      const data = res.body;
      expect(data.title_long).eqls(movie.title_long);
      expect(data.id).eqls(movie.id);
      expect(data.imdb_code).eqls(movie.imdb_code);
      done();
    });
  });

  it("get movie suggestions", function(done) {
    if (!movie) this.skip();
    agent.get(`/yts/movie/${movie.imdb_code}/suggestions`).end((err, res) => {
      isGoodResponse(err, res);
      expect(res.body)
        .to.be.an("Array")
        .of.length(4);
      done();
    });
  });

  it("get torrents and qualities", function(done) {
    if (!movie) this.skip();
    agent.get(`/yts/torrents/${movie.imdb_code}`).end((err, res) => {
      isGoodResponse(err, res);
      expect(res.body)
        .to.be.an("Array")
        .length.greaterThan(0);
      done();
    });
  });

  it("stream Shazam movie", function(done) {
    if (!movie) this.skip();
    agent
      .get(`/yts/stream/${movie.imdb_code}`)
      .buffer()
      .parse((res, cb) => {
        expect(res).status(200);
        expect(res).header("Content-Type", "video/mp4");
        cb(null);
      })
      .end(err => {
        if (err) throw err;
        expect(err).to.be.null;
        done();
      });
  });
});

const infoHash = "08ada5a7a6183aae1e09d831df6748d566095a10";
const torrentId =
  "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel";

const successResponse = (err, res) => {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
};

const handleInfoTest = done => (err, res) => {
  successResponse(err, res);
  expect(res).to.be.json;
  expect(res.body.name).eqls("Sintel");
  expect(res.body.infoHash).eqls(infoHash);
  done();
};

const generalHandler = (done, type) => (err, res) => {
  successResponse(err, res);
  expect(res.type).eqls(type);
  done();
};

describe(`Torrent API\nInfo Hash: ${infoHash}\nTorrent Id: ${torrentId}`, function() {
  this.timeout(30000);
  this.retries(4);

  // info method
  it("collecting torrent file info using torrent id", function(done) {
    agent
      .get("/torrent/info")
      .query({ torrentId })
      .end(handleInfoTest(done));
  });

  it("collecting torrent file info using infoHash", function(done) {
    agent.get("/torrent/info/" + infoHash).end(handleInfoTest(done));
  });

  // serve method
  it("serving file using filePath [torrentId]", function(done) {
    agent
      .get("/torrent/serve/")
      .query({
        torrentId,
        filePath: "Sintel.de.srt"
      })
      .end(generalHandler(done, "application/x-subrip"));
  });

  it("serving file using fileIndex [torrentId]", function(done) {
    agent
      .get("/torrent/serve")
      .query({
        torrentId,
        fileIndex: 0
      })
      .end(generalHandler(done, "application/x-subrip"));
  });

  it("serving file using fileType using typeInfo [torrentId]", function(done) {
    agent
      .get("/torrent/serve")
      .query({
        torrentId,
        fileType: "application/x-subrip"
      })
      .end(generalHandler(done, "application/x-subrip"));
  });

  it("serving file using file path [selectors]", function(done) {
    agent
      .get(`/torrent/serve/${infoHash}/Sintel.de.srt`)
      .end(generalHandler(done, "application/x-subrip"));
  });

  it("serving file using file index [selectors]", function(done) {
    agent
      .get(`/torrent/serve/${infoHash}/0`)
      .end(generalHandler(done, "application/x-subrip"));
  });

  it("serving file using file type [selectors]", function(done) {
    agent
      .get(`/torrent/serve/${infoHash}/:application/x-subrip`)
      .end(generalHandler(done, "application/x-subrip"));
  });

  // playlist method

  it("get a playlist using torrentId", function(done) {
    agent
      .get("/torrent/playlist")
      .query({
        torrentId
      })
      .end(generalHandler(done, "application/mpegurl"));
  });

  it("get a playlist using info hash", function(done) {
    agent
      .get(`/torrent/playlist/${infoHash}`)
      .end(generalHandler(done, "application/mpegurl"));
  });

  // get torrent file [.torrent]

  it("get torrent file [.torrent] using torrent id", function(done) {
    agent
      .get(`/torrent/torrentfile/${infoHash}`)
      .end(generalHandler(done, "application/x-bittorrent"));
  });
  it("get torrent file [.torrent] using info hash", function(done) {
    agent
      .get("/torrent/torrentfile/")
      .query({ torrentId })
      .end(generalHandler(done, "application/x-bittorrent"));
  });
});
