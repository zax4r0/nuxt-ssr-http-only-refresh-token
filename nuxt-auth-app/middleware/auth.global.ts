export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const accessToken = useCookie("accessToken");

  if (nuxtApp.ssrContext) {
    if (!accessToken.value && to.path !== "/login") {
      console.log("Redirecting to login");
      return nuxtApp.$router.replace("/login");
    }
  }

  if (accessToken.value && to.path === "/login") {
    return navigateTo("/");
  }
});
