/**
 * Chart Data Service - Provides mock data for dashboard charts
 */

import { mockCategories } from './mockData';

export const chartDataService = {
    // --- GENERAL DASHBOARD CHARTS ---

    /**
     * Returns data for the pie chart showing category sales percentages
     */
    getCategorySalesPercentage() {
        const categoryTotals = mockCategories.map(category => ({
            name: category.name,
            total: category.products.reduce((sum, product) => 
                sum + product.sales[product.sales.length - 1].actualSales, 0)
        }));

        const total = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
        const percentages = categoryTotals.map(cat => (cat.total / total * 100).toFixed(1));

        return {
            labels: categoryTotals.map(cat => cat.name),
            datasets: [{
                data: percentages,
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',  // Green
                    'rgba(33, 150, 243, 0.7)', // Blue
                    'rgba(156, 39, 176, 0.7)', // Purple
                    'rgba(255, 152, 0, 0.7)',  // Orange
                    'rgba(233, 30, 99, 0.7)',  // Pink
                    'rgba(0, 188, 212, 0.7)'   // Cyan
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
        const currentYear = new Date().getFullYear();
        const quarters = [1, 2, 3, 4];
        
        // Get total sales for each quarter
        const quarterlyData = quarters.map(quarter => {
            return mockCategories.reduce((sum, category) => {
                return sum + category.products.reduce((prodSum, product) => {
                    const sale = product.sales.find(s => s.year === currentYear && s.quarter === quarter);
                    return prodSum + (sale ? sale.actualSales : 0);
                }, 0);
            }, 0);
        });

        return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: `Quarterly Sales (${currentYear})`,
                data: quarterlyData,
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
        const categoryAchievements = mockCategories.map(category => {
            const totalActual = category.products.reduce((sum, product) => {
                const latestSale = product.sales[product.sales.length - 1];
                return sum + latestSale.actualSales;
            }, 0);

            const totalTarget = category.products.reduce((sum, product) => {
                const latestSale = product.sales[product.sales.length - 1];
                return sum + latestSale.targetAmount;
            }, 0);

            return {
                name: category.name,
                achievement: ((totalActual / totalTarget) * 100).toFixed(1)
            };
        });

        return {
            labels: categoryAchievements.map(cat => cat.name),
            datasets: [{
                label: 'Plan Achievement (%)',
                data: categoryAchievements.map(cat => cat.achievement),
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
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        const yearlyData = mockCategories.map(category => {
            const thisYearSales = category.products.reduce((sum, product) => {
                const sales = product.sales.filter(s => s.year === currentYear);
                return sum + sales.reduce((saleSum, sale) => saleSum + sale.actualSales, 0);
            }, 0);

            const lastYearSales = category.products.reduce((sum, product) => {
                const sales = product.sales.filter(s => s.year === lastYear);
                return sum + sales.reduce((saleSum, sale) => saleSum + sale.actualSales, 0);
            }, 0);

            return {
                name: category.name,
                thisYear: thisYearSales,
                lastYear: lastYearSales
            };
        });

        return {
            labels: yearlyData.map(data => data.name),
            datasets: [
                {
                    label: lastYear.toString(),
                    data: yearlyData.map(data => data.lastYear),
                    backgroundColor: 'rgba(0, 188, 212, 0.5)',
                    borderColor: 'rgb(0, 188, 212)',
                    borderWidth: 1
                },
                {
                    label: currentYear.toString(),
                    data: yearlyData.map(data => data.thisYear),
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
        const currentYear = new Date().getFullYear();
        const quarters = [1, 2, 3, 4];

        const quarterlyData = quarters.map(quarter => {
            let actualTotal = 0;
            let targetTotal = 0;

            mockCategories.forEach(category => {
                category.products.forEach(product => {
                    const sale = product.sales.find(s => s.year === currentYear && s.quarter === quarter);
                    if (sale) {
                        actualTotal += sale.actualSales;
                        targetTotal += sale.targetAmount;
                    }
                });
            });

            return { actual: actualTotal, target: targetTotal };
        });

        return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Actual Sales',
                    data: quarterlyData.map(d => d.actual),
                    fill: false,
                    borderColor: 'rgb(255, 152, 0)',
                    backgroundColor: 'rgb(255, 152, 0)',
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: 'Target',
                    data: quarterlyData.map(d => d.target),
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
        const product = findProduct(productId);
        if (!product) return null;

        const currentYear = new Date().getFullYear();
        const quarterlyData = product.sales
            .filter(sale => sale.year === currentYear)
            .sort((a, b) => a.quarter - b.quarter);

        return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Quarterly Sales',
                data: quarterlyData.map(sale => sale.actualSales),
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
        const product = findProduct(productId);
        if (!product) return null;

        const currentYear = new Date().getFullYear();
        const quarterlyData = product.sales
            .filter(sale => sale.year === currentYear)
            .sort((a, b) => a.quarter - b.quarter);

        return {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Quarterly Sales',
                data: quarterlyData.map(sale => sale.actualSales),
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
        const product = findProduct(productId);
        if (!product) return null;

        const latestSale = product.sales[product.sales.length - 1];
        const achievement = (latestSale.actualSales / latestSale.targetAmount * 100).toFixed(1);

        return {
            datasets: [{
                data: [achievement],
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
     * Returns category distribution data for a specific product (horizontal bar chart)
     * Shows how the product performs relative to others in its category
     * @param {number} productId - The ID of the product
     */
    getProductCategoryDistribution(productId) {
        const product = findProduct(productId);
        if (!product) return null;

        // Find the category this product belongs to
        const category = mockCategories.find(cat => 
            cat.products.some(p => p.id === productId)
        );

        if (!category) return null;

        // Get the latest quarter's sales for all products in the category
        const productsData = category.products.map(p => {
            const latestSale = p.sales[p.sales.length - 1];
            return {
                name: p.name,
                sales: latestSale.actualSales,
                isTarget: p.id === productId
            };
        });

        // Sort by sales descending
        productsData.sort((a, b) => b.sales - a.sales);

        return {
            type: 'bar',
            data: {
                labels: productsData.map(p => p.name),
                datasets: [{
                    label: 'Sales Distribution in Category',
                    data: productsData.map(p => p.sales),
                    backgroundColor: productsData.map(p => 
                        p.isTarget ? 'rgba(233, 30, 99, 0.8)' : 'rgba(233, 30, 99, 0.2)'
                    ),
                    borderColor: productsData.map(p => 
                        p.isTarget ? 'rgb(233, 30, 99)' : 'rgba(233, 30, 99, 0.4)'
                    ),
                    borderWidth: productsData.map(p => p.isTarget ? 2 : 1)
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Sales: ${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Sales Amount',
                            color: '#fff'
                        },
                        ticks: { color: '#fff' },
                        grid: { color: '#ffffff20' }
                    },
                    y: {
                        ticks: { color: '#fff' },
                        grid: { color: '#ffffff20' }
                    }
                }
            }
        };
    }
};

// Helper function to find a product by ID
function findProduct(productId) {
    for (const category of mockCategories) {
        const product = category.products.find(p => p.id === productId);
        if (product) return product;
    }
    return null;
}