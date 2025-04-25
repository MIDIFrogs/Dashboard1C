/**
 * Chart Data Service - Provides mock data for dashboard charts
 */

export const chartDataService = {
    // --- GENERAL DASHBOARD CHARTS ---

    /**
     * Returns data for the pie chart showing category sales percentages
     */
    getCategorySalesPercentage() {
        return {
            labels: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'],
            datasets: [{
                data: [35, 20, 18, 15, 12],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(33, 150, 243, 0.7)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(255, 152, 0, 0.7)',
                    'rgba(233, 30, 99, 0.7)'
                ],
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }]
        };
    },

    /**
     * Returns data for the histogram showing historical sales data
     */
    getHistoricalSalesData() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales (2023)',
                data: [65, 59, 80, 81, 56, 55, 72, 90, 81, 75, 85, 92],
                backgroundColor: 'rgba(33, 150, 243, 0.6)',
                borderColor: 'rgb(33, 150, 243)',
                borderWidth: 1
            }]
        };
    },

    /**
     * Returns data for the wind rose (radar) chart showing categories and sales plan percentage
     */
    getCategoryPlanAchievement() {
        return {
            labels: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'],
            datasets: [{
                label: 'Plan Achievement (%)',
                data: [98, 85, 112, 93, 87],
                backgroundColor: 'rgba(156, 39, 176, 0.3)',
                borderColor: 'rgb(156, 39, 176)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(156, 39, 176)',
                pointRadius: 4
            }]
        };
    },

    /**
     * Returns data for regional sales distribution (geography heatmap)
     */
    getRegionalSalesDistribution() {
        return {
            labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa'],
            datasets: [{
                    label: 'Q1',
                    data: [30, 25, 18, 12, 8],
                    backgroundColor: 'rgba(233, 30, 99, 0.7)'
                },
                {
                    label: 'Q2',
                    data: [32, 28, 20, 15, 10],
                    backgroundColor: 'rgba(233, 30, 99, 0.6)'
                },
                {
                    label: 'Q3',
                    data: [35, 30, 25, 18, 12],
                    backgroundColor: 'rgba(233, 30, 99, 0.5)'
                },
                {
                    label: 'Q4',
                    data: [40, 35, 28, 20, 15],
                    backgroundColor: 'rgba(233, 30, 99, 0.4)'
                }
            ]
        };
    },

    /**
     * Returns data for year-over-year sales comparison
     */
    getYearlyComparisonData() {
        return {
            labels: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'],
            datasets: [{
                    label: '2022',
                    data: [80, 65, 75, 60, 50],
                    backgroundColor: 'rgba(0, 188, 212, 0.5)',
                    borderColor: 'rgb(0, 188, 212)',
                    borderWidth: 1
                },
                {
                    label: '2023',
                    data: [95, 70, 90, 65, 60],
                    backgroundColor: 'rgba(0, 188, 212, 0.8)',
                    borderColor: 'rgb(0, 188, 212)',
                    borderWidth: 1
                }
            ]
        };
    },

    /**
     * Returns data for sales vs targets line chart
     */
    getSalesVsTargetsData() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                    label: 'Actual Sales',
                    data: [65, 59, 80, 81, 56, 55, 72, 90, 81, 75, 85, 92],
                    fill: false,
                    borderColor: 'rgb(255, 152, 0)',
                    backgroundColor: 'rgb(255, 152, 0)',
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: 'Target',
                    data: [70, 65, 75, 70, 60, 65, 70, 80, 75, 70, 80, 85],
                    fill: false,
                    borderColor: 'rgba(255, 152, 0, 0.4)',
                    backgroundColor: 'rgba(255, 152, 0, 0.4)',
                    borderDash: [5, 5],
                    tension: 0,
                    pointRadius: 0
                }
            ]
        };
    },

    // --- PRODUCT-SPECIFIC CHARTS ---

    /**
     * Returns historical sales data for a specific product
     * @param {number} productId - The ID of the product
     */
    getProductHistoricalSales(productId) {
        // In a real app, this would use the productId to fetch specific data
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales',
                data: [45, 38, 52, 48, 53, 59, 62, 55, 67, 71, 68, 74],
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgb(76, 175, 80)',
                borderWidth: 1
            }]
        };
    },

    /**
     * Returns quarterly sales data for a specific product (wind rose/radar chart)
     * @param {number} productId - The ID of the product
     */
    getProductQuarterlySales(productId) {
        return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Quarterly Sales',
                data: [135, 150, 168, 213],
                backgroundColor: 'rgba(156, 39, 176, 0.3)',
                borderColor: 'rgb(156, 39, 176)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(156, 39, 176)',
                pointRadius: 4
            }]
        };
    },

    /**
     * Returns target achievement data for a specific product (gauge chart)
     * @param {number} productId - The ID of the product
     */
    getProductTargetAchievement(productId) {
        return {
            datasets: [{
                data: [85],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)'
                ],
                circumference: 180,
                rotation: 270
            }]
        };
    },

    /**
     * Returns customer demographics for a specific product (doughnut chart)
     * @param {number} productId - The ID of the product
     */
    getProductCustomerSegments(productId) {
        return {
            labels: ['Enterprise', 'SMB', 'Government', 'Education', 'Consumer'],
            datasets: [{
                data: [40, 25, 15, 10, 10],
                backgroundColor: [
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(156, 39, 176, 0.6)',
                    'rgba(156, 39, 176, 0.5)',
                    'rgba(156, 39, 176, 0.4)'
                ],
                borderWidth: 1
            }]
        };
    },

    /**
     * Returns regional distribution for a specific product (polar area chart)
     * @param {number} productId - The ID of the product
     */
    getProductRegionalDistribution(productId) {
        return {
            labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa'],
            datasets: [{
                data: [35, 30, 20, 10, 5],
                backgroundColor: [
                    'rgba(255, 152, 0, 0.7)',
                    'rgba(255, 152, 0, 0.6)',
                    'rgba(255, 152, 0, 0.5)',
                    'rgba(255, 152, 0, 0.4)',
                    'rgba(255, 152, 0, 0.3)'
                ],
                borderWidth: 1
            }]
        };
    },

    /**
     * Returns growth trend for a specific product (line chart)
     * @param {number} productId - The ID of the product
     */
    getProductGrowthTrend(productId) {
        return {
            labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
            datasets: [{
                label: 'Sales Growth (%)',
                data: [0, 5, 8, 12, 15, 18, 22, 25],
                fill: true,
                backgroundColor: 'rgba(233, 30, 99, 0.2)',
                borderColor: 'rgb(233, 30, 99)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(233, 30, 99)',
                pointRadius: 4
            }]
        };
    }
};