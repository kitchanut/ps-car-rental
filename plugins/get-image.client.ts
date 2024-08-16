
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    return {
        provide: {
            getImage: (path: string) => `${config.public.serverUrl}/${path}`,
            imageBaseApp: () => '/logo.jpg'
        }
    }
})