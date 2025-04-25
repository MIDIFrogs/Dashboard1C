<template>
  <div class="notification-window">
    <h3>Notifications</h3>
    <div class="notifications">
      <!-- Placeholder for notifications -->
      <p>Notification content goes here</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationWindow'
}
</script>

<style scoped>
.notification-window {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.notifications {
  height: 150px;
  overflow-y: auto;
  background-color: #e0e0e0;
  border-radius: 4px;
  padding: 10px;
}
</style> 