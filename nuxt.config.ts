import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // Core modules configuration
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@vueuse/nuxt',
    'nuxt-svgo'
  ],


  // Global CSS files
  css: [
    '~/assets/css/main.css',
    '~/assets/css/animations.css'
  ],


  // Module configurations
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },

  // Runtime configuration - available in application
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://localhost:8090',
      appVersion: process.env.npm_package_version || '1.0.0'
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css', // Corrected path - removed 'frontend/'
    exposeConfig: false,
    viewer: true,
  },


  devtools: { enabled: true },

  // Vite configuration
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['pocketbase']
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 1000
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'TodoList App',
      meta: [
        { name: 'description', content: 'A modern TodoList application' }
      ]
    }
  },

  // Development server settings
  devServer: {
    port: 3000
  }
})
