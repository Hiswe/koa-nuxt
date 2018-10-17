// follow create-nuxt-app example
// https://github.com/nuxt/create-nuxt-app/blob/master/template/server/index-koa.js

import { KoaMiddleware, Nuxt, KoaContext } from './types'

export default function createKoaMiddleware(nuxt: Nuxt): KoaMiddleware {
  return function renderNuxt(ctx: KoaContext): Promise<any> {
    // koa defaults to 404 when it sees that status is unset
    ctx.status = 200
    // Mark request as handled for Koa
    ctx.respond = false

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, function nuxtRenderCallback(renderPromise) {
        // nuxt.render passes a rejected promise into callback on error.
        renderPromise.then(resolve).catch(reject)
      })
    })
  }
}
