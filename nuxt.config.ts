export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: './src/client',
  serverDir: './src/server',

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    apiSecret: process.env.SECRET,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      ipx: process.env.IPX_ON == 'false' ? false : true,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      version: process.env.VERSION
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
      meta: [
        { name: 'theme-color', content: '#0d0c0b' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-title', content: process.env.NAME },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/pwa/180.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@/app.sass'
  ],

  colorMode: {
    preference: 'dark'
  },

  modules: [
    '@pinia/nuxt', 
    '@nuxt/image', 
    '@nuxt/ui', 
    '@nuxtjs/google-fonts',
    'nuxt-tiptap-editor', 
    '@nuxtjs/robots',
    'nuxt-rate-limit',
    'nuxt-swiper', 
    '@vite-pwa/nuxt'
  ],

  site: {
    url: process.env.CLIENT_URL, 
    name: process.env.NAME
  },

  tiptap: {
    prefix: 'Tiptap'
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Lexend: [300,400,500,600,700,800,900],
    }
  },

  nuxtRateLimit: {
    routes: {
      '/api/*': {
        maxRequests: 10,
        intervalSeconds: 1,
      },
    },
  },

  robots: {
    disallow: ['/admin', '/manage/*', '/.nuxt/*', '/*?query=', '/*?page=', '/*?sort=', '/*?filter='],
    sitemap: '/sitemap.xml', 
    blockNonSeoBots: true, // Nuclei, WikiDo, Riddler, PetalBot, Zoominfobot, Go-http-client, Node/simplecrawler, CazoodleBot, dotbot/1.0, Gigabot, Barkrowler, , BLEXBot, magpie-crawler
  },

  icon: {
    serverBundle: 'remote',
  },

  image: {
    provider: 'ipx',
    domains: [
      process.env.DOMAIN as string
    ]
  },

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    includeAssets: [
      'favicon.ico', 
      'robots.txt', 
      'pwa/180.png'
    ],
    manifest: {
      name: process.env.NAME,
      short_name: process.env.SHORT_NAME,
      description: process.env.DESCRIPTION,
      theme_color: '#0d0c0b',
      background_color: '#0d0c0b',
      display: 'standalone',
      start_url: '/',
      orientation: "portrait",
      lang: 'vi',
      icons: [
        { src: '/pwa/64.png', sizes: "64x64", type: 'image/png' },
        { src: '/pwa/144.png', sizes: "144x144", type: 'image/png' },
        { src: '/pwa/192.png', sizes: "192x192", type: 'image/png' },
        { src: '/pwa/512.png', sizes: "512x512", type: 'image/png', purpose: 'any'  },
        { src: '/pwa/512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      sourcemap: true,
      globPatterns: ['**/*.{js,css,html,png,svg}'],
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          silenceDeprecations: ['legacy-js-api'],
        }
      }
    }
  },

  compatibilityDate: '2025-06-01'
})