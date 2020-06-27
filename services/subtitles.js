const OSAPI = require("opensubtitles-api");
const axios = require("axios").default;
const { detect } = require("jschardet");
const { decode, encode } = require("iconv-lite");
const srt2vtt = require("srt-to-vtt");
const isoCodes = require("iso-language-codes");
const { Readable } = require("stream");
const { CustomError } = require("../helpers/errors");

/**
 * @typedef {Object} SearchOptions
 * @prop {string} [sublanguageid]
 * @prop {string} [query] - search query
 * @prop {string|number} [limit] - search results limit
 * @prop {string|number} [season] - series season
 * @prop {string|number} [episode] - series episode
 * @prop {string} [imdbid] - show imdbid
 * @prop {string|number} [fps] - video frames per second
 */

/**
 * @typedef {Object} Caption
 * @prop {string} downloads
 * @prop {string} id
 * @prop {string} lang
 * @prop {string} langName
 * @prop {number} score
 * @prop {string} url
 * @prop {string} filename
 * @prop {string|Buffer} [data]
 * @prop {string} encoding
 * @prop {string} format
 * @prop {string} [utf8]
 */

/**
 * @typedef {Object} Language
 * @prop {string} name
 * @prop {string} code
 * @prop {string} iso
 */

class CaptionsService {
  constructor(UserAgent) {
    this._isLoggedIn = false;
    this.api = new OSAPI(UserAgent);
  }

  /**
   * is opensubtitles service logged in
   * @return {boolean}
   */
  get isLoggedIn() {
    return this._isLoggedIn;
  }

  /**
   * login into opensubtitles service
   * @return {Promise}
   */
  async login() {
    try {
      await this.api.login();
      this._isLoggedIn = true;
      console.log("OpenSubtitles.org: LoggedIn!");
    } catch (err) {
      console.log("OpenSubtitles.org: Failed!");
      throw new CustomError(500, err.message, "OpenSubtitles Service Error");
    }
  }

  /**
   * search for movie captions
   * @param {SearchOptions} options
   * @return {Promise}
   */
  async search(options) {
    // set default values
    const data = Object.assign(
      {
        sublanguageid: "all",
        limit: "best",
        extensions: ["srt", "vtt"]
      },
      options
    );

    return await this.api.search(data);
  }

  /**
   * find a caption for a movie
   * @param {string} id - movie imdbid
   * @param {string} [lang] - movie's caption language
   * @param {string} [fps] - movie frames per second
   * @return {Promise<Caption>}
   */
  async findMovieCaption(id, lang, fps) {
    const results = await this.search({
      sublanguageid: lang,
      imdbid: id,
      limit: 1,
      fps
    });

    try {
      const language = Object.values(results)[0];
      const caption = language[0];

      const { format } = caption;
      if (format !== "srt" && format !== "vtt")
        throw { code: 404, message: "caption not found" };

      return caption;
    } catch (_) {
      throw new CustomError(404, "caption not found");
    }
  }

  /**
   * download caption data
   * @param {Caption} caption
   * @param {boolean} [onlyVTT]
   * @return {Promise<Caption>}
   */
  async downloadCaption(caption, onlyVTT = true) {
    // download caption content
    const response = await axios.get(caption.utf8);
    let file = response.data;

    // detect encoding
    if (!caption.encoding) caption.encoding = detect(file).encoding;
    if (!caption.encoding)
      throw { code: 500, message: "cannot detect caption encoding" };

    // fix caption encoding if needed
    if (caption.encoding !== "UTF-8") {
      const decodedData = decode(file, caption.encoding);
      file = encode(decodedData, "utf8").toString();
      caption.encoding = "UTF-8";
    }

    // convert srt to vtt if needed and return
    if (onlyVTT && caption.format === "srt") {
      const stream = new Readable();
      stream._read = () => {};
      stream.push(file);
      stream.on("data", chunk => {
        caption.data = chunk;
        caption.format = "vtt";
        caption.filename = caption.filename.replace(".srt", ".vtt");
        return caption;
      });
      stream.pipe(srt2vtt());
    } else return caption;
  }

  /**
   * get supported languages for a movie
   * @param {string} id - movie imdbid
   * @return {Promise<Language[]>}
   */
  async getSupportedLanguages(id) {
    const results = await this.search({ imdbid: id });

    const langs = Object.keys(results).map(item => {
      const d = isoCodes.by639_1[item];
      const b = results[item];

      if (d) {
        // use iso names
        return {
          name: d.name,
          code: d.iso639_1,
          iso: d.iso639_2B
        };
      } else {
        // use data from open subtitles
        return {
          name: b.lang,
          code: b.langcode,
          iso: b.langcode
        };
      }
    });

    return langs;
  }
}

module.exports = new CaptionsService(process.env.OSUA || "TemporaryUserAgent");
