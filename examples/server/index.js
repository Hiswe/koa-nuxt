import Koa from 'koa'
import Router from 'koa-router'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import util from 'util'

import nuxtConfig from '../nuxt.config.js'
import koaNuxt from '../../dist'

const appLogger = consola.withScope(`APP`)
const errorLogger = consola.withScope(`ERROR`)

const app = new Koa()
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

nuxtConfig.dev = !(app.env === 'production')

async function start() {
  //////
  // SERVER CONFIG
  //////

  // Don't use sessions
  // • we will need Koa 3 to not have ERR_HTTP_HEADERS_SENT errors
  // • https://github.com/koajs/koa/issues/1008

  //----- NUXT HANDLING

  const nuxt = new Nuxt(nuxtConfig)

  // Build in development
  if (nuxtConfig.dev) {
    appLogger.info(`SPA build for dev`)
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const renderNuxt = koaNuxt(nuxt)

  //----- ERROR HANDLING

  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      errorLogger.error(`one of the next middleware has errored`)
      console.log(util.inspect(err, { colors: true }))
      ctx.status = error.statusCode || error.status || 500
      // expose error to nuxt
      ctx.req.error = {
        statusCode: ctx.status,
        message: err.message,
      }
      try {
        errorLogger.error(`serving nuxt response`)
        // still call nuxt middleware
        await renderNuxt(ctx)
      } catch (nuxtError) {
        // we want to make that ANY errors will be catch here
        errorLogger.error(`serving nuxt response failed`)
        ctx.body = `nuxt error`
      }
    }
  })

  //////
  // API ROUTING
  //////

  //----- API

  const router = new Router({ prefix: `/api` })

  router.post(`/ok`, async ctx => {
    ctx.body = { pouic: `clapou` }
  })
  router.post(`/will-throw`, async ctx => {
    throw new Error(`something bad happened`)
  })

  //----- MOUNT ROUTER TO APPLICATION

  app.use(router.routes())
  app.use(router.allowedMethods())

  //////
  // NUXT FALLBACK
  //////

  app.use(async (ctx, next) => {
    // useful for nuxtServerInit
    ctx.req.state = {
      ...ctx.state,
    }
    await next()
  })

  app.use(renderNuxt)

  //////
  // LAUNCHING
  //////

  app.listen(PORT, HOST, function koaInitEnd() {
    appLogger.start(
      `server is listening at ${HOST}:${PORT}`,
      `on mode ${app.env}`
    )
  })
}

start()
