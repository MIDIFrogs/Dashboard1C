<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Card from './components/Card.vue'
import QuotationMap from './components/QuotationMap.vue'
import NotificationWindow from './components/NotificationWindow.vue'
import ReportPopup from './components/ReportPopup.vue'
import FilterPopup from './components/FilterPopup.vue'
</script>

<template>
  <Header />

  <main>
    <div class="static-cards">
      <QuotationMap />
      <NotificationWindow />
    </div>
    <div class="dynamic-cards">
      <Card title="Card 1" />
      <Card title="Card 2" />
      <!-- Add more cards as needed -->
    </div>
  </main>

  <ReportPopup />
  <FilterPopup />
  <Footer />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.static-cards {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}
.dynamic-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
</style>
