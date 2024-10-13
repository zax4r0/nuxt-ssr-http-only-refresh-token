export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const refreshToken = useCookie("refreshToken");

  /**
   * SSR only
   * We dont have refresh token on the client side because is stored in Http-Only cookie
   * Redirect to login if no refresh token
   */
  if (nuxtApp.ssrContext) {
    if (!refreshToken.value && to.path !== "/login") {
      return nuxtApp.$router.replace("/login");
    }
  }

  // Redirect to home if already logged in
  if (refreshToken.value && to.path === "/login") {
    return navigateTo("/");
  }
});
