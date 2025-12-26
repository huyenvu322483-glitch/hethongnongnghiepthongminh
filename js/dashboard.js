/**
 * Dashboard Module
 * Handles real-time data updates from Firebase
 * Updates UI with sensor data and device status
 */

import { database, ref, onValue } from './firebase.js';

/**
 * Store historical data for charts
 */
window.sensorHistory = {
    temperature: [],
    humidity: [],
    soilMoisture: [],
    timestamps: [],
    maxDataPoints: 20
};

/**
 * Initialize dashboard listeners
 */
function initDashboard() {
    // Reference to root of database
    const dataRef = ref(database, '/');
    
    // Listen for real-time updates
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            console.log('📊 Data received:', data);
            updateDashboard(data);
            updateHistoricalData(data);
            updateAnalytics(data);
            updateLastUpdateTime();
        }
    }, (error) => {
        console.error('Error reading data:', error);
        showToast('Error loading data', 'error');
    });
}

/**
 * Update dashboard UI with current data
 */
function updateDashboard(data) {
    // Temperature
    const tempElement = document.getElementById('temp-value');
    if (tempElement && data.temp !== undefined) {
        tempElement.textContent = data.temp;
    }
    
    // Humidity
    const humidityElement = document.getElementById('humidity-value');
    if (humidityElement && data.humidity !== undefined) {
        humidityElement.textContent = data.humidity.toFixed(1);
    }
    
    // Soil Moisture
    const soilElement = document.getElementById('soil-value');
    if (soilElement && data.soil_hum !== undefined) {
        soilElement.textContent = data.soil_hum;
    }
    
    // Light Status
    updateStatusBadge('light-value', data.light);
    
    // Pump Status
    updateStatusBadge('pump-value', data.pump);
    
    // Sunlight
    const sunElement = document.getElementById('sun-value');
    if (sunElement && data.sun !== undefined) {
        sunElement.textContent = data.sun;
    }
    
    // Update control panel status displays
    updateControlStatus(data);
}

/**
 * Update status badge (ON/OFF)
 */
function updateStatusBadge(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const isOn = value === true || value === 1 || value === '1';
    
    element.textContent = isOn ? 'ON' : 'OFF';
    element.className = isOn 
        ? 'px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse'
        : 'px-6 py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold shadow-md transition-all duration-300';
}

/**
 * Update control panel status displays
 */
function updateControlStatus(data) {
    // Light status in control panel
    const lightStatus = document.getElementById('lightStatus');
    if (lightStatus) {
        const isOn = data.light === true || data.light === 1;
        lightStatus.textContent = isOn ? 'ON' : 'OFF';
        lightStatus.className = isOn
            ? 'px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg animate-pulse transition-all duration-300'
            : 'px-6 py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold shadow-md transition-all duration-300';
        
        // Update toggle switch
        const lightToggle = document.getElementById('lightToggle');
        if (lightToggle) lightToggle.checked = isOn;
    }
    
    // Light status in Overview
    const lightStatusOverview = document.getElementById('lightStatusOverview');
    if (lightStatusOverview) {
        const isOn = data.light === true || data.light === 1;
        lightStatusOverview.textContent = isOn ? 'ON' : 'OFF';
        lightStatusOverview.className = isOn
            ? 'px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg animate-pulse transition-all duration-300'
            : 'px-6 py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold shadow-md transition-all duration-300';
        
        // Update toggle switch in Overview
        const lightToggleOverview = document.getElementById('lightToggleOverview');
        if (lightToggleOverview) lightToggleOverview.checked = isOn;
    }
    
    // Pump status in control panel
    const pumpStatus = document.getElementById('pumpStatus');
    if (pumpStatus) {
        const isOn = data.pump === true || data.pump === 1;
        pumpStatus.textContent = isOn ? 'ON' : 'OFF';
        pumpStatus.className = isOn
            ? 'px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg animate-pulse transition-all duration-300'
            : 'px-6 py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold shadow-md transition-all duration-300';
        
        // Update toggle switch
        const pumpToggle = document.getElementById('pumpToggle');
        if (pumpToggle) pumpToggle.checked = isOn;
    }
    
    // Pump status in Overview
    const pumpStatusOverview = document.getElementById('pumpStatusOverview');
    if (pumpStatusOverview) {
        const isOn = data.pump === true || data.pump === 1;
        pumpStatusOverview.textContent = isOn ? 'ON' : 'OFF';
        pumpStatusOverview.className = isOn
            ? 'px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg animate-pulse transition-all duration-300'
            : 'px-6 py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold shadow-md transition-all duration-300';
        
        // Update toggle switch in Overview
        const pumpToggleOverview = document.getElementById('pumpToggleOverview');
        if (pumpToggleOverview) pumpToggleOverview.checked = isOn;
    }
}

/**
 * Store historical data for charts
 */
function updateHistoricalData(data) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    // Add new data
    window.sensorHistory.temperature.push(data.temp || 0);
    window.sensorHistory.humidity.push(data.humidity || 0);
    window.sensorHistory.soilMoisture.push(data.soil_hum || 0);
    window.sensorHistory.timestamps.push(timeString);
    
    // Keep only last N data points
    const maxPoints = window.sensorHistory.maxDataPoints;
    if (window.sensorHistory.temperature.length > maxPoints) {
        window.sensorHistory.temperature.shift();
        window.sensorHistory.humidity.shift();
        window.sensorHistory.soilMoisture.shift();
        window.sensorHistory.timestamps.shift();
    }
    
    // Update charts if they exist
    if (window.updateCharts) {
        window.updateCharts();
    }
}

/**
 * Update analytics section
 */
function updateAnalytics(data) {
    // Calculate averages
    const tempHistory = window.sensorHistory.temperature;
    const humHistory = window.sensorHistory.humidity;
    const soilHistory = window.sensorHistory.soilMoisture;
    
    if (tempHistory.length > 0) {
        const avgTemp = tempHistory.reduce((a, b) => a + b, 0) / tempHistory.length;
        const avgTempElement = document.getElementById('avgTemp');
        const avgTempOverview = document.getElementById('avgTempOverview');
        if (avgTempElement) {
            avgTempElement.textContent = avgTemp.toFixed(1);
        }
        if (avgTempOverview) {
            avgTempOverview.textContent = avgTemp.toFixed(1);
        }
        
        // Temperature warning
        updateWarning('tempWarning', data.temp, 20, 32, 'Temperature');
        updateWarning('tempWarningOverview', data.temp, 20, 32, 'Temperature');
    }
    
    if (humHistory.length > 0) {
        const avgHum = humHistory.reduce((a, b) => a + b, 0) / humHistory.length;
        const avgHumElement = document.getElementById('avgHumidity');
        const avgHumOverview = document.getElementById('avgHumidityOverview');
        if (avgHumElement) {
            avgHumElement.textContent = avgHum.toFixed(1);
        }
        if (avgHumOverview) {
            avgHumOverview.textContent = avgHum.toFixed(1);
        }
        
        // Humidity warning
        updateWarning('humidityWarning', data.humidity, 40, 80, 'Humidity');
        updateWarning('humidityWarningOverview', data.humidity, 40, 80, 'Humidity');
    }
    
    if (soilHistory.length > 0) {
        const avgSoil = soilHistory.reduce((a, b) => a + b, 0) / soilHistory.length;
        const avgSoilElement = document.getElementById('avgSoil');
        const avgSoilOverview = document.getElementById('avgSoilOverview');
        if (avgSoilElement) {
            avgSoilElement.textContent = avgSoil.toFixed(2);
        }
        if (avgSoilOverview) {
            avgSoilOverview.textContent = avgSoil.toFixed(2);
        }
        
        // Soil warning
        updateWarning('soilWarningOverview', data.soil_hum, 0.5, 2.5, 'Soil Moisture');
    }
    
    // Update data points counter
    const dataPointsElement = document.getElementById('dataPoints');
    if (dataPointsElement) {
        dataPointsElement.textContent = tempHistory.length;
    }
}

/**
 * Update warning indicators
 */
function updateWarning(elementId, value, min, max, label) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const isNormal = value >= min && value <= max;
    
    if (isNormal) {
        element.className = 'p-4 bg-green-50 border-l-4 border-green-500 rounded';
        element.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle text-green-500"></i>
                <div>
                    <p class="font-semibold text-gray-800">${label}: Normal</p>
                    <p class="text-sm text-gray-600">Optimal range: ${min}-${max}${label === 'Humidity' ? '%' : '°C'}</p>
                </div>
            </div>
        `;
    } else {
        element.className = 'p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded';
        element.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-exclamation-triangle text-yellow-500"></i>
                <div>
                    <p class="font-semibold text-gray-800">${label}: Warning</p>
                    <p class="text-sm text-gray-600">Value ${value} is outside optimal range: ${min}-${max}${label === 'Humidity' ? '%' : '°C'}</p>
                </div>
            </div>
        `;
    }
}

/**
 * Update last update timestamp
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = `Last update: ${timeString}`;
    }
    
    const lastSyncElement = document.getElementById('lastSync');
    if (lastSyncElement) {
        lastSyncElement.textContent = timeString;
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const bgColor = type === 'error' ? 'bg-red-500' : 
                    type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    
    toast.innerHTML = `
        <div class="flex items-center space-x-3 ${bgColor} text-white px-4 py-3 rounded-lg">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Initialize uptime counter
 */
function initUptimeCounter() {
    const startTime = Date.now();
    
    setInterval(() => {
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing dashboard...');
    initDashboard();
    initUptimeCounter();
});

// Export functions for use in other modules
window.showToast = showToast;

export { initDashboard, updateDashboard, showToast };
