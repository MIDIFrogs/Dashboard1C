<template>
  <header class="header">
    <button @click="synchronizeData">Synchronize Data</button>
    <button @click="openReportPopup">Generate Report</button>
    <button @click="openFilterPopup">Filter</button>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    synchronizeData() {
      // Logic for data synchronization
    },
    openReportPopup() {
      // Logic to open report generation popup
    },
    openFilterPopup() {
      // Logic to open filter popup
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #333;
  color: #fff;
}
button {
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}
button:hover {
  background-color: #777;
}
</style> 