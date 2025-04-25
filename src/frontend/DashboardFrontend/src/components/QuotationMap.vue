<template>
  <div class="quotation-map">
    <h3>Quotation Map</h3>
    <div class="map">
      <!-- Placeholder for map of quotations -->
      <p>Map of quotations goes here</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuotationMap'
}
</script>

<style scoped>
.quotation-map {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.map {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 4px;
}
</style> 