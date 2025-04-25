<template>
  <div class="popup" v-if="isVisible">
    <div class="popup-content">
      <h3>Filter Industries</h3>
      <ul>
        <li v-for="industry in industries" :key="industry.name">
          <span @click="toggleIndustry(industry)">{{ industry.name }}</span>
          <ul v-if="industry.isExpanded">
            <li v-for="company in industry.companies" :key="company">
              <span @click="removeCompany(industry, company)">{{ company }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="popup-actions">
        <button @click="applyFilters">Apply</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPopup',
  data() {
    return {
      isVisible: false,
      industries: [
        { name: 'Technology', companies: ['TechCorp', 'InnovateX'], isExpanded: false },
        { name: 'Finance', companies: ['FinBank', 'MoneyMatters'], isExpanded: false }
      ]
    };
  },
  methods: {
    toggleIndustry(industry) {
      industry.isExpanded = !industry.isExpanded;
    },
    removeCompany(industry, company) {
      const index = industry.companies.indexOf(company);
      if (index > -1) {
        industry.companies.splice(index, 1);
      }
    },
    applyFilters() {
      // Logic to apply filters
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