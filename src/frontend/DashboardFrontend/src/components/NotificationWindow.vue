<template>
  <div class="notification-window">
    <h3>Live Updates</h3>
    <div class="notifications">
      <TransitionGroup name="notification">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="notification.type"
        >
          <div class="notification-content">
            <span class="notification-time">{{ notification.time }}</span>
            <p>{{ notification.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'NotificationWindow',
  setup() {
    const notifications = ref([])
    let notificationId = 0

    const addNotification = (message, type = 'info') => {
      const now = new Date()
      const time = now.toLocaleTimeString()
      
      notifications.value.unshift({
        id: notificationId++,
        message,
        type,
        time
      })

      // Keep only last 10 notifications
      if (notifications.value.length > 10) {
        notifications.value.pop()
      }
    }

    // Demo notifications
    onMounted(() => {
      const demoNotifications = [
        { message: 'TechCorp performance increased by 2.5%', type: 'success' },
        { message: 'New market data available', type: 'info' },
        { message: 'InnovateX reports quarterly results', type: 'warning' }
      ]

      demoNotifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification(notification.message, notification.type)
        }, index * 1000)
      })

      // Simulate real-time notifications
      setInterval(() => {
        const types = ['info', 'success', 'warning']
        const messages = [
          'Market analysis updated',
          'New trading volume record',
          'Company report available',
          'System performance optimal'
        ]
        
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        
        addNotification(randomMessage, randomType)
      }, 5000)
    })

    return {
      notifications
    }
  }
}
</script>

<style scoped>
.notification-window {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
  margin: 0;
}

h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.2rem;
}

.notifications {
  height: calc(100% - 60px);
  overflow-y: auto;
  margin: 0;
}

.notification-item {
  padding: 12px;
  margin: 0 0 10px 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.notification-content {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 0 4px 0;
}

.notification-item p {
  margin: 0;
  color: var(--text-primary);
}

.success {
  border-left: 3px solid var(--success-color);
}

.warning {
  border-left: 3px solid var(--warning-color);
}

.info {
  border-left: 3px solid var(--primary-color);
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}
</style> 