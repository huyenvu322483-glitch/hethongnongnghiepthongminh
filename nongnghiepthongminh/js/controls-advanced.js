import { ref, onValue, update } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { database } from './firebase.js';

// Control mode state
let controlMode = 'manual'; // 'manual' or 'auto'
let isAutoProcessing = false;

// Initialize controls
export function setupControls() {
    setupModeButtons();
    setupDeviceToggles();
    startAutoModeMonitoring();
    
    // Initialize with manual mode
    setTimeout(() => {
        switchMode('manual');
    }, 500);
}

// Setup mode switching buttons
function setupModeButtons() {
    const manualBtn = document.getElementById('manualModeBtn');
    const autoBtn = document.getElementById('autoModeBtn');
    
    if (manualBtn) {
        manualBtn.addEventListener('click', () => switchMode('manual'));
    }
    
    if (autoBtn) {
        autoBtn.addEventListener('click', () => switchMode('auto'));
    }
}

// Switch between manual and auto mode
async function switchMode(mode) {
    controlMode = mode;
    
    // Update Firebase
    await update(ref(database, '/'), { 
        controlMode: mode 
    });
    
    // Update UI
    const manualBtn = document.getElementById('manualModeBtn');
    const autoBtn = document.getElementById('autoModeBtn');
    const currentModeText = document.getElementById('currentMode');
    const modeDescription = document.getElementById('modeDescription');
    const lightAutoInfo = document.getElementById('lightAutoInfo');
    const pumpAutoInfo = document.getElementById('pumpAutoInfo');
    const lightToggleContainer = document.getElementById('lightToggleContainer');
    const pumpToggleContainer = document.getElementById('pumpToggleContainer');
    const lightModeIndicator = document.getElementById('lightModeIndicator');
    const pumpModeIndicator = document.getElementById('pumpModeIndicator');
    
    if (mode === 'manual') {
        // Manual mode styling
        manualBtn.classList.add('bg-agri-green', 'text-white', 'shadow-lg');
        manualBtn.classList.remove('text-gray-600', 'hover:bg-gray-200');
        autoBtn.classList.remove('bg-agri-green', 'text-white', 'shadow-lg');
        autoBtn.classList.add('text-gray-600', 'hover:bg-gray-200');
        
        if (currentModeText) currentModeText.textContent = 'MANUAL';
        if (modeDescription) modeDescription.textContent = 'Manual control - Use toggles to control devices';
        
        // Show toggles, hide auto info
        if (lightToggleContainer) lightToggleContainer.classList.remove('opacity-50', 'pointer-events-none');
        if (pumpToggleContainer) pumpToggleContainer.classList.remove('opacity-50', 'pointer-events-none');
        if (lightAutoInfo) lightAutoInfo.classList.add('hidden');
        if (pumpAutoInfo) pumpAutoInfo.classList.add('hidden');
        
        // Update indicators
        if (lightModeIndicator) {
            lightModeIndicator.textContent = 'MANUAL';
            lightModeIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
        }
        if (pumpModeIndicator) {
            pumpModeIndicator.textContent = 'MANUAL';
            pumpModeIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
        }
        
        showToast('📱 Manual mode activated', 'info');
    } else {
        // Auto mode styling
        autoBtn.classList.add('bg-agri-green', 'text-white', 'shadow-lg');
        autoBtn.classList.remove('text-gray-600', 'hover:bg-gray-200');
        manualBtn.classList.remove('bg-agri-green', 'text-white', 'shadow-lg');
        manualBtn.classList.add('text-gray-600', 'hover:bg-gray-200');
        
        if (currentModeText) currentModeText.textContent = 'AUTO';
        if (modeDescription) modeDescription.textContent = 'Automatic control - System controls devices based on sensor readings';
        
        // Disable toggles, show auto info
        if (lightToggleContainer) lightToggleContainer.classList.add('opacity-50', 'pointer-events-none');
        if (pumpToggleContainer) pumpToggleContainer.classList.add('opacity-50', 'pointer-events-none');
        if (lightAutoInfo) lightAutoInfo.classList.remove('hidden');
        if (pumpAutoInfo) pumpAutoInfo.classList.remove('hidden');
        
        // Update indicators
        if (lightModeIndicator) {
            lightModeIndicator.textContent = 'AUTO';
            lightModeIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white';
        }
        if (pumpModeIndicator) {
            pumpModeIndicator.textContent = 'AUTO';
            pumpModeIndicator.className = 'px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white';
        }
        
        showToast('🤖 Auto mode activated', 'info');
    }
}

// Setup device toggle switches
function setupDeviceToggles() {
    const lightToggle = document.getElementById('lightToggle');
    const pumpToggle = document.getElementById('pumpToggle');
    
    if (lightToggle) {
        lightToggle.addEventListener('change', async (e) => {
            if (controlMode === 'auto') {
                showToast('⚠️ Switch to Manual mode to control devices', 'warning');
                // Revert toggle back
                setTimeout(() => {
                    e.target.checked = !e.target.checked;
                }, 100);
                return;
            }
            
            const newState = e.target.checked ? 1 : 0;
            try {
                await update(ref(database, '/'), { light: newState });
                showToast(`💡 Light turned ${newState === 1 ? 'ON' : 'OFF'}`, 'success');
            } catch (error) {
                console.error('Error updating light:', error);
                showToast('❌ Failed to update light', 'error');
                e.target.checked = !e.target.checked;
            }
        });
    }
    
    if (pumpToggle) {
        pumpToggle.addEventListener('change', async (e) => {
            if (controlMode === 'auto') {
                showToast('⚠️ Switch to Manual mode to control devices', 'warning');
                // Revert toggle back
                setTimeout(() => {
                    e.target.checked = !e.target.checked;
                }, 100);
                return;
            }
            
            const newState = e.target.checked ? 1 : 0;
            try {
                await update(ref(database, '/'), { pump: newState });
                showToast(`💦 Pump turned ${newState === 1 ? 'ON' : 'OFF'}`, 'success');
            } catch (error) {
                console.error('Error updating pump:', error);
                showToast('❌ Failed to update pump', 'error');
                e.target.checked = !e.target.checked;
            }
        });
    }
}

// Auto mode monitoring and control logic
function startAutoModeMonitoring() {
    const dataRef = ref(database, '/');
    
    onValue(dataRef, async (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        // Update control mode from Firebase
        if (data.controlMode && data.controlMode !== controlMode) {
            switchMode(data.controlMode);
        }
        
        // Update toggle states
        const lightToggle = document.getElementById('lightToggle');
        const pumpToggle = document.getElementById('pumpToggle');
        
        if (lightToggle) lightToggle.checked = data.light === 1;
        if (pumpToggle) pumpToggle.checked = data.pump === 1;
        
        // Auto mode logic
        if (controlMode === 'auto' && !isAutoProcessing) {
            isAutoProcessing = true;
            await performAutoControl(data);
            isAutoProcessing = false;
        }
        
        // Update status displays
        updateStatusDisplays(data);
    });
}

// Perform automatic control based on sensor readings
async function performAutoControl(data) {
    const updates = {};
    let hasChanges = false;
    
    // Auto Light Control (based on sunlight)
    const sunlight = parseFloat(data.sun) || 0;
    const currentLight = data.light || 0;
    
    if (sunlight < 300 && currentLight === 0) {
        updates.light = 1;
        hasChanges = true;
        showToast('🌙 Auto: Light turned ON (low sunlight)', 'info');
    } else if (sunlight >= 500 && currentLight === 1) {
        updates.light = 0;
        hasChanges = true;
        showToast('☀️ Auto: Light turned OFF (sufficient sunlight)', 'info');
    }
    
    // Auto Pump Control (based on soil moisture)
    const soilMoisture = parseFloat(data.soil_hum) || 0;
    const currentPump = data.pump || 0;
    
    if (soilMoisture < 300 && currentPump === 0) {
        updates.pump = 1;
        hasChanges = true;
        showToast('🌱 Auto: Pump turned ON (dry soil)', 'info');
    } else if (soilMoisture >= 600 && currentPump === 1) {
        updates.pump = 0;
        hasChanges = true;
        showToast('💧 Auto: Pump turned OFF (sufficient moisture)', 'info');
    }
    
    // Apply updates if there are changes
    if (hasChanges) {
        await update(ref(database, '/'), updates);
    }
}

// Update status displays
function updateStatusDisplays(data) {
    const lightStatus = document.getElementById('lightStatus');
    const pumpStatus = document.getElementById('pumpStatus');
    
    if (lightStatus) {
        const status = data.light === 1 ? 'ON' : 'OFF';
        lightStatus.textContent = status;
        lightStatus.className = `text-2xl font-bold ${data.light === 1 ? 'text-green-600' : 'text-gray-600'}`;
    }
    
    if (pumpStatus) {
        const status = data.pump === 1 ? 'ON' : 'OFF';
        pumpStatus.textContent = status;
        pumpStatus.className = `text-2xl font-bold ${data.pump === 1 ? 'text-green-600' : 'text-gray-600'}`;
    }
}

// Toast notification system
let toastTimeout;
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 z-50 font-semibold';
        document.body.appendChild(toast);
    }
    
    // Clear existing timeout
    if (toastTimeout) clearTimeout(toastTimeout);
    
    // Set color based on type
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-600 text-white'
    };
    
    toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 z-50 font-semibold ${colors[type] || colors.success}`;
    toast.textContent = message;
    toast.style.transform = 'translateY(0) scale(1)';
    toast.style.opacity = '1';
    
    toastTimeout = setTimeout(() => {
        toast.style.transform = 'translateY(100px) scale(0.8)';
        toast.style.opacity = '0';
    }, 3000);
}

// Initialize on load
setupControls();
