import TorrentSearchAPI, { type Torrent } from 'torrent-search-api'

export interface TorrentResult {
  title: string
  time?: string
  size: string
  magnet: string
  description?: string
  provider: string
  seeds?: number
  peers?: number
  link?: string
}

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
export const loadMagnets = async (torrents: Torrent[]): Promise<Torrent[]> => {
  const loadMagnet = async (torrent: Torrent) => {
    const magnet: string = await TorrentSearchAPI.getMagnet(torrent)
    return { ...torrent, magnet }
  }

  return Promise.all(torrents.map(loadMagnet))
}

const formatTorrentResult = async (
  torrents: Torrent[],
): Promise<TorrentResult[]> =>
  torrents.map(t => ({
    title: t.title,
    time: t.time,
    size: t.size,
    description: t.desc,
    provider: t.provider,
    peers: (t as TorrentResult).peers,
    seeds: (t as TorrentResult).seeds,
    link: (t as TorrentResult).link,
    magnet: t.magnet,
  }))

export const search = (
  query: string,
  provider: string,
  category: string,
  limit: number,
) =>
  TorrentSearchAPI.search([provider], query, category, limit)
    .then(loadMagnets)
    .then(formatTorrentResult)
