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
route.get('/meta/:hash', torrentIdMiddleware, metaRoute)

route.get('/files', torrentIdMiddleware, pickFileMiddleware(), infoRoute)
route.get('/files/:hash', torrentIdMiddleware, pickFileMiddleware(), infoRoute)

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
  '/serve/:hash',
  torrentIdMiddleware,
  pickFileMiddleware('SINGLE'),
  setFileInfoMiddleware,
  parseRangesMiddleware,
  serveRoute,
)
route.on(
  ['GET', 'HEAD'],
  '/live/:hash/*',
  torrentIdMiddleware,
  resolvePathMiddleware,
  setFileInfoMiddleware,
  parseRangesMiddleware,
  serveRoute,
)

export default route
