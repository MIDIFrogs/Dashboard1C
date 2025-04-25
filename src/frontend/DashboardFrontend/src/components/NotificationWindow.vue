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
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'NotificationWindow',
  props: {
    maxNotifications: {
      type: Number,
      default: 10
    },
    refreshInterval: {
      type: Number,
      default: 10000 // Default to 10 seconds
    }
  },
  setup(props, { expose }) {
    const notifications = ref([])
    let notificationId = 0
    let updateInterval = null

    const addNotification = (message, type = 'info') => {
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      notifications.value.unshift({
        id: notificationId++,
        message,
        type,
        time
      })

      // Keep only specified number of notifications
      if (notifications.value.length > props.maxNotifications) {
        notifications.value.pop()
      }
    }

    // Set up event listener for data updates
    onMounted(() => {
      window.addEventListener('data-updated', handleDataUpdate)
      window.addEventListener('show-notification', handleExternalNotification)

      // Demo notifications for initial state
      const demoNotifications = [
        { message: 'Dashboard initialized successfully', type: 'success' },
        { message: 'Loading sales data...', type: 'info' },
        { message: 'All systems operational', type: 'info' }
      ]

      demoNotifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification(notification.message, notification.type)
        }, index * 800)
      })

      // Start interval for simulated updates
      startUpdateInterval();
    })
    
    onUnmounted(() => {
      window.removeEventListener('data-updated', handleDataUpdate)
      window.removeEventListener('show-notification', handleExternalNotification)
      
      if (updateInterval) {
        clearInterval(updateInterval)
      }
    })
    
    // Handle data update events from application
    const handleDataUpdate = (event) => {
      const updateInfo = event.detail || {}
      const message = updateInfo.message || 'Dashboard data has been updated'
      addNotification(message, 'info')
    }
    
    // Handle external notification events
    const handleExternalNotification = (event) => {
      const { message, type } = event.detail || {}
      if (message) {
        addNotification(message, type || 'info')
      }
    }
    
    // Start interval for simulated updates
    const startUpdateInterval = () => {
      updateInterval = setInterval(() => {
        const types = ['info', 'success', 'warning']
        const messages = [
          'Market analysis updated',
          'New trading volume record',
          'Company report available',
          'System performance optimal',
          'Data synchronization complete',
          'Regional sales updated',
          'Product comparison refreshed'
        ]
        
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        
        addNotification(randomMessage, randomType)
      }, props.refreshInterval)
    }
    
    // Expose methods for external components to use
    expose({
      addNotification
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
  padding: 15px;
  height: 100%;
  backdrop-filter: blur(10px);
  margin: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.2rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

h3::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.notifications {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding-right: 5px;
}

.notification-item {
  padding: 10px 12px;
  margin: 0 0 8px 0;
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
  margin: 0 0 3px 0;
}

.notification-item p {
  margin: 0;
  color: var(--text-primary);
  word-wrap: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
}

.success {
  border-left: 3px solid var(--success-color, #4CAF50);
}

.warning {
  border-left: 3px solid var(--warning-color, #FF9800);
}

.info {
  border-left: 3px solid var(--primary-color, #00f2fe);
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
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color, #00f2fe);
  border-radius: 3px;
}

@media (max-width: 1200px) {
  .notification-window {
    min-height: 300px;
    height: 300px;
  }
  
  .notification-item {
    padding: 8px 10px;
    margin-bottom: 6px;
  }
  
  .notification-item p {
    font-size: 0.85rem;
  }
}
</style> 