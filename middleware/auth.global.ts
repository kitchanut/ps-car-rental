export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = useCookie('isLogin').value
    if (!isAuthenticated && to.name !== 'login') {
        return navigateTo('/login');
    }
});