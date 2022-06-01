import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'

export const app = new Hono()

// Builtin middleware
app.use('*', poweredBy())
app.use('*', logger())

// Add X-Response-Time header
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
})

// Custom Not Found Message
app.notFound((c) => {
  return c.text('Custom 404 Not Found', 404)
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

app.get('/', (c) => c.text('Hono!!'))

app.get('/hello', () => new Response('This is /hello'))


export default app
