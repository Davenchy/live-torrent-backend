import WebTorrent, { type TorrentFile, type Torrent } from 'webtorrent'

export const client = new WebTorrent()

export interface TFile {
  index: number
  name: string
  length: number
  path: string
  progress: number
  downloaded: number
}

export interface TorrentInfo {
  name: string
  length: number
  comment?: string
  progress: number
  speed: number
  downloaded: number
  eta: number
  completed: boolean
  peers: number
  ratio: number
  created?: Date
  createdBy?: string
  files: TFile[]
}

/**
 * Requests torrent from webtorrent client using `torrentId`.
 *
 * If no existing torrent found, it will be added to the client, with all files
 * set as deselected.
 */
export const requestTorrent = async (torrentId: string): Promise<Torrent> => {
  const torrent = await (client.get(
    torrentId,
  ) as unknown as Promise<Torrent | null>)
  if (torrent) return torrent

  return new Promise((resolve, reject) => {
    client.add(torrentId, {
      path: './downloads',
    })

    client.on('torrent', (torrent: Torrent) => {
      for (const f of torrent.files) f.deselect()
      torrent.deselect(0, torrent.pieces.length - 1, 0)
      resolve(torrent)
    })

    client.on('error', reject)
  })
}

/**
 * Formats `TorrentFile` array to `TFile` array which could be used as a json
 * list.
 */
export const formatTorrentFiles = (files: TorrentFile[]): TFile[] => {
  return files.map((f, index) => ({
    index,
    name: f.name,
    length: f.length,
    path: f.path,
    progress: f.progress,
    downloaded: f.downloaded,
  }))
}

export const formatTorrent = (torrent: Torrent): TorrentInfo => ({
  name: torrent.name,
  length: torrent.length,
  comment: torrent.comment,
  progress: torrent.progress,
  speed: torrent.downloadSpeed,
  downloaded: torrent.downloaded,
  eta: torrent.timeRemaining,
  completed: torrent.done,
  peers: torrent.numPeers,
  ratio: torrent.ratio,
  created: torrent.created,
  createdBy: torrent.createdBy,
  files: formatTorrentFiles(torrent.files),
})
