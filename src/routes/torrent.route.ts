import { Hono } from 'hono'

import {
  infoRoute,
  metaRoute,
  parseRangesMiddleware,
  pickFileMiddleware,
  resolvePathMiddleware,
  serveRoute,
  setFileInfoMiddleware,
  torrentIdMiddleware,
} from 'controllers/torrent.controller'

const route = new Hono()

route.get('/', torrentIdMiddleware, metaRoute)
route.get('/:infoHash', torrentIdMiddleware, metaRoute)

route.get('/files', torrentIdMiddleware, pickFileMiddleware(), infoRoute)
route.get(
  '/:infoHash/files',
  torrentIdMiddleware,
  pickFileMiddleware(),
  infoRoute,
)

route.on(
  ['HEAD', 'GET'],
  '/serve',
  torrentIdMiddleware,
  pickFileMiddleware('SINGLE'),
  setFileInfoMiddleware,
  parseRangesMiddleware,
  serveRoute,
)
route.on(
  ['GET', 'HEAD'],
  '/:infoHash/serve',
  torrentIdMiddleware,
  pickFileMiddleware('SINGLE'),
  setFileInfoMiddleware,
  parseRangesMiddleware,
  serveRoute,
)
route.on(
  ['GET', 'HEAD'],
  '/:infoHash/serve/*',
  torrentIdMiddleware,
  resolvePathMiddleware('/serve/'),
  setFileInfoMiddleware,
  parseRangesMiddleware,
  serveRoute,
)

export default route
