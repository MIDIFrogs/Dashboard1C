<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, provide } from 'vue'
import '@/assets/styles/theme.css'

// Global app state
const isProductView = ref(false);
const selectedProduct = ref(null);

// Provide app state to all components
provide('isProductView', isProductView);
provide('selectedProduct', selectedProduct);

// Handle product selection
const handleProductSelected = (product) => {
  selectedProduct.value = product;
  isProductView.value = true;
};

// Return to general view
const returnToGeneral = () => {
  isProductView.value = false;
  selectedProduct.value = null;
};
</script>

<template>
  <div class="app-root">
    <!-- Router view handles all routes -->
    <RouterView 
      :isProductView="isProductView"
      :selectedProduct="selectedProduct"
      @product-selected="handleProductSelected"
      @return-to-general="returnToGeneral"
    />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  width: 100%;
  background: var(--background-gradient);
  color: var(--text-primary);
  overflow-x: hidden;
}
</style>
