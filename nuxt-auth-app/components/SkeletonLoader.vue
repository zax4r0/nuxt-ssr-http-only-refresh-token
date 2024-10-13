<script setup lang="ts">
// Component logic goes here
</script>

<template>
  <div class="skeleton-container">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
    <div class="skeleton-line"></div>
  </div>
</template>

<style scoped>
.skeleton-container {
  background-color: #f0f4f8;
  border-radius: 4px;
  padding: 16px;
  width: 300px;
}

.skeleton-line {
  background-color: #e2e8f0;
  height: 20px;
  margin-bottom: 8px;
  border-radius: 2px;
  animation: pulse 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
