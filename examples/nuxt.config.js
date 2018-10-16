import pkg from '../package.json'

export default {
  router: {
    middleware: [`handle-server-errors`],
  },
  plugins: [`@/plugins/register-global-components.js`],
  css: [`@/assets/global-style.css`],
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
