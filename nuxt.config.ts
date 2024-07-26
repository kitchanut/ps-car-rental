// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
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
      // titleTemplate: "%s | มูเตลู",
      titleTemplate: "PS Car Rental",
      link: [
        // {
        //   rel: "stylesheet",
        //   href: "https://fonts.googleapis.com/icon?family=Material+Icons"
        // },
        // {
        //   rel: "stylesheet",
        //   href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        // },
        // {
        //   rel: 'icon',
        //   type: 'image/x-icon',
        //   href: "/logo.png"
        // }
      ],
      script: [
      ],
      meta: [
        {
          name: 'description',
          content: 'รถเช่า'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=5'
        },
        {
          name: 'author',
          content: "Kitchanut Ruamboon and IE Advisor"
        }
      ]

    }
  },
})
