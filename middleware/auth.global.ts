// export default defineNuxtRouteMiddleware((to, from) => {
// let isAuthenticated
// if (useState('isAuthenticated').value) {
//     isAuthenticated = useState('isAuthenticated').value
// } else {
//     isAuthenticated = localStorage.getItem('isAuthenticated')
// }
// const isAuthenticated = useState('isAuthenticated').value
// console.log('isAuthenticated', isAuthenticated)

// if (!isAuthenticated && to.path !== '/login') {
//     return navigateTo('/login')
// }

// })

export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = useCookie('isLogin').value
    const user = useCookie('user').value
    if (!isAuthenticated && to.name !== 'login') {
        return navigateTo('/login');
    }
});