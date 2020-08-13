const OSAPI = require("opensubtitles-api");
const axios = require("axios").default;
const { detect } = require("jschardet");
const { decode, encode, encodingExists } = require("iconv-lite");
// const srt2vtt = require("srt2vtt");
const srt2vtt = require("srt-to-vtt");
const { Readable } = require("stream");
const isoCodes = require("iso-language-codes");
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
 * @typedef {Object} Subtitle
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

class SubtitlesService {
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
   * search for movie subtitles
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
   * find a subtitle for a movie
   * @param {string} id - movie imdbid
   * @param {string} [lang] - movie's subtitle language
   * @param {string} [fps] - movie frames per second
   * @return {Promise<Subtitle>}
   */
  async findMovieSubtitle(id, lang, fps) {
    const results = await this.search({
      sublanguageid: lang,
      imdbid: id,
      limit: 1,
      fps
    });

    try {
      const language = Object.values(results)[0];
      const subtitle = language[0];

      const { format } = subtitle;
      if (format !== "srt" && format !== "vtt")
        throw { code: 404, message: "subtitle not found" };

      return subtitle;
    } catch (_) {
      throw new CustomError(404, "subtitle not found");
    }
  }

  /**
   * download subtitle data
   * @param {Subtitle} subtitle
   * @param {boolean} [onlyVTT]
   * @return {Promise<Subtitle>}
   */
  async downloadSubtitle(subtitle, onlyVTT = true) {
    // download subtitle content
    const response = await axios.get(subtitle.utf8);
    let file = response.data;

    // convert srt to vtt if needed
    if (onlyVTT && subtitle.format === "srt") {
      file = await this.convertSRT2VTT(file);
      subtitle.format = "vtt";
      subtitle.filename = subtitle.filename.replace(".srt", ".vtt");
    }

    subtitle.encoding = "UTF-8";
    subtitle.data = file;
    return subtitle;
  }

  /**
   * change subtitle file encoding to a new one
   * @param {Buffer} subtitleFile
   * @param {string} encoding
   * @return {Promise<Buffer>}
   */
  async changeSubtitleEncoding(subtitleFile, encoding) {
    // check if the new encoding is supported
    if (!encodingExists(encoding))
      throw new CustomError(
        400,
        "encoding is not supported",
        "Converting Subtitle Encoding",
        { encoding: encoding }
      );

    // detect current encoding
    const currentEncoding = detect(subtitleFile).encoding;
    if (!currentEncoding)
      throw new CustomError(
        500,
        "can not detect current subtitle file encoding",
        "Converting Subtitle Encoding"
      );

    // check if file current encoding is supported
    if (!encodingExists(currentEncoding))
      throw new CustomError(
        500,
        "current subtitle encoding is not supported",
        "Converting Subtitle Encoding",
        { encoding: currentEncoding }
      );

    // decode and encode with the new encoding
    const decodedData = decode(subtitleFile, currentEncoding);
    let buff = encode(decodedData, encoding);
    return buff;
  }

  /**
   * convert srt subtitle to vtt subtitle
   * @param {Buffer|String} file
   * @return {Promise<Buffer|String>}
   */
  convertSRT2VTT(file) {
    return new Promise((resolve, reject) => {
      let vtt = "";
      const stream = new Readable({
        read() {
          this.push(file);
        }
      });
      stream.on("data", chunk => (vtt += chunk));
      stream.on("end", () => resolve(vtt));
      stream.on("error", err => reject(err));
      stream.pipe(srt2vtt());
    });
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

module.exports = new SubtitlesService(process.env.OSUA || "TemporaryUserAgent");
