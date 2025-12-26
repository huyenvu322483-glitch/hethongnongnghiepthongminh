// Dashboard Scroll - Sensor Data Display Only
// Controls are handled by inline script in index.html
// This file DOES NOT import Firebase or handle device controls

// Update sensor displays from data (called by inline script)
export function updateSensorDisplays(data) {
    if (!data) return;
    
    // Update temperature
    const tempElements = document.querySelectorAll('#temp, #temp-value');
    tempElements.forEach(el => {
        if (el) el.textContent = data.temp || '--';
    });
    
    // Update humidity
    const humidityElements = document.querySelectorAll('#humidity, #humidity-value');
    humidityElements.forEach(el => {
        if (el) el.textContent = data.humidity || '--';
    });
    
    // Update soil moisture
    const soilElements = document.querySelectorAll('#soil, #soil-value');
    soilElements.forEach(el => {
        if (el) el.textContent = data.soil_hum || '--';
    });
    
    // Update sunlight
    const sunElements = document.querySelectorAll('#sunlight, #sun-value');
    sunElements.forEach(el => {
        if (el) el.textContent = data.sun || '--';
    });
    
    // Update light status display (KPI card only, NOT controls)
    const lightElements = document.querySelectorAll('#light');
    lightElements.forEach(el => {
        if (el) el.textContent = data.light === true ? 'ON' : 'OFF';
    });
    
    // Update pump status display (KPI card only, NOT controls)
    const pumpElements = document.querySelectorAll('#pump');
    pumpElements.forEach(el => {
        if (el) el.textContent = data.pump === true ? 'ON' : 'OFF';
    });
    
    // Update last sync time
    const lastSyncElements = document.querySelectorAll('#lastSync');
    lastSyncElements.forEach(el => {
        if (el) el.textContent = new Date().toLocaleTimeString();
    });
}

// Empty default export for compatibility
export function updateDashboard() {
    // Placeholder - actual logic in inline script
}

export default updateSensorDisplays;
