import type { NuxtApp } from "#app";

// services/auth.ts
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const handleResponce = (ctx: any, nuxtApp: NuxtApp) => {
  if (ctx.response.status === 401) {
    nuxtApp.$router.replace("/login");
  }

  if (ctx.response.status === 403) {
    nuxtApp.$router.replace("/login");
  }
};

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const requestFetch = useRequestFetch();
  const nuxtApp = useNuxtApp();

  const response = await requestFetch<AuthResponse>(
    `${useRuntimeConfig().public.backendUrl}/login`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username, password }),
      onResponse(ctx) {
        handleResponce(ctx, nuxtApp);
      },
    }
  );

  if (!response.accessToken || !response.refreshToken) {
    throw new Error("Invalid credentials");
  }

  return response;
};

export const logout = async (): Promise<void> => {
  const requestFetch = useRequestFetch();
  const nuxtApp = useNuxtApp();

  await requestFetch(`${useRuntimeConfig().public.backendUrl}/logout`, {
    method: "POST",
    credentials: "include",
    onResponse(ctx) {
      if (ctx.response.status === 204) {
        nuxtApp.$router.replace("/login");
      }
    },
  });
};

export const getProtectedData = async (): Promise<string> => {
  const requestFetch = useRequestFetch();
  const nuxtApp = useNuxtApp();

  const response = await requestFetch<string>(
    `${useRuntimeConfig().public.backendUrl}/protected`,
    {
      method: "GET",
      credentials: "include",
      onResponse(ctx) {
        handleResponce(ctx, nuxtApp);
      },
    }
  );

  return response;
};
