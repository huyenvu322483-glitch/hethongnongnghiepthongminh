/**
 * Charts Module
 * Handles Chart.js visualization for sensor data
 * Creates and updates real-time charts
 */

let temperatureChart = null;
let humidityChart = null;
let soilMoistureChart = null;
let tempChartOverview = null;
let humidityChartOverview = null;

/**
 * Initialize all charts
 */
function initCharts() {
    initTemperatureChart();
    initHumidityChart();
    initSoilMoistureChart();
    initOverviewCharts();
    console.log('📈 Charts initialized');
}

/**
 * Initialize Temperature Chart
 */
function initTemperatureChart() {
    const ctx = document.getElementById('tempChart');
    if (!ctx) return;
    
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#374151'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '°C';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 50,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        },
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#6b7280',
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/**
 * Initialize Humidity Chart
 */
function initHumidityChart() {
    const ctx = document.getElementById('humidityChart');
    if (!ctx) return;
    
    humidityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#374151'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#6b7280',
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/**
 * Initialize Soil Moisture Chart
 */
function initSoilMoistureChart() {
    const ctx = document.getElementById('soilChart');
    if (!ctx) return;
    
    soilMoistureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Soil Moisture',
                data: [],
                borderColor: 'rgb(202, 138, 4)',
                backgroundColor: 'rgba(202, 138, 4, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(202, 138, 4)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#374151'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#6b7280',
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/**
 * Initialize Overview Temperature Chart
 */
function initOverviewCharts() {
    // Temperature Chart for Overview
    const ctxTempOverview = document.getElementById('tempChartOverview');
    if (ctxTempOverview) {
        tempChartOverview = new Chart(ctxTempOverview, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 12, weight: 'bold' },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '°C';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 50,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: function(value) { return value + '°C'; },
                            font: { size: 11 },
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 10 },
                            color: '#6b7280',
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                animation: { duration: 750, easing: 'easeInOutQuart' }
            }
        });
    }

    // Humidity Chart for Overview
    const ctxHumOverview = document.getElementById('humidityChartOverview');
    if (ctxHumOverview) {
        humidityChartOverview = new Chart(ctxHumOverview, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 12, weight: 'bold' },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            font: { size: 11 },
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 10 },
                            color: '#6b7280',
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                animation: { duration: 750, easing: 'easeInOutQuart' }
            }
        });
    }
}

/**
 * Update all charts with latest data
 */
function updateCharts() {
    if (!window.sensorHistory) return;
    
    const history = window.sensorHistory;
    
    // Update Temperature Chart
    if (temperatureChart) {
        temperatureChart.data.labels = history.timestamps;
        temperatureChart.data.datasets[0].data = history.temperature;
        temperatureChart.update('none'); // Update without animation for smooth real-time updates
    }
    
    // Update Humidity Chart
    if (humidityChart) {
        humidityChart.data.labels = history.timestamps;
        humidityChart.data.datasets[0].data = history.humidity;
        humidityChart.update('none');
    }
    
    // Update Soil Moisture Chart
    if (soilMoistureChart) {
        soilMoistureChart.data.labels = history.timestamps;
        soilMoistureChart.data.datasets[0].data = history.soilMoisture;
        soilMoistureChart.update('none');
    }
    
    // Update Overview Temperature Chart
    if (tempChartOverview) {
        tempChartOverview.data.labels = history.timestamps;
        tempChartOverview.data.datasets[0].data = history.temperature;
        tempChartOverview.update('none');
    }
    
    // Update Overview Humidity Chart
    if (humidityChartOverview) {
        humidityChartOverview.data.labels = history.timestamps;
        humidityChartOverview.data.datasets[0].data = history.humidity;
        humidityChartOverview.update('none');
    }
}

/**
 * Initialize sample data for demonstration
 * This creates initial data points before real data arrives
 */
function initSampleData() {
    const now = Date.now();
    const interval = 60000; // 1 minute intervals
    
    for (let i = 19; i >= 0; i--) {
        const time = new Date(now - (i * interval));
        const timeString = time.toLocaleTimeString();
        
        // Generate realistic sample data
        window.sensorHistory.timestamps.push(timeString);
        window.sensorHistory.temperature.push(25 + Math.random() * 6); // 25-31°C
        window.sensorHistory.humidity.push(60 + Math.random() * 20); // 60-80%
        window.sensorHistory.soilMoisture.push(1.0 + Math.random() * 0.5); // 1.0-1.5
    }
    
    updateCharts();
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Chart.js is loaded
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initCharts();
            
            // Initialize with sample data if no real data yet
            if (window.sensorHistory && window.sensorHistory.timestamps.length === 0) {
                initSampleData();
            }
        } else {
            console.error('Chart.js not loaded');
        }
    }, 100);
});

// Export update function to be called from dashboard.js
window.updateCharts = updateCharts;

export { initCharts, updateCharts };
