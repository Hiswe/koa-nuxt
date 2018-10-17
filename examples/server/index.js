import Koa from 'koa'
import Router from 'koa-router'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import util from 'util'
import Boom from 'Boom'
import shortid from 'shortid'
import logger from 'koa-logger'
import session from 'koa-session'

import nuxtConfig from '../nuxt.config.js'
import koaNuxt from '../../dist'

const appLogger = consola.withScope(`APP`)
const errorLogger = consola.withScope(`ERROR`)

const app = new Koa()
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

// for signed cookies
app.keys = [
  `e05fa6f6e4c078ad997ec324e6d69f59829b2e2237c5e1d9e3610fea291793f4`,
  `64241b9838c5d0d5f94f7e83c71d83af4674f8c84e406a138263a8803a3b1e6f`,
]

nuxtConfig.dev = !(app.env === 'production')

async function start() {
  // const savedState = {}

  //////
  // SERVER CONFIG
  //////

  app.use(logger())

  // Don't use sessions
  // • we will need Koa 3 to not have ERR_HTTP_HEADERS_SENT errors
  // • https://github.com/koajs/koa/issues/1008

  app.use(session({ key: `kn-example` }, app))

  //----- NUXT HANDLING

  const nuxt = new Nuxt(nuxtConfig)

  // Build in development
  if (nuxtConfig.dev) {
    appLogger.info(`SPA build for dev`)
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const renderNuxt = koaNuxt(nuxt)

  //----- XHR

  app.use(async (ctx, next) => {
    ctx.state.isJson = ctx.request.type === `application/json`
    await next()
  })

  //----- ERROR HANDLING

  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      errorLogger.error(`one of the next middleware has errored`)
      console.log(util.inspect(error, { colors: true }))
      const boomError = Boom.boomify(error, {
        statusCode: 500,
        message: `something really bad happened`,
        override: false,
      })
      ctx.status = boomError.output.statusCode
      // expose error to nuxt
      ctx.req.error = boomError
      try {
        errorLogger.error(`serving nuxt response`)
        // still call nuxt middleware
        await renderNuxt(ctx)
      } catch (nuxtError) {
        // we want to make that ANY errors will be catch here
        errorLogger.error(`serving nuxt response failed`)
        console.log(util.inspect(nuxtError, { colors: true }))
        ctx.body = `nuxt error`
      }
    }
  })

  //////
  // API ROUTING
  //////

  //----- API

  const router = new Router()

  router.post(`/flash-message`, async ctx => {
    ctx.session = {
      notification: {
        id: shortid.generate(),
        message: `my flash message`,
        type: `info`,
      },
    }
    ctx.redirect(`/info`)
  })
  router.post(`/will-throw`, async ctx => {
    throw Boom.teapot()
  })

  //----- MOUNT ROUTER TO APPLICATION

  app.use(router.routes())
  app.use(router.allowedMethods())

  //////
  // NUXT FALLBACK
  //////

  app.use(async (ctx, next) => {
    console.log(ctx.state)
    console.log(ctx.session)
    // useful for nuxtServerInit
    ctx.req.serverData = {
      ...ctx.state,
      ...ctx.session,
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
      `on mode ${app.env}`,
    )
  })
}

start()
