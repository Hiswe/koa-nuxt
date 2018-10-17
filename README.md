# koa-nuxt

[Koa 2](https://koajs.com/) middleware for [Nuxt 2](https://nuxtjs.org/)
This is mostly the same code as [create-nuxt-app – koa](https://github.com/nuxt/create-nuxt-app/blob/master/template/server/index-koa.js)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## example

```js
import Koa from 'koa'
import Router from 'koa-router'
import { Nuxt, Builder } from 'nuxt'
import koaNuxt from '@hiswe/koa-nuxt'

import nuxtConfig from '../nuxt.config.js'

const app = new Koa()
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

nuxtConfig.dev = !(app.env === 'production')

async function start() {
  const nuxt = new Nuxt(nuxtConfig)

  if (nuxtConfig.dev) {
    // re-build with nuxt on development
    // this can take some time
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const renderNuxt = koaNuxt(nuxt)

  //----- SERVER ROUTING

  const router = new Router()

  router.post(`/api`, async ctx => {
    // do something…
    ctx.redirect(`/`)
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  //----- NUXT

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
```
