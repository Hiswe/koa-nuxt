import pkg from '../package.json'

export default {
  router: {
    middleware: [`handle-server-errors`],
  },
  plugins: [`@/plugins/register-global-components.js`],
  css: [`@/assets/global-style.css`],
  // https://medium.com/nuxt/nuxt-2-is-coming-oh-yeah-212c1a9e1a67#af5f
  build: {
    // cache: true,
    // parallel: true,
  },
  head: {
    titleTemplate: `Koa Nuxt – %s`,
    meta: [
      { charset: `utf-8` },
      { name: `viewport`, content: `width=device-width, initial-scale=1` },
      { 'http-equiv': `X-UA-Compatible`, content: `IE=edge` },
      { hid: `author`, name: `author`, content: pkg.author },
      { hid: `description`, name: `description`, content: pkg.description },
    ],
  },
}
