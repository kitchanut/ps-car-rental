
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    return {
        provide: {
            getImage: (path: string) => `${config.public.serverUrl}/storage/app/${path}`,
            imageBaseApp: () => '/logo.png'
        }
    }
})