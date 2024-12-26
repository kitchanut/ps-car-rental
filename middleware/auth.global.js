export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useNuxtApp().$supabase;
  const isLoggedIn = useState("isLoggedIn");
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (session) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
    if (to.name == "login" || ["/", "/privacy", "/contact"].includes(to.path)) {
    } else {
      return navigateTo("/login");
    }
  }
});
