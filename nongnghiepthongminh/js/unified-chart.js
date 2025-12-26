import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { database } from './firebase.js';

// Chart instance
let unifiedChart = null;

// Data arrays
let timeLabels = [];
let temperatureData = [];
let humidityData = [];
let soilMoistureData = [];

// Chart visibility
let chartVisibility = {
    temperature: true,
    humidity: true,
    soil: true
};

// Initialize unified chart
export function initUnifiedChart() {
    const canvas = document.getElementById('unifiedChart');
    if (!canvas) return;
    
    // Create chart
    unifiedChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    hidden: !chartVisibility.temperature
                },
                {
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    hidden: !chartVisibility.humidity
                },
                {
                    label: 'Soil Moisture (normalized)',
                    data: soilMoistureData,
                    borderColor: 'rgb(202, 138, 4)',
                    backgroundColor: 'rgba(202, 138, 4, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(202, 138, 4)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    hidden: !chartVisibility.soil
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(1);
                                if (context.datasetIndex === 0) label += '°C';
                                else if (context.datasetIndex === 1) label += '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: '#6b7280',
                        callback: function(value) {
                            return value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Value (0-100 scale)',
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        color: '#374151'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.02)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#9ca3af',
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
    
    // Setup checkbox listeners
    setupChartToggles();
    
    // Start real-time updates
    startRealtimeUpdates();
}

// Setup chart visibility toggles
function setupChartToggles() {
    const tempCheckbox = document.getElementById('showTemp');
    const humidityCheckbox = document.getElementById('showHumidity');
    const soilCheckbox = document.getElementById('showSoil');
    
    if (tempCheckbox) {
        tempCheckbox.addEventListener('change', (e) => {
            chartVisibility.temperature = e.target.checked;
            toggleDataset(0, e.target.checked);
        });
    }
    
    if (humidityCheckbox) {
        humidityCheckbox.addEventListener('change', (e) => {
            chartVisibility.humidity = e.target.checked;
            toggleDataset(1, e.target.checked);
        });
    }
    
    if (soilCheckbox) {
        soilCheckbox.addEventListener('change', (e) => {
            chartVisibility.soil = e.target.checked;
            toggleDataset(2, e.target.checked);
        });
    }
}

// Toggle dataset visibility
function toggleDataset(index, visible) {
    if (!unifiedChart) return;
    
    const meta = unifiedChart.getDatasetMeta(index);
    meta.hidden = !visible;
    unifiedChart.update();
}

// Start real-time data updates
function startRealtimeUpdates() {
    const dataRef = ref(database, '/');
    
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        updateChartData(data);
        updateRangeDisplays(data);
    });
}

// Update chart with new data
function updateChartData(data) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Parse sensor values
    const temp = parseFloat(data.temp) || 0;
    const humidity = parseFloat(data.humidity) || 0;
    const soil = parseFloat(data.soil_hum) || 0;
    
    // Normalize soil moisture to 0-100 scale (assuming 0-1023 range)
    const normalizedSoil = Math.min(100, (soil / 1023) * 100);
    
    // Add new data
    temperatureData.push(temp);
    humidityData.push(humidity);
    soilMoistureData.push(normalizedSoil);
    timeLabels.push(timeStr);
    
    // Keep only last 20 points
    const maxPoints = 20;
    if (temperatureData.length > maxPoints) {
        temperatureData.shift();
        humidityData.shift();
        soilMoistureData.shift();
        timeLabels.shift();
    }
    
    // Update chart
    if (unifiedChart) {
        unifiedChart.update('none'); // No animation for smooth real-time
    }
}

// Update range displays
function updateRangeDisplays(data) {
    if (temperatureData.length === 0) return;
    
    // Calculate ranges
    const tempMin = Math.min(...temperatureData).toFixed(1);
    const tempMax = Math.max(...temperatureData).toFixed(1);
    const humMin = Math.min(...humidityData).toFixed(1);
    const humMax = Math.max(...humidityData).toFixed(1);
    const soilMin = Math.min(...soilMoistureData).toFixed(0);
    const soilMax = Math.max(...soilMoistureData).toFixed(0);
    
    // Update displays
    const tempRangeEl = document.getElementById('tempRange');
    const humidityRangeEl = document.getElementById('humidityRange');
    const soilRangeEl = document.getElementById('soilRange');
    
    if (tempRangeEl) tempRangeEl.textContent = `${tempMin}-${tempMax}°C`;
    if (humidityRangeEl) humidityRangeEl.textContent = `${humMin}-${humMax}%`;
    if (soilRangeEl) soilRangeEl.textContent = `${soilMin}-${soilMax}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedChart);
} else {
    initUnifiedChart();
}

export { unifiedChart };
