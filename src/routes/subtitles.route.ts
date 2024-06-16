import { Hono } from 'hono'
import { searchRoute } from 'src/controllers/subtitles.controller'

const route = new Hono()

route.get('/', searchRoute)

export default route
