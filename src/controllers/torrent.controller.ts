import type { Readable } from 'node:stream'
import FuzzySearch from 'fuzzy-search'
import type { Context, Next } from 'hono'
import { stream } from 'hono/streaming'
import mime from 'mime'
import rangeParser from 'range-parser'
import {
  formatTorrent,
  formatTorrentFiles,
  requestTorrent,
} from 'services/torrent.service'
import {
  FileNotFoundError,
  NoSelectionError,
  TorrentInvalidError,
} from 'src/utils/errors'
import type { FlattenType } from 'src/utils/general'
import { concat, firstAvailable, flatten } from 'src/utils/general'
import { nodeStreamConvertor } from 'src/utils/streams'
import type { Torrent, TorrentFile } from 'webtorrent'

export type SelectionMode = 'SINGLE' | 'MULTIPLE'

/**
 * This middleware will check if the torrentId or infoHash is provided.
 * If torrentId found, it will try to get the torrent object, and sets
 * the following keys:
 *    torrentId? - the actual torrentId value.
 *    torrent? - the torrent object from webtorrent related to the torrentId.
 *
 *  Example Routes:
 *    METHOD /:hash/...
 *    METHOD /...?id=...
 */
export const torrentIdMiddleware = async (c: Context, next: Next) => {
  const torrentId = firstAvailable<string | undefined>(
    [c.req.query('id'), c.req.param('hash')],
    undefined,
  )

  if (!torrentId) throw TorrentInvalidError()

  try {
    const torrent = await requestTorrent(torrentId)

    c.set('torrentId', torrentId)
    c.set('torrent', torrent)
  } catch (err) {
    throw TorrentInvalidError(err as Error)
  }

  next()
}

/**
 *
 * Selects torrent file/s from `torrent.files`.
 *
 * This middleware should be used after torrentIdMiddleware.
 *
 * The selected file/s are set to the key `selections`
 * It could be **multiple files** or **single file** or **an empty array**.
 *
 * Also if selectionMode is **SINGLE** then it will set the keys `file-serve`
 * and `file-path` the same as **resolvePathMiddleware**, So you could use it
 * before **serveRoute** instead of **resolvePathMiddleware**
 *
 * Parses the following query values:
 *
 * q<string>: file name/path search query
 *
 * index|i<number>: the file index, could path multiple separated by commas
 *    e.g: i=0,1,2,3,... .
 *
 * User could use multiple `q and i` queries together for multiple selections.
 *
 * Usage:
 * `pickFileMiddleware('SINGLE')`:
 *    For single file selection, if no any selection then throws HTTPException.
 *
 * `pickFileMiddleware('MULTIPLE')`:
 *    For multiple file selections, if no any selection then selects all files
 *    by default.
 *
 * The default **selectionMode** is `MULTIPLE`
 *
 * Example Routes:
 *
 * METHOD /?q=...
 * METHOD /?i=...
 * METHOD /?q=...&i=...&i=0,1,2&...
 *
 */
export const pickFileMiddleware =
  (selectionMode: SelectionMode = 'MULTIPLE') =>
  (c: Context, next: Next) => {
    const torrent: Torrent = c.get('torrent')
    if (!torrent) throw TorrentInvalidError()

    const queries: string[] = flatten([c.req.queries('q')])
    const indexes: number[] = flatten<string>([
      c.req
        .queries('i')
        ?.map<string | string[]>(i =>
          i.indexOf(',') !== -1 ? i.split(',') : i,
        ) as FlattenType<string>,
    ]).map(i => Number.parseInt(i))

    let selections: TorrentFile[] = []

    const searcher = new FuzzySearch(torrent.files, ['name', 'path'])

    for (const q of queries) selections = concat(selections, searcher.search(q))

    for (const index of indexes)
      selections = concat(selections, torrent.files, (_, i) => index === i)

    if (selectionMode === 'MULTIPLE' && selections.length === 0)
      selections = torrent.files

    if (selectionMode === 'SINGLE' && selections.length === 0)
      throw NoSelectionError()

    c.set(
      'selections',
      selectionMode === 'SINGLE' && selections.length > 0
        ? [selections[0]]
        : selections,
    )

    if (selectionMode === 'SINGLE' && selections.length >= 1) {
      c.set('file-path', selections[0].path)
      c.set('file-serve', selections[0])
    }

    next()
  }

export const infoRoute = (c: Context) => {
  const selections: TorrentFile[] | undefined = c.get('selections')

  if (selections === undefined)
    throw new Error('No selections found, use pickFileMiddleware first!')
  return c.json(formatTorrentFiles(selections))
}

/**
 * Returns the torrent metadata
 */
export const metaRoute = (c: Context) => {
  const torrent: Torrent = c.get('torrent')
  if (!torrent)
    throw new Error('torrent is not set, use torrentIdMiddleware first!')
  return c.json(formatTorrent(torrent))
}

/**
 * Parses the URL path after a separator e.g. `/serve`
 * Example:
 * GET `/api/torrent/serve/path/to/file.mp4`
 * PARSED TO: `/path/to/file.mp4`
 *
 * After parsing the path and assigns it to the key `file-path`, then will
 * search for a torrent file at that path then assigns it to `file-serve` key.
 */
export const resolvePathMiddleware = (c: Context, next: Next) => {
  const hash = c.req.param('hash')
  const { routePath, path: fullPath } = c.req

  // check if separator exists in the path
  if (!hash) throw new Error(`Invalid hash: ${hash}`)

  // get the actual path
  let path = routePath.replace(':hash', hash)
  path = path.substring(0, path.length - 1)
  path = fullPath.replace(path, '')
  c.set('file-path', path)

  // get the torrent object
  const torrent: Torrent | undefined = c.get('torrent')
  if (!torrent)
    throw new Error('torrent is not set, use torrentIdMiddleware first!')

  // search for the file
  const result = torrent.files.find(f => f.path === path)
  if (!result) throw FileNotFoundError()

  // set the search result
  c.set('file-serve', result)

  next()
}

/**
 * Reads the key `file-serve` set by `resolvePathMiddleware`
 * Sets the content-type, accept-range and content-disposition headers
 */
export const setFileInfoMiddleware = (c: Context, next: Next) => {
  // get the file to serve
  const file = c.get('file-serve')

  // make sure that the file is exists
  if (!file)
    throw new Error(
      'file-serve is not set, use resolvePathMiddleware or pickFileMiddleware first!',
    )

  // set content-type header
  c.res.headers.set(
    'Content-Type',
    mime.getType(file.name) || 'application/octet-stream',
  )

  // Support range-requests
  c.res.headers.set('Accept-Ranges', 'bytes')

  // Set the name of the file (for the "Save As" dialog)
  c.res.headers.set(
    'Content-Disposition',
    `attachment; filename="${file.name}"`,
  )

  next()
}

export const parseRangesMiddleware = (c: Context, next: Next) => {
  // get the file to serve
  const file = c.get('file-serve')
  // make sure that the file is exists
  if (!file)
    throw new Error(
      'file-serve is not set, use resolvePathMiddleware or pickFileMiddleware first!',
    )

  // `rangeParser` returns an array of ranges on success, and an error code
  // (negative number) on fail.
  const range = rangeParser(file.length, c.req.header('range') || '')

  if (Array.isArray(range)) {
    // indicates that range-request was understood
    c.status(206)

    // get the first range to serve
    const { start, end } = range[0]

    // set content range
    c.header('Content-Range', `bytes ${start}-${end}/${file.length}`)
    // set content length
    c.header('Content-Length', (end - start + 1).toString())

    // set the range key, so that we can use it in the next middleware
    c.set('range', { start, end })
  } else {
    // serve the whole file at once
    // set the content length
    c.status(200)
    c.header('Content-Length', file.length)
  }

  // if it is head then end here
  if (c.req.method === 'HEAD') return c.body(null)

  next()
}

/**
 * serve a file
 */
export const serveRoute = (c: Context) => {
  // get the file to serve
  const file: TorrentFile | undefined = c.get('file-serve')
  // make sure that the file is exists
  if (!file)
    throw new Error(
      'file-serve is not set, use resolvePathMiddleware or pickFileMiddleware first!',
    )

  // load requested ranges
  const range: { start: number; end: number } | undefined = c.get('range')

  // stream the file
  return stream(c, async stream => {
    // deselect file on stream abort, this part is buggy
    stream.onAbort(() => file.deselect())

    // convert NodeJS ReadableStream to Web StreamAPI ReadableStream
    const readable = nodeStreamConvertor(
      file.createReadStream(range) as unknown as Readable,
    )

    // Pipe stream to response
    await stream.pipe(readable)
  })
}
