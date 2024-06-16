import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { HTTPExceptionErrorHandler } from 'src/utils/errors'
import dotenv from 'dotenv'
import YAML from 'yamljs'

import routes from 'routes/index'

const app = new Hono()

dotenv.config()

app.route('/', routes)
app.get('/', c => c.redirect('/docs'))
app.get('/ping', c => c.text('pong'))
app.get(
  '/docs',
  swaggerUI({
    url: 'openapi.yaml',
    spec: YAML.load('./openapi.yaml'),
  }),
)

app.onError(HTTPExceptionErrorHandler)

console.log('Server is running on port 3000!')
serve({
  fetch: app.fetch,
  port: 3000,
})

export default app
