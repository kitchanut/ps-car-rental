export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = useCookie('isLogin').value
    const user = useCookie('user').value
    if (!isAuthenticated && to.name !== 'login') {
        return navigateTo('/login');
    }
});