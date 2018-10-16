import consola from 'consola'

import { KoaMiddleware, Nuxt, KoaContext } from './types'

const nuxtLogger = consola.withScope(`koa-nuxt`)

export default function createKoaMiddleware(nuxt: Nuxt): KoaMiddleware {
  return function renderNuxt(ctx: KoaContext): Promise<any> {
    // koa defaults to 404 when it sees that status is unset
    ctx.status = 200
    nuxtLogger.debug(ctx.originalUrl)
    // Mark request as handled for Koa
    ctx.respond = false

    return new Promise((resolve, reject) => {
      ctx.res.on('close', () => {
        nuxtLogger.debug(`close`, ctx.originalUrl)
        resolve()
      })
      ctx.res.on('finish', () => {
        nuxtLogger.debug(`finish`, ctx.originalUrl)
        resolve()
      })
      // ctx.res.on('finish', resolve)

      nuxt.render(ctx.req, ctx.res, function nuxtRenderCallback(renderPromise) {
        nuxtLogger.debug(`render`, ctx.originalUrl)
        // nuxt.render passes a rejected promise into callback on error.
        renderPromise
          .then(() => {
            nuxtLogger.debug(`resolve`, ctx.originalUrl)
            resolve()
          })
          .catch(() => {
            nuxtLogger.error(`reject`, ctx.originalUrl)
            reject()
          })
      })
    })
  }
}
