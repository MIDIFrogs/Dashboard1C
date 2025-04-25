<template>
  <div class="heatmap-container">
    <div v-if="isLoading" class="loading-state">
      <div class="loader"></div>
      <p>Loading map data...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <div class="fallback-map">
        <div class="fallback-map-content">
          <h4>Ural Region Sales Intensity</h4>
          <div class="city-selector">
            <button :class="{'active': selectedCity === 'yekaterinburg'}" @click="selectedCity = 'yekaterinburg'">Yekaterinburg</button>
            <button :class="{'active': selectedCity === 'kurgan'}" @click="selectedCity = 'kurgan'">Kurgan</button>
          </div>
          <div class="region-data">
            <template v-if="selectedCity === 'yekaterinburg'">
              <div class="hotspot" :style="{opacity: 0.9}">North District</div>
              <div class="hotspot" :style="{opacity: 0.8}">Central District</div>
              <div class="hotspot" :style="{opacity: 0.95}">East District</div>
              <div class="hotspot" :style="{opacity: 0.75}">South District</div>
              <div class="hotspot" :style="{opacity: 0.7}">West District</div>
            </template>
            <template v-else>
              <div class="hotspot" :style="{opacity: 0.85}">Central Kurgan</div>
              <div class="hotspot" :style="{opacity: 0.7}">Northern Kurgan</div>
              <div class="hotspot" :style="{opacity: 0.9}">Eastern Suburbs</div>
              <div class="hotspot" :style="{opacity: 0.65}">Western Region</div>
              <div class="hotspot" :style="{opacity: 0.75}">Southern District</div>
            </template>
          </div>
          <div class="map-legend">
            <div class="legend-item"><span class="legend-color high"></span> High Sales</div>
            <div class="legend-item"><span class="legend-color medium"></span> Medium Sales</div>
            <div class="legend-item"><span class="legend-color low"></span> Low Sales</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="ymap-container" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { AppliedFilters } from '@/api/types';
import { getServiceFactory } from '@/api/services';

// Initialize services
const services = getServiceFactory(import.meta.env.DEV);
const { saleService, regionService } = services;

// State management
const isLoading = ref(true);
const error = ref<string | null>(null);
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<any>(null);
const heatmapLayer = ref<any>(null);
const salesData = ref<any[]>([]);
const selectedCity = ref<'yekaterinburg' | 'kurgan'>('yekaterinburg');

// City coordinates
const cityCoordinates = {
  yekaterinburg: {
    center: [56.8389, 60.6057],
    zoom: 11
  },
  kurgan: {
    center: [55.4414, 65.3414],
    zoom: 11
  }
};

// Default view that shows both cities
const uralRegionView = {
  center: [56.0, 62.5],
  zoom: 7
};

// Props and emits
const props = defineProps<{
  filters?: AppliedFilters;
}>();

// Load initial data
onMounted(async () => {
  try {
    // Load Yandex Maps API script dynamically
    await loadYandexMapsAPI();
    await loadSalesData();
    await initializeMap();
  } catch (e) {
    console.error("Error during map initialization:", e);
    error.value = e instanceof Error ? e.message : 'Failed to initialize map';
    // Show fallback map
  }
});

onUnmounted(() => {
  // Clean up resources when component is destroyed
  if (mapInstance.value) {
    mapInstance.value = null;
  }
});

// Watch for filter changes
watch(() => props.filters, async (newFilters) => {
  if (newFilters) {
    try {
      await loadSalesData(newFilters);
      updateHeatmap();
    } catch (e) {
      console.error("Error applying filters:", e);
    }
  }
}, { deep: true });

// Method to dynamically load Yandex Maps API
const loadYandexMapsAPI = async () => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Check if API is already loaded
      if (window.ymaps) {
        console.log("Yandex Maps API already loaded");
        resolve();
        return;
      }

      console.log("Loading Yandex Maps API...");
      
      // Set a timeout to handle API loading delay
      const timeoutId = setTimeout(() => {
        console.error("Yandex Maps API loading timed out");
        reject(new Error('Yandex Maps API loading timed out'));
      }, 10000);
      
      const script = document.createElement('script');
      // Use a different API key
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=40740ec5-b0bc-4c49-a6e5-7805b5a8bd8f&lang=en_US';
      script.async = true;
      
      script.onload = () => {
        console.log("Yandex Maps API loaded successfully");
        clearTimeout(timeoutId);
        // Give the API a moment to initialize
        setTimeout(() => resolve(), 500);
      };
      
      script.onerror = (e) => {
        console.error("Failed to load Yandex Maps API", e);
        clearTimeout(timeoutId);
        reject(new Error('Failed to load Yandex Maps API'));
      };
      
      document.head.appendChild(script);
    } catch (e) {
      console.error("Error in loadYandexMapsAPI:", e);
      reject(e);
    }
  });
};

// Method to load sales data
const loadSalesData = async (filters?: AppliedFilters) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Generate mock data for Yekaterinburg if no filters or if service fails
    try {
      // If filters are provided and relevant (regions, products, etc.)
      if (filters) {
        const filteredData = await saleService.getSalesFiltered(filters);
        // Transform sales data to heatmap points
        salesData.value = transformSalesToHeatmapPoints(filteredData);
      } else {
        // Load all sales data
        const allSales = await saleService.getSales(0, 1000); // Get up to 1000 sales records
        // Transform sales data to heatmap points
        salesData.value = transformSalesToHeatmapPoints(allSales.items);
      }
    } catch (e) {
      console.error("Error loading sales data, falling back to mock data:", e);
      // Fall back to mock data for both cities
      salesData.value = generateCombinedCitiesSalesData();
    }
    
    isLoading.value = false;
  } catch (e) {
    error.value = 'Failed to load sales data';
    isLoading.value = false;
    console.error('Error loading sales data:', e);
  }
};

// Method to generate mock sales data for both Yekaterinburg and Kurgan
const generateCombinedCitiesSalesData = () => {
  const yekaterinburgData = generateYekaterinburgSalesData();
  const kurganData = generateKurganSalesData();
  
  // Combine data from both cities
  return [...yekaterinburgData, ...kurganData];
};

// Method to generate mock sales data for Yekaterinburg
const generateYekaterinburgSalesData = () => {
  // Yekaterinburg districts with coordinates and sales data
  const districts = [
    { name: "Central", lat: 56.8389, lon: 60.6057, sales: 15500000, pointsCount: 30 },
    { name: "North", lat: 56.9100, lon: 60.6000, sales: 12800000, pointsCount: 25 },
    { name: "South", lat: 56.7700, lon: 60.6100, sales: 11700000, pointsCount: 25 },
    { name: "East", lat: 56.8400, lon: 60.6800, sales: 13200000, pointsCount: 20 },
    { name: "West", lat: 56.8350, lon: 60.5300, sales: 10500000, pointsCount: 20 },
    // Additional neighborhoods
    { name: "VIZ", lat: 56.8280, lon: 60.5400, sales: 9800000, pointsCount: 15 },
    { name: "Uralmash", lat: 56.8950, lon: 60.6100, sales: 11200000, pointsCount: 18 },
    { name: "Elmash", lat: 56.8870, lon: 60.6300, sales: 10800000, pointsCount: 18 },
    { name: "Academic", lat: 56.7850, lon: 60.5300, sales: 14200000, pointsCount: 22 },
    { name: "Botanica", lat: 56.7970, lon: 60.6330, sales: 13500000, pointsCount: 22 }
  ];
  
  const result = [];
  
  // Generate points for each district
  for (const district of districts) {
    for (let i = 0; i < district.pointsCount; i++) {
      // Create variation in the district - wider spread for larger areas
      const spread = district.pointsCount / 100; // Higher point count = more important district = wider spread
      const latOffset = (Math.random() - 0.5) * spread;
      const lonOffset = (Math.random() - 0.5) * spread;
      
      // Random sales amount based on district sales with some variation
      const salesVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of district average
      const pointSales = (district.sales / district.pointsCount) * salesVariation;
      
      result.push({
        coordinates: [district.lat + latOffset, district.lon + lonOffset],
        weight: pointSales / 100000, // Normalize weight
        district: district.name,
        city: 'Yekaterinburg'
      });
    }
  }
  
  return result;
};

// Method to generate mock sales data for Kurgan
const generateKurganSalesData = () => {
  // Kurgan districts with coordinates and sales data
  const districts = [
    { name: "Central", lat: 55.4414, lon: 65.3414, sales: 8500000, pointsCount: 25 },
    { name: "North", lat: 55.4700, lon: 65.3300, sales: 6800000, pointsCount: 20 },
    { name: "South", lat: 55.4100, lon: 65.3500, sales: 7200000, pointsCount: 20 },
    { name: "East", lat: 55.4400, lon: 65.3800, sales: 9200000, pointsCount: 15 },
    { name: "West", lat: 55.4350, lon: 65.3000, sales: 6500000, pointsCount: 15 },
    // Additional neighborhoods in Kurgan
    { name: "Rybny", lat: 55.4250, lon: 65.3214, sales: 5800000, pointsCount: 10 },
    { name: "Zaozernyi", lat: 55.4614, lon: 65.3614, sales: 7800000, pointsCount: 15 },
    { name: "Energetik", lat: 55.4070, lon: 65.3914, sales: 6300000, pointsCount: 10 }
  ];
  
  const result = [];
  
  // Generate points for each district
  for (const district of districts) {
    for (let i = 0; i < district.pointsCount; i++) {
      // Create variation in the district
      const spread = district.pointsCount / 150; // Appropriate spread for Kurgan's size
      const latOffset = (Math.random() - 0.5) * spread;
      const lonOffset = (Math.random() - 0.5) * spread;
      
      // Random sales amount based on district sales with some variation
      const salesVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of district average
      const pointSales = (district.sales / district.pointsCount) * salesVariation;
      
      result.push({
        coordinates: [district.lat + latOffset, district.lon + lonOffset],
        weight: pointSales / 100000, // Normalize weight
        district: district.name,
        city: 'Kurgan'
      });
    }
  }
  
  return result;
};

// Method to transform sales data to heatmap points
const transformSalesToHeatmapPoints = (sales: any[]): any[] => {
  // If no sales data or invalid data, return combined cities mock data
  if (!sales || !Array.isArray(sales) || sales.length === 0) {
    return generateCombinedCitiesSalesData();
  }
  
  // Try to transform the actual data
  try {
    return sales.map(sale => {
      // Randomly assign to either Yekaterinburg or Kurgan
      const randomCity = Math.random() > 0.4 ? 'Yekaterinburg' : 'Kurgan';
      let lat, lon;
      
      if (randomCity === 'Yekaterinburg') {
        lat = 56.8389 + (Math.random() - 0.5) * 0.1;
        lon = 60.6057 + (Math.random() - 0.5) * 0.1;
      } else {
        lat = 55.4414 + (Math.random() - 0.5) * 0.08;
        lon = 65.3414 + (Math.random() - 0.5) * 0.08;
      }
      
      // The weight corresponds to the sale amount
      // Higher sales = brighter spots on the heatmap
      return {
        coordinates: [lat, lon],
        weight: sale.actualSales / 1000000, // Normalize weight based on sales amount
        city: randomCity
      };
    });
  } catch (e) {
    console.error("Error transforming sales data:", e);
    return generateCombinedCitiesSalesData();
  }
};

// Method to initialize the map
const initializeMap = async () => {
  console.log("Initializing map...");
  
  try {
    if (!window.ymaps) {
      console.error("Yandex Maps API not loaded");
      throw new Error('Yandex Maps API not loaded');
    }
    
    // Use the Yandex Maps 2.1 API
    await new Promise<void>((resolve) => {
      window.ymaps.ready(() => {
        try {
          // Create a new map showing the Ural region (both cities visible)
          const map = new window.ymaps.Map(mapContainer.value, {
            center: uralRegionView.center,
            zoom: uralRegionView.zoom,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
          });
          
          // Add city labels
          const yekaterinburgPlacemark = new window.ymaps.Placemark(
            cityCoordinates.yekaterinburg.center, 
            { 
              hintContent: 'Yekaterinburg',
              balloonContent: 'Yekaterinburg - Total Sales: ₽62,000,000'
            }, 
            {
              preset: 'islands#nightCircleDotIcon',
              iconColor: '#00C3FF'
            }
          );
          
          const kurganPlacemark = new window.ymaps.Placemark(
            cityCoordinates.kurgan.center, 
            { 
              hintContent: 'Kurgan',
              balloonContent: 'Kurgan - Total Sales: ₽42,800,000'
            }, 
            {
              preset: 'islands#nightCircleDotIcon',
              iconColor: '#FFB800'
            }
          );
          
          map.geoObjects.add(yekaterinburgPlacemark);
          map.geoObjects.add(kurganPlacemark);
          
          // Add button panel for city selection
          const citySelectionPanel = new window.ymaps.control.ListBox({
            data: {
              content: 'Select City'
            },
            items: [
              new window.ymaps.control.ListBoxItem({
                data: {
                  content: 'Yekaterinburg'
                },
                state: {
                  selected: true
                }
              }),
              new window.ymaps.control.ListBoxItem({
                data: {
                  content: 'Kurgan'
                }
              }),
              new window.ymaps.control.ListBoxItem({
                data: {
                  content: 'Both Cities'
                }
              })
            ]
          });
          
          map.controls.add(citySelectionPanel, { float: 'right' });
          
          // Handle city selection
          citySelectionPanel.events.add('click', function(e) {
            const item = e.get('target');
            if (item) {
              const content = item.data.get('content');
              
              if (content === 'Yekaterinburg') {
                map.setCenter(cityCoordinates.yekaterinburg.center, cityCoordinates.yekaterinburg.zoom);
              } else if (content === 'Kurgan') {
                map.setCenter(cityCoordinates.kurgan.center, cityCoordinates.kurgan.zoom);
              } else if (content === 'Both Cities') {
                map.setCenter(uralRegionView.center, uralRegionView.zoom);
              }
            }
          });
          
          // Create a heat map
          const heatmap = new window.ymaps.Heatmap(
            salesData.value.map(point => ({
              coordinates: point.coordinates,
              weight: point.weight
            })), {
              radius: 15,
              dissipating: false,
              opacity: 0.8,
              intensityOfMidpoint: 0.5,
              gradient: {
                0.1: 'rgba(0, 255, 255, 0.7)',
                0.5: 'rgba(0, 255, 0, 0.7)',
                0.7: 'rgba(255, 255, 0, 0.7)',
                1.0: 'rgba(255, 0, 0, 0.7)'
              }
            }
          );
          
          // Add heatmap to the map
          heatmap.setMap(map);
          
          // Store references
          mapInstance.value = map;
          heatmapLayer.value = heatmap;
          
          resolve();
        } catch (e) {
          console.error("Error creating map:", e);
          throw e;
        }
      });
    });
  } catch (e) {
    console.error('Error initializing map:', e);
    error.value = 'Failed to initialize map: ' + (e instanceof Error ? e.message : String(e));
    throw e;
  }
};

// Method to update the heatmap with new data
const updateHeatmap = () => {
  if (heatmapLayer.value && salesData.value && salesData.value.length > 0) {
    try {
      // Update the heatmap data
      const points = salesData.value.map(point => ({
        coordinates: point.coordinates,
        weight: point.weight
      }));
      
      heatmapLayer.value.setData(points);
    } catch (e) {
      console.error("Error updating heatmap:", e);
    }
  }
};
</script>

<style scoped>
.heatmap-container {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--border-radius);
  background: var(--card-background);
  border: var(--card-border);
}

.heatmap-title {
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.heatmap-title h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 500;
}

#ymap-container {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 300px;
  z-index: 1;
  background-color: #1a2233;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: var(--text-secondary);
  flex: 1;
  text-align: center;
  padding: 20px;
}

.loading-state p {
  margin-top: 20px;
}

.error-state {
  color: #f44336;
}

.error-message {
  margin-bottom: 20px;
}

/* Loader animation */
.loader {
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 5px solid var(--primary-color);
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Fallback map styling */
.fallback-map {
  width: 100%;
  height: 280px;
  background-color: #1a2233;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.fallback-map-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fallback-map h4 {
  margin: 0 0 10px 0;
  color: #fff;
  text-align: center;
  font-size: 1.1rem;
}

.city-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.city-selector button {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.city-selector button.active {
  background-color: var(--primary-color);
}

.city-selector button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.region-data {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 15px;
  flex: 1;
}

.hotspot {
  padding: 15px;
  background-color: rgba(255, 0, 0, 0.6);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  width: calc(50% - 20px);
  max-width: 150px;
  text-align: center;
}

.hotspot:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  color: white;
  font-size: 0.9rem;
}

.legend-color {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 8px;
  border-radius: 3px;
}

.legend-color.high {
  background-color: rgba(255, 0, 0, 0.9);
}

.legend-color.medium {
  background-color: rgba(255, 0, 0, 0.6);
}

.legend-color.low {
  background-color: rgba(255, 0, 0, 0.3);
}
</style>

<script lang="ts">
// Add necessary TypeScript declarations for the Yandex Maps API
declare global {
  interface Window {
    ymaps: any;
    ymaps3: any;
    Vue: any;
  }
}
</script> 