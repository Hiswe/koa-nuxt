import typescript from 'rollup-plugin-typescript2'

const NAME = `index`

const npmConfig = {
  input: `src/${NAME}.ts`,
  output: {
    format: `cjs`,
    file: `dist/${NAME}.js`,
  },
  external: [`consola`],
  plugins: [typescript()],
}

export default [npmConfig]
