import path from 'node:path'
import { type UserConfigFn, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// @ts-expect-error
import VueMacros from 'unplugin-vue-macros/vite'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import { PATHS } from './path'

function hyphenate(str) {
  return (`${str}`).replace(/[A-Z]/g, (match) => {
    return `-${match.toLowerCase()}`
  })
}

export enum GlobalConfigKeyEnum {
  digit = 'digit',
  twin = 'twin',
}

export enum DevPortsEnum {
  twin = 9000,
  digit = 9001,
}

export interface ProjectOptions {
  name: GlobalConfigKeyEnum
  prefix?: 'web-'
  agent?: string
}

export function genViteConfig(options: ProjectOptions): UserConfigFn {
  const serverProxy = {
    '/v1': {
      target: 'http://192.168.1.137:5002',
      changeOrigin: true,
    },
  }
  return ({ mode, command }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const prefix = options.prefix || 'web-'
    const autoImports: NonNullable<Parameters<typeof AutoImport>[0]>['imports'] = [
      // presets
      'vue',
      'vue-router',
    ]
    const plugins = [
      VueMacros(),
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx,
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],

        // global imports to register
        imports: autoImports,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: path.resolve(PATHS.ROOT, './.eslintrc-auto-import.json'), // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: path.resolve(PATHS.ROOT, `./typings/${options.name}-auto-imports.d.ts`),
      }),
      tsconfigPaths(),
      vue(),
      VueTypeImports(),
      vueJsx(),
      // UnoCSS()
    ]
    // if (mode !== 'production') {
    //   plugins.push(eslint(), Inspect())
    // }

    return {
      define: {
        __DEV__: command === 'serve',
        __NAME__: JSON.stringify(options.name),
      },
      plugins,
      server: {
        host: true,
        https: !!env.HTTPS,
        port: DevPortsEnum[options.name],
        fs: {
          allow: [PATHS.ROOT],
        },
        proxy: serverProxy,
      },
      base: './',
      build: {
        outDir: path.resolve(PATHS.ASSETS, `${prefix}${hyphenate(options.name)}`),
        assetsDir: './assets',
      },

      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@use "style/scss/index.scss" as *;',
          },
        },
      },
    }
  }
}
