<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "~/services/auth.service";

const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | null>(null);
const router = useRouter();

const handleLogin = async () => {
  try {
    const data = await login(username.value, password.value);
    await router.replace("/");
  } catch (error) {
    console.error(error);
    errorMessage.value = (error as Error).message;
  }
};
</script>

<template>
  <div class="container">
    <h1 class="title">Login</h1>
    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="username" class="label">Username</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          class="input"
        />
      </div>
      <div class="form-group">
        <label for="password" class="label">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="input"
        />
      </div>
      <button type="submit" class="button button-primary">Login</button>
    </form>
    <div v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
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
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

.input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsla(var(--ring), 0.3);
}

.button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.button-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
  border-radius: var(--radius);
  font-size: 0.875rem;
}
</style>
