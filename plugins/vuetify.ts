// plugins/vuetify.js
// import { createVuetify, ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'
import "@mdi/font/css/materialdesignicons.css";

// const myCustomLightTheme: ThemeDefinition = {
//     dark: false,
//     colors: {
//         background: '#FFFFFF',
//         surface: '#FFFFFF',
//         primary: '#1976D2',
//         newPrimary: '#6200EE',
//         secondary: '#03DAC6',
//         error: '#B00020',
//         info: '#2196F3',
//         success: '#4CAF50',
//         warning: '#FB8C00',
//     }
// }


export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        defaults: {
            VSelect: {
                menuIcon: 'mdi-chevron-down',
            },
        },
        components: {
            ...components,
            ...labs,
        },
        directives,
        // theme: {
        //     defaultTheme: 'myCustomLightTheme',
        //     themes: {
        //         myCustomLightTheme,
        //     }
        // }
    })

    nuxtApp.vueApp.use(vuetify)
})