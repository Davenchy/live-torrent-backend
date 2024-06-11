import { Hono } from 'hono'

import {
  searchController,
  getProvidersController,
} from '../controllers/search.controller'

const route = new Hono()

route.get('/', searchController)
route.get('/providers', getProvidersController)

export default route
