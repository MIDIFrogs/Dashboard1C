<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <div class="diagram">
      <!-- Placeholder for diagram -->
      <p>Diagram goes here</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.diagram {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 4px;
}
</style> 