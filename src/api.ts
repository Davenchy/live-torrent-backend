import { Hono } from 'hono'
import searchRoute from 'routes/search.route'
import torrentRoute from 'routes/torrent.route'

const api = new Hono()

api.route('/search', searchRoute)
api.route('/torrent', torrentRoute)

export default api
