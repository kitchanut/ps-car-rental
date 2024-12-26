// https://nuxt.com/docs/api/configuration/nuxt-config
// nvm use 20
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  css: ["@/assets/scss/style.scss", "@/assets/css/style.css"],
  modules: ["@nuxtjs/robots", 'dayjs-nuxt', "@nuxt/icon"],
  plugins: [
    '~/plugins/facebook-sdk.js'
  ],
  dayjs: {
    locales: ['th'],
    plugins: ['timezone'],
    defaultLocale: 'th',
    defaultTimezone: 'Asia/Bangkok',
  },
  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    define: {
      "process.env.DEBUG": false,
    },
  },

  app: {
    // baseURL: '/npms',
    head: {
      htmlAttrs: {
        lang: "th"
      },
      bodyAttrs: {
        class: "demo"
      },
      charset: "utf-8",
      titleTemplate: "PS Car Rental",
      link: [
        // {
        //   rel: "stylesheet",
        //   href: "https://fonts.googleapis.com/icon?family=Material+Icons"
        // },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: "/favicon.ico"
        }
      ],
      script: [
        {
          src: `https://api.longdo.com/map/?key=9756fdb65bc2a320b39f886ad189cb5b`,
          defer: true
        },
      ],
      meta: [
        {
          name: 'description',
          content: 'รถเช่า รถเช่านครพนม'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'theme-color',
          content: '#1966C0'
        },
        {
          name: 'author',
          content: "Kitchanut Ruamboon and IE Advisor"
        }
      ]

    }
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      serverUrl: process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://ps-car-rental-api.ie-advisor.co.th",
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
      FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
    }
  }
})