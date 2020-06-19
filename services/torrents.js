const trackers = require("../helpers/torrent-trackers");
const rangeParser = require("range-parser");
const WebTorrent = require("webtorrent");
const mime = require("mime");
const pump = require("pump");
const client = new WebTorrent();

/**
 * torrent file in form of json object
 *
 * @typedef {Object} JSONTorrentFile
 * @property {string} name - the file name
 * @property {string} path - the path of the file without the first slash
 * @property {string} type - the file mime type
 * @property {number} size - file size in bytes
 * @property {number} downloaded - downloaded file bytes
 * @property {number} index - the index of the file inside the torrent file files list
 */

/**
 * Converts torrent file Object into json
 *
 * @param {object} file
 * @param {number} index
 * @return {JSONTorrentFile} torrent file object in json form
 */
const fileToJSON = (file, index) => ({
  name: file.name,
  index,
  path: file.cleanPath,
  size: file.length,
  type: file.type,
  downloaded: file.downloaded
});

const addOns = (torrent, cb) => {
  torrent.files.forEach((f, i) => {
    f.toJSON = () => fileToJSON(f, i);
    f.type = mime.getType(f.name) || "";
    f.cleanPath = f.path.substr(torrent.name.length);
  });
  torrent.toJSON = () => ({
    name: torrent.name,
    infoHash: torrent.infoHash,
    size: torrent.length,
    peers: torrent.numPeers,
    files: torrent.files.map(f => f.toJSON())
  });
  cb(null, torrent);
};

/**
 * request torrent file by its id or info hash
 *
 * @param {string} torrentId
 * @param {function} cb
 */
function request(torrentId, cb) {
  const torrent = client.add(torrentId, { announce: trackers });
  torrent.on("error", e => {
    // @ts-ignore
    if (e.message.indexOf("Cannot add duplicate torrent") !== -1) {
      addOns(client.get(torrent.infoHash), cb);
    } else cb(e);
  });
  torrent.on("ready", () => addOns(torrent, cb));
}

//
/**
 * serveFile if a function from inside webtorrent createServer method
 *
 * @function
 * @param {object} file
 * @param {Object} req - express middleware req
 * @param {Object} res - express middleware res
 */
function serveFile(file, req, res) {
  if (!file) {
    res.statusCode = 404;
    return res.send();
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", mime.getType(file.name));

  // Support range-requests
  res.setHeader("Accept-Ranges", "bytes");

  // Set name of file (for "Save Page As..." dialog)
  // res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${file.name}`);
  res.attachment(file.name);

  // `rangeParser` returns an array of ranges, or an error code (number) if
  // there was an error parsing the range.
  let range = rangeParser(file.length, req.headers.range || "");

  if (Array.isArray(range)) {
    res.statusCode = 206; // indicates that range-request was understood

    // no support for multi-range request, just use the first range
    // @ts-ignore
    range = range[0];

    res.setHeader(
      "Content-Range",
      // @ts-ignore
      `bytes ${range.start}-${range.end}/${file.length}`
    );
    // @ts-ignore
    res.setHeader("Content-Length", range.end - range.start + 1);
  } else {
    range = null;
    res.setHeader("Content-Length", file.length);
  }

  if (req.method === "HEAD") {
    return res.end();
  }

  // @ts-ignore
  pump(file.createReadStream(range), res);
}

module.exports = {
  client,
  request,
  serveFile,
  fileToJSON
};
