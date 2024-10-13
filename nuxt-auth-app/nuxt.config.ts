// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  routeRules: {
    "/login": {
      ssr: true,
      prerender: true,
    },
  },

  compatibilityDate: "2024-10-13",
});
