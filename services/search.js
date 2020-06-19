const tsapi = require("torrent-search-api");

/**
 * options used in search process
 * @typedef {Object} SearchOptions
 * @prop {string} [query=""]
 * @prop {string} [category="All"]
 * @prop {number} [limit=10] - search results limit
 * @prop {string} [provider] - torrent provider to be used in search process
 */

class SearchService {
  constructor() {
    /**
     * initialize torrent search API
     */
    tsapi.enablePublicProviders();
    tsapi.disableProvider("Torrent9");
    tsapi.disableProvider("TorrentProject");
    tsapi.disableProvider("Torrentz2");
  }

  /**
   * get providers
   */
  get providers() {
    return tsapi
      .getActiveProviders()
      .map(p => ({ name: p.name, categories: p.categories }));
  }

  /**
   * search torrent files using providers
   * @param {SearchOptions} options
   * @return {Promise} - search results
   */
  async search(options) {
    // set default values
    const { provider, query, category, limit } = Object.assign(
      {
        query: "",
        category: "All",
        limit: 10,
        provider: []
      },
      options
    );

    // get results
    let results = await tsapi.search(provider, query, category, limit);

    // set the magnet and the hash for each element
    for (const index in results) {
      const magnet = await tsapi.getMagnet(results[index]);
      results[index]["magnet"] = magnet;
      results[index]["hash"] = magnet.match(/magnet:.+:.+:(.{40})/)[1];
    }

    return results;
  }
}

module.exports = new SearchService();
