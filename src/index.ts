import { Context, Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import Toucan from 'toucan-js';

const app = new Hono()

// Builtin middleware
app.use('*', poweredBy())
app.use('*', logger())
app.use('*', cors())
app.use('*', prettyJSON())

// Add X-Response-Time header
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
})

// Custom Not Found Message
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

//Error handling
app.onError((err: Error, c: Context) => {
  const sentry = new Toucan({
    dsn: c.env.SENTRY_DSN,
    context: c.event,
    environment: c.env.ENVIRONMENT,
  })
  console.error(err)
  const eventId = sentry.captureException(err)

  return c.json({ message: 'Internal Server Error', eventId }, 500, { "X-Sentry-ID": eventId })
})

app.get('/', (c) => {
  return c.json({ message: 'Hello World' })
})


export default app
