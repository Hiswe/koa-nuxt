# koa-nuxt

[Koa 2](https://koajs.com/) middleware for [Nuxt 2](https://nuxtjs.org/)
This is mostly the same code as [create-nuxt-app – koa](https://github.com/nuxt/create-nuxt-app/blob/master/template/server/index-koa.js)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [why](#why)
- [koa-session caveats](#koa-session-caveats)
- [minimal example](#minimal-example)
- [extensive example](#extensive-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## why

It just:

- removes some boilerplate
- makes it possible to call the nuxt render in different places (like in an error handler)

## koa-session caveats

In order to use [koa-session](https://github.com/koajs/session) without having `Can't set headers after they are sent` errors you'll need to call it manually **before** calling the `renderNuxt` middleware

```js
const sessionConfig = {
  // don't autoCommit because we need to control when headers are send
  autoCommit: false,
}
app.use(session(sessionConfig, app))

app.use(async (ctx, next) => {
  ctx.session.now = new Date().valueOf()
  // ensure headers are sent before nuxt
  await ctx.session.manuallyCommit()
  // nuxt render can be safely be done after that
  await next()
})
```

## minimal example

```js
import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import koaNuxt from '@hiswe/koa-nuxt'

import nuxtConfig from '../nuxt.config.js'

const app = new Koa()
nuxtConfig.dev = !(app.env === `production`)

async function start() {
  const nuxt = new Nuxt(nuxtConfig)
  // create the nuxt middleWare
  const renderNuxt = koaNuxt(nuxt)

  // re-build with nuxt on development
  // this can take some time
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // call the middleware in last position
  // it will take care of anything not handled by our app
  app.use(renderNuxt)

  // launch app
  app.listen(process.env.HOST || `127.0.0.1`, process.env.PORT || 3000)
}

start()
```

## extensive example

got see `example` folder

- full no-JS support
- flash messages with koa-session
- handle almost all server-errors with nuxt
  can fail if Nuxt fail to render a server error…

to launch after cloning the projet:

```sh
npm install
npm run build
cd ./example
npm install
npm start
```
