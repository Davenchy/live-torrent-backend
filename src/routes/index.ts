import { Hono } from 'hono'
import searchRoute from 'routes/search.route'
import torrentRoute from 'routes/torrent.route'

const routes = new Hono()

routes.route('/search', searchRoute)
routes.route('/torrent', torrentRoute)

export default routes
