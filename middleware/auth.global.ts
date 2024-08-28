export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = useCookie('isLogin').value
    if (!isAuthenticated) {
        if (to.name == 'login' || ['/', '/privacy', '/contact'].includes(to.path)) {

        } else {
            return navigateTo('/login');
        }
    }

});