import { Hono } from 'hono'
import searchRoute from 'routes/search.route'
import torrentRoute from 'routes/torrent.route'
import subtitlesRoute from 'routes/subtitles.route'

const routes = new Hono()

routes.route('/search', searchRoute)
routes.route('/torrent', torrentRoute)
routes.route('/subtitles', subtitlesRoute)

export default routes
