<template>
  <div class="quotation-map">
    <h3>Company Performance Map</h3>
    <div class="map">
      <div 
        v-for="company in companies" 
        :key="company.id"
        class="company-quote"
        :class="{ 'positive': company.change > 0, 'negative': company.change < 0 }"
        @click="selectCompany(company)"
      >
        <div class="company-name">{{ company.name }}</div>
        <div class="company-stats">
          <div class="value">{{ company.value }}%</div>
          <div class="change">
            {{ company.change > 0 ? '+' : ''}}{{ company.change }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'QuotationMap',
  setup() {
    const companies = ref([
      { id: 1, name: 'TechCorp', value: 85, change: 2.5 },
      { id: 2, name: 'InnovateX', value: 92, change: -1.8 },
      { id: 3, name: 'FinBank', value: 78, change: 3.2 },
      { id: 4, name: 'MoneyMatters', value: 88, change: -0.7 },
      { id: 5, name: 'GlobalTrade', value: 95, change: 4.1 }
    ])

    const selectCompany = (company) => {
      // Emit event to update main cards with company-specific data
      console.log('Selected company:', company.name)
    }

    return {
      companies,
      selectCompany
    }
  }
}
</script>

<style scoped>
.quotation-map {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
}

h3 {
  color: var(--text-primary);
  margin: 0 0 20px 0;
  font-size: 1.2rem;
}

.map {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.company-quote {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

.company-quote:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.2);
}

.company-name {
  color: var(--text-primary);
  font-weight: bold;
  margin-bottom: 8px;
}

.company-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value {
  font-size: 1.2rem;
  color: var(--text-primary);
}

.change {
  font-size: 0.9rem;
}

.positive {
  border-left: 3px solid var(--success-color);
}

.positive .change {
  color: var(--success-color);
}

.negative {
  border-left: 3px solid var(--error-color);
}

.negative .change {
  color: var(--error-color);
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