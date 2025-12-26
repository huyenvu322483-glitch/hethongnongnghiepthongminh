import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { database } from './firebase.js';

// Chart instances
let temperatureChart, humidityChart, soilMoistureChart;
let tempChartOverview, humidityChartOverview;

// Data arrays
let tempData = [];
let humidityData = [];
let soilData = [];
let timeLabels = [];

// Initialize all charts
export function initCharts() {
    initSensorCharts();
    initOverviewCharts();
    startRealtimeUpdates();
}

// Initialize sensor dashboard charts
function initSensorCharts() {
    const tempCanvas = document.getElementById('temperatureChart');
    const humCanvas = document.getElementById('humidityChart');
    const soilCanvas = document.getElementById('soilMoistureChart');
    
    if (tempCanvas) {
        temperatureChart = new Chart(tempCanvas, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: tempData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }
    
    if (humCanvas) {
        humidityChart = new Chart(humCanvas, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }
    
    if (soilCanvas) {
        soilMoistureChart = new Chart(soilCanvas, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Soil Moisture',
                    data: soilData,
                    borderColor: 'rgb(234, 179, 8)',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }
}

// Initialize overview charts
function initOverviewCharts() {
    const tempOverviewCanvas = document.getElementById('tempChartOverview');
    const humOverviewCanvas = document.getElementById('humidityChartOverview');
    
    if (tempOverviewCanvas) {
        tempChartOverview = new Chart(tempOverviewCanvas, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: tempData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: false,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    }
                }
            }
        });
    }
    
    if (humOverviewCanvas) {
        humidityChartOverview = new Chart(humOverviewCanvas, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: false,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    }
                }
            }
        });
    }
}

// Start real-time updates
function startRealtimeUpdates() {
    const dataRef = ref(database, '/');
    
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateChartData(data);
        }
    });
}

// Update chart data
function updateChartData(data) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    // Add new data
    tempData.push(parseFloat(data.temp) || 0);
    humidityData.push(parseFloat(data.humidity) || 0);
    soilData.push(parseFloat(data.soil_hum) || 0);
    timeLabels.push(timeStr);
    
    // Keep only last 20 points
    if (tempData.length > 20) {
        tempData.shift();
        humidityData.shift();
        soilData.shift();
        timeLabels.shift();
    }
    
    // Update all chart instances
    const charts = [
        temperatureChart,
        humidityChart,
        soilMoistureChart,
        tempChartOverview,
        humidityChartOverview
    ];
    
    charts.forEach(chart => {
        if (chart) {
            chart.update('none'); // Update without animation for smooth real-time
        }
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
} else {
    initCharts();
}
