import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { HTTPExceptionErrorHandler } from 'src/utils/errors'

import API from 'src/api'

const app = new Hono()

app.route('/api', API)
app.get('/ping', c => c.text('pong'))
app.get('/', swaggerUI({ url: '/docs' }))

app.onError(HTTPExceptionErrorHandler)

console.log('Server is running on port 3000!')
serve({
  fetch: app.fetch,
  port: 3000,
})

export default app