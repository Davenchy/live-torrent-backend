import { Hono } from 'hono'

import {
  searchController,
  getProvidersController,
} from '../controllers/search.controller'

const route = new Hono()

route.get('/', getProvidersController)
route.get('/:provider', searchController)

export default route
