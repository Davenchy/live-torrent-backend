/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const { expect } = chai;

const app = require("../server")(true);

app.listen(3000, () => console.log("server is running on port 3000"));
const agent = chai.request.agent(app);

describe("testing captions", function() {
  it("search for shazam arabic caption", function(done) {
    this.timeout(10000);
    agent
      .get("/captions/search")
      .query({
        query: "shazam",
        limit: "best",
        lang: "ara"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).status(200);
        expect(res).to.be.json;
        const body = res.body;
        expect(Object.keys(body).length).eqls(1);
        expect(body.ar).to.be.an("object");
        expect(body.ar.filename).contains("Shazam");
        done();
      });
  });

  it("search for spider man far from home arabic caption", function(done) {
    this.timeout(10000);
    agent
      .get("/captions/search")
      .query({
        query: "spider man far from home",
        limit: "best",
        lang: "ara"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).status(200);
        expect(res).to.be.json;
        expect(Object.keys(res.body).length).eqls(1);
        expect(res.body.ar).to.be.an("object");
        expect(res.body.ar.filename).contains("Spider");
        done();
      });
  });
});

describe("testing torrent search engine", function() {
  this.timeout(10000);
  it("check search engine providers list", function(done) {
    agent.get("/search/providers").end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(1);
      done();
    });
  });

  it("searching for a yts spider man far from home torrent file", function(done) {
    agent
      .get("/search")
      .query({
        query: "Spider-Man: Far from Home (2019) [WEBRip] [1080p] [YTS] [YIFY]",
        provider: "1337x",
        category: "Movies",
        limit: 1
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body.length).eqls(1);
        expect(res.body[0].title).contains("Spider-Man");
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
  expect(res.body).to.be.an("object");
  expect(res.body.name).eqls("Sintel");
  expect(res.body.infoHash).eqls(infoHash);
  done();
};

const handleServeTest = done => (err, res) => {
  successResponse(err, res);
  expect(res.type).eqls("application/x-subrip");
  expect(res).header("Content-Length", "1652");
  expect(res).header(
    "Content-Disposition",
    "attachment; filename=\"Sintel.de.srt\""
  );
  done();
};

const handlePlaylistTest = done => (err, res) => {
  successResponse(err, res);
  expect(res.type).eqls("application/mpegurl");
  expect(res).header("Content-Length", "123");
  expect(res).header(
    "Content-Disposition",
    "attachment; filename=\"Sintel.m3u\""
  );
  done();
};

const handleDownloadTest = done => (err, res) => {
  successResponse(err, res);
  expect(res.type).eqls("application/zip");
  expect(res).header(
    "Content-Disposition",
    "attachment; filename=\"Sintel.zip\""
  );
  done();
};

const handleTorrentFileTest = done => (err, res) => {
  successResponse(err, res);
  expect(res.type).eqls("application/x-bittorrent");
  expect(res).header(
    "Content-Disposition",
    "attachment; filename=\"Sintel.torrent\""
  );
  done();
};

describe(`testing torrent services\nInfo Hash: ${infoHash}\nTorrent Id: ${torrentId}`, function() {
  this.timeout(10000);

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
      .end(handleServeTest(done));
  });

  it("serving file using fileIndex [torrentId]", function(done) {
    agent
      .get("/torrent/serve")
      .query({
        torrentId,
        fileIndex: 0
      })
      .end(handleServeTest(done));
  });

  it("serving file using fileType using typeInfo [torrentId]", function(done) {
    agent
      .get("/torrent/serve")
      .query({
        torrentId,
        fileType: "application/x-subrip"
      })
      .end(handleServeTest(done));
  });

  it("serving file using file path [selectors]", function(done) {
    agent
      .get(`/torrent/serve/${infoHash}/Sintel.de.srt`)
      .end(handleServeTest(done));
  });

  it("serving file using file index [selectors]", function(done) {
    agent.get(`/torrent/serve/${infoHash}/0`).end(handleServeTest(done));
  });

  it("serving file using file type [selectors]", function(done) {
    agent
      .get(`/torrent/serve/${infoHash}/:application/x-subrip`)
      .end(handleServeTest(done));
  });

  // playlist method

  it("get a playlist using torrentId", function(done) {
    agent
      .get("/torrent/playlist")
      .query({
        torrentId
      })
      .end(handlePlaylistTest(done));
  });

  it("get a playlist using info hash", function(done) {
    agent.get(`/torrent/playlist/${infoHash}`).end(handlePlaylistTest(done));
  });

  // download method

  it("download using torrent id", function(done) {
    agent
      .get("/torrent/download")
      .query({
        torrentId
      })
      .end(handleDownloadTest(done));
  });

  it("download using info hash", function(done) {
    agent.get(`/torrent/download/${infoHash}`).end(handleDownloadTest(done));
  });

  it("download caption using torrent id", function(done) {
    agent
      .get("/torrent/download")
      .query({
        torrentId,
        fileIndex: 0
      })
      .end(handleDownloadTest(done));
  });

  it("download caption using info hash", function(done) {
    agent.get(`/torrent/download/${infoHash}/0`).end(handleDownloadTest(done));
  });

  // get torrent file [.torrent]

  it("get torrent file [.torrent] using torrent id", function(done) {
    agent
      .get(`/torrent/torrentfile/${infoHash}`)
      .end(handleTorrentFileTest(done));
  });
  it("get torrent file [.torrent] using info hash", function(done) {
    agent
      .get("/torrent/torrentfile/")
      .query({ torrentId })
      .end(handleTorrentFileTest(done));
  });
});
