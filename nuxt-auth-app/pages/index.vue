<script setup lang="ts">
import { useAsyncData } from "#app";
import { getProtectedData, logout } from "~/services/auth.service";

const { data, status, error, refresh } = await useAsyncData(
  "protectedData",
  () => getProtectedData(),
  { server: true }
);
</script>

<template>
  <div class="container">
    <h1 class="title">Protected Data Server Side</h1>
    <div v-if="status === 'pending'" class="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="error" class="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <div v-else class="content">
      <pre class="data">{{ data }}</pre>
      <div class="actions">
        <button @click="logout" class="button button-danger">Logout</button>
        <NuxtLink to="/c" class="button button-secondary"
          >Go to Client Side Component</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: hsl(var(--card-foreground));
  margin-bottom: 1.5rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: hsl(var(--primary));
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.content {
  margin-top: 1.5rem;
}

.data {
  background-color: hsl(var(--muted));
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: hsl(var(--foreground));
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
}

.button-danger {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.button-danger:hover {
  background-color: hsl(
    var(--destructive) / 0.9
  ); /* Adjust opacity for hover */
}

.button-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.button-secondary:hover {
  background-color: hsl(var(--secondary) / 0.9); /* Adjust opacity for hover */
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: hsl(var(--destructive), 0.1);
  color: hsl(var(--destructive));
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
</style>
