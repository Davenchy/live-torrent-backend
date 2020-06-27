const axios = require("axios").default;
const { CustomError } = require("../helpers/errors");

/**
 * @typedef {Object} SearchOptions
 */

/**
 * @typedef {Object} TorrentFile
 */

class YTSService {
  /**
   * search movies
   * @param {Object} options - search options
   */
  async search(options) {
    options = Object.assign(
      {
        query: 0,
        page: 1,
        genre: "all",
        limit: 20,
        minimum_rating: 0,
        sort_by: "date_added",
        order_by: "desc",
        with_rt_ratings: true
      },
      options
    );

    if (options.query) options.query_term = options.query;
    return this.getMovies(options);
  }

  /**
   * get a list of movies
   * @param {SearchOptions|String} [params]
   * @param {number} [limit=20]
   * @return {Promise}
   */
  async getMovies(params, limit = 20) {
    if (params && typeof params === "string")
      params = { query_term: params, limit };

    const { data } = await axios.get("https://yts.lt/api/v2/list_movies.json", {
      params
    });

    if (data.status !== "ok")
      throw new CustomError(500, data.status_message || "yts service error");

    if (data.data.movie_count === 0)
      throw new CustomError(404, "no results found");
    
    return data.data;
  }

  /**
   * get a movie by its id
   * @param {string} id - movie imdbid
   * @param {boolean} [details=false] return extra details
   * @return {Promise}
   */
  async getMovie(id, details = false) {
    const { movies } = await this.getMovies(id, 1);
    const movie = movies[0];
    if (!movie) throw new CustomError(404, "movie not found");

    if (!details) return movie;
    else {
      const { data } = await axios("https://yts.lt/api/v2/movie_details.json", {
        params: { movie_id: movie.id }
      });

      if (data.status !== "ok")
        throw new CustomError(500, data.status_message || "yts servce error");
      const newMovie = data.data.movie;
      if (!newMovie) throw new CustomError(404, "movie not found");
      return newMovie;
    }
  }

  /**
   * get movie suggestions by its id
   * @param {string} id - movie imdbid
   * @return {Promise<Array>}
   */
  async getMovieSuggestions(id) {
    const movie = await this.getMovie(id);
    const { data } = await axios.get(
      "https://yts.lt/api/v2/movie_suggestions.json",
      {
        params: { movie_id: movie.id }
      }
    );

    if (data.status !== "ok")
      throw new CustomError(500, data.status_message || "yts service error");

    return data.data.movies;
  }

  /**
   * get movie torrents by its imdbid
   * @param {string} id - movie imdbid
   */
  async getMovieTorrents(id) {
    const movie = await this.getMovie(id);
    return movie.torrents;
  }

  /**
   * select movie torrent file
   * @param {string} id - movie imdbid
   * @param {string} quality - movie quality [720p, 1080p, 2160p, 3D]
   * @param {string} type  - movie type [bluray, web]
   * @return {TorrentFile} torrent file
   */
  async selectMovieTorrent(id, quality, type) {
    const torrents = await this.getMovieTorrents(id);
    const throwError = () => {
      throw new CustomError(404, "torrent file not found");
    };

    if (torrents.length === 0) throwError();

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

    if (data.length === 0) throwError();

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
    if (data.length === 0) throwError();

    // return the first torrent in the list should be the only remaining one
    return data[0];
  }
}

module.exports = new YTSService();
