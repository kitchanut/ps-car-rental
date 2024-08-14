
import * as vt from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vt.default, {
        // position: "bottom-center",
        position: "top-center",
        hideProgressBar: true,
        closeButton: false,
        timeout: 2000,
    });
    return {
        provide: {
            toast: vt.useToast()
        }
    }
});
