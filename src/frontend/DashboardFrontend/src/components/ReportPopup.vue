<template>
  <div class="popup" v-if="isVisible">
    <div class="popup-content">
      <h3>Generate Report</h3>
      <input type="text" v-model="fileName" placeholder="Enter file name" />
      <div class="popup-actions">
        <button @click="downloadReport">Download</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportPopup',
  data() {
    return {
      isVisible: false,
      fileName: ''
    };
  },
  methods: {
    downloadReport() {
      // Logic to download the report
    },
    cancel() {
      this.isVisible = false;
    }
  }
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
.popup-actions {
  margin-top: 20px;
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