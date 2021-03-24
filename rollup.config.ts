import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pascalcase from 'pascalcase'
import copy from 'rollup-plugin-copy'

const pkg = require('./package.json')
// get all or any character after '/' in this case 'vue-quill'
const name = pkg.name.match(/[^/]*$/)[0]
// const name = "vue-quill"

function getAuthors(pkg) {
  const { contributors, author } = pkg

  const authors = new Set()
  if (contributors && contributors)
    contributors.forEach(contributor => {
      authors.add(contributor.name)
    })
  if (author) authors.add(author.name)

  return Array.from(authors).join(', ')
}

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${getAuthors(pkg)}
  * @license MIT
  */`

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  // each file name has the format: `dist/${name}.${format}.js`
  // format being a key of this object
  'esm-bundler': {
    file: pkg.module,
    format: `es`,
  },
  cjs: {
    file: pkg.main,
    format: `cjs`,
  },
  global: {
    file: pkg.unpkg,
    format: `umd`,
  },
  esm: {
    file: pkg.browser || pkg.module.replace('-bundler.js', '-browser.js'),
    format: `es`,
  },
}

const allFormats = Object.keys(outputConfigs)
const packageFormats = allFormats
const packageConfigs = packageFormats.map(format =>
  createConfig(format, outputConfigs[format])
)

// only add the production ready if we are bundling the options
packageFormats.forEach(format => {
  if (format === 'cjs') {
    packageConfigs.push(createProductionConfig(format))
  } else if (format === 'global') {
    packageConfigs.push(createMinifiedConfig(format))
  }
})

// generate themes css
const fs = require('fs');
const csso = require('csso');
const emptyJS = 'temp/empty.js'
if (!fs.existsSync("temp")) fs.mkdirSync("temp");
fs.writeFile(emptyJS, '', (err) => {
  if (err) throw err;
  console.log('empty.js created');
})
packageConfigs.push({
  input: emptyJS,
  output: { file: emptyJS },
  external: [],
  plugins: [
    copy({
      targets: [{
        src: './node_modules/quill/dist/quill.core.css',
        dest: './dist',
        rename: 'vue-quill.core.css',
        transform: (contents, filename) => {
          return csso.minify(contents.toString()).css
        }
      },
      {
        src: './node_modules/quill/dist/quill.bubble.css',
        dest: './dist',
        rename: 'vue-quill.bubble.css',
        transform: (contents, filename) => {
          return csso.minify(contents.toString()).css
        }
      },
      {
        src: './dist/vue-quill.snow.css',
        dest: './dist',
        transform: (contents, filename) => {
          return csso.minify(contents.toString()).css
        }
      }],
      hook: 'writeBundle',
      verbose: true,
      copyOnce: true
    })
  ]
})

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.banner = banner
  output.externalLiveBindings = false
  output.globals = { vue: 'Vue' }

  const isProductionBuild = /\.prod\.js$/.test(output.file)
  const isGlobalBuild = format === 'global'
  const isRawESMBuild = format === 'esm'
  const isNodeBuild = format === 'cjs'
  const isBundlerESMBuild = /esm-bundler/.test(format)

  if (isGlobalBuild) output.name = pascalcase(pkg.name)
  if (isGlobalBuild || isNodeBuild) output.exports = 'named'

  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = typescript({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['__tests__', 'test-dts'],
    },
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const external = ['vue']

  const nodePlugins = [resolve(), commonjs()]

  return {
    input: `src/main.ts`,
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        // isBrowserBuild?
        isGlobalBuild || isRawESMBuild || isBundlerESMBuild,
        isGlobalBuild,
        isNodeBuild
      ),
      ...nodePlugins,
      ...plugins,
    ],
    output,
    // onwarn: (msg, warn) => {
    //   if (!/Circular/.test(msg)) {
    //     warn(msg)
    //   }
    // },
  }
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${pkg.version}"`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
      `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
      !isProduction,
    // this is only used during tests
    __TEST__: isBundlerESMBuild ? `(process.env.NODE_ENV === 'test')` : false,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: isBrowserBuild,
    // is targeting bundlers?
    __BUNDLER__: isBundlerESMBuild,
    __GLOBAL__: isGlobalBuild,
    // is targeting Node (SSR)?
    __NODE_JS__: isNodeBuild,
  }
  // allow inline overrides like
  //__RUNTIME_COMPILE__=true yarn build
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace(replacements)
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: `dist/${name}.${format}.prod.js`,
    format: outputConfigs[format].format,
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: `dist/${name}.${format}.prod.js`,
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
      }),
    ]
  )
}
