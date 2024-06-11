import TorrentSearchAPI, { type Torrent } from 'torrent-search-api'

export type ProviderName =
  | '1337x'
  | 'Eztv'
  | 'Yts'
  | 'Rarbg'
  | 'Limetorrents'
  | 'ThePirateBay'
  | 'KickassTorrents'

export interface SearchOptions {
  query: string
  provider?: ProviderName | ProviderName[]
  category?: string
  limit?: number
}

export type TorrentResult = Torrent | { magnet: string }

TorrentSearchAPI.enablePublicProviders()
TorrentSearchAPI.disableProvider('Torrent9')
TorrentSearchAPI.disableProvider('TorrentProject')
TorrentSearchAPI.disableProvider('Torrentz2')

/**
 * Returns all enabled and valid torrent search provider engines.
 */
export const getProviders = () =>
  TorrentSearchAPI.getActiveProviders().map(p => ({
    name: p.name,
    categories: p.categories,
  }))

/**
 * Maps a torrent search engine results into results with magnet URIs.
 */
export const loadMagnets = async (
  torrents: Torrent[],
): Promise<TorrentResult[]> => {
  const loadMagnet = async (torrent: Torrent) => {
    const magnet: string = await TorrentSearchAPI.getMagnet(torrent)
    return { ...torrent, magnet }
  }

  return Promise.all(torrents.map(loadMagnet))
}

/**
 * Search for `query` using a torrent search `provider` engine.
 *
 * You could limit the results with `category` and `limit`.
 *
 * Defaults:
 * `query` is required!.
 * `provider` if not providers passed then all providers are selected by default.
 * `category` is `'All'` by default.
 * `limit` is 10 `by` default.
 */
export const search = async (
  options: string | SearchOptions,
): Promise<TorrentResult[]> => {
  const defaults = {
    query: '',
    provider: getProviders().map(p => p.name),
    category: 'All',
    limit: 10,
  }

  const { query, provider, category, limit } = Object.assign(
    defaults,
    typeof options === 'string' ? { query: options } : options,
  )

  const torrents = await TorrentSearchAPI.search(
    Array.isArray(provider) ? provider : [provider],
    query,
    category,
    limit,
  )
  return loadMagnets(torrents)
}
