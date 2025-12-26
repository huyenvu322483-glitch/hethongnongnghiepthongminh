/**
 * Control Panel Module
 * Handles device control (Light and Pump)
 * Writes commands to Firebase Realtime Database
 */

import { database, ref, update } from './firebase.js';

/**
 * Control log entries
 */
const controlLog = [];
const MAX_LOG_ENTRIES = 50;

/**
 * Toggle Light System
 */
window.toggleLight = async function() {
    const toggle = document.getElementById('lightToggle');
    const newState = toggle.checked;
    
    try {
        // Write to Firebase
        const updates = {};
        updates['/light'] = newState;
        
        await update(ref(database), updates);
        
        // Log the action
        addControlLog('Light', newState ? 'ON' : 'OFF', 'success');
        
        // Show toast notification
        if (window.showToast) {
            window.showToast(`Light turned ${newState ? 'ON' : 'OFF'}`, 'success');
        }
        
        console.log(`💡 Light set to: ${newState}`);
    } catch (error) {
        console.error('Error toggling light:', error);
        
        // Revert toggle on error
        toggle.checked = !newState;
        
        // Log the error
        addControlLog('Light', 'Failed', 'error');
        
        // Show error toast
        if (window.showToast) {
            window.showToast('Failed to toggle light', 'error');
        }
    }
};

/**
 * Toggle Water Pump
 */
window.togglePump = async function() {
    const toggle = document.getElementById('pumpToggle');
    const newState = toggle.checked;
    
    try {
        // Write to Firebase
        const updates = {};
        updates['/pump'] = newState;
        
        await update(ref(database), updates);
        
        // Log the action
        addControlLog('Pump', newState ? 'ON' : 'OFF', 'success');
        
        // Show toast notification
        if (window.showToast) {
            window.showToast(`Pump turned ${newState ? 'ON' : 'OFF'}`, 'success');
        }
        
        console.log(`💧 Pump set to: ${newState}`);
    } catch (error) {
        console.error('Error toggling pump:', error);
        
        // Revert toggle on error
        toggle.checked = !newState;
        
        // Log the error
        addControlLog('Pump', 'Failed', 'error');
        
        // Show error toast
        if (window.showToast) {
            window.showToast('Failed to toggle pump', 'error');
        }
    }
};

/**
 * Add entry to control log
 */
function addControlLog(device, action, status) {
    const timestamp = new Date().toLocaleString();
    
    const logEntry = {
        device,
        action,
        status,
        timestamp
    };
    
    controlLog.unshift(logEntry);
    
    // Keep only last MAX_LOG_ENTRIES
    if (controlLog.length > MAX_LOG_ENTRIES) {
        controlLog.pop();
    }
    
    // Update UI
    updateControlLogUI();
}

/**
 * Update control log UI
 */
function updateControlLogUI() {
    const logContainer = document.getElementById('controlLog');
    if (!logContainer) return;
    
    if (controlLog.length === 0) {
        logContainer.innerHTML = '<p class="text-gray-600 text-sm">No control actions yet...</p>';
        return;
    }
    
    logContainer.innerHTML = controlLog.map(entry => {
        const statusClass = entry.status === 'success' ? 'log-entry success' : 'log-entry error';
        const icon = entry.status === 'success' ? 'check-circle' : 'exclamation-circle';
        const iconColor = entry.status === 'success' ? 'text-green-500' : 'text-red-500';
        
        return `
            <div class="${statusClass}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-${icon} ${iconColor}"></i>
                        <span class="font-semibold">${entry.device}</span>
                        <span class="text-gray-600">→</span>
                        <span class="${entry.status === 'success' ? 'text-green-600' : 'text-red-600'} font-semibold">
                            ${entry.action}
                        </span>
                    </div>
                    <span class="text-xs text-gray-500">${entry.timestamp}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Initialize automated control suggestions
 */
function initAutomatedSuggestions() {
    // This could be expanded to provide intelligent suggestions
    // based on sensor data and time of day
    
    setInterval(() => {
        // Example: Suggest turning on pump if soil moisture is low
        // This is just a placeholder for future AI-based recommendations
    }, 60000); // Check every minute
}

/**
 * Export control log data
 */
window.exportControlLog = function() {
    if (controlLog.length === 0) {
        if (window.showToast) {
            window.showToast('No data to export', 'info');
        }
        return;
    }
    
    const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'Device,Action,Status,Timestamp\n'
        + controlLog.map(e => `${e.device},${e.action},${e.status},${e.timestamp}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `control_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (window.showToast) {
        window.showToast('Control log exported', 'success');
    }
};

/**
 * Clear control log
 */
window.clearControlLog = function() {
    if (confirm('Are you sure you want to clear the control log?')) {
        controlLog.length = 0;
        updateControlLogUI();
        
        if (window.showToast) {
            window.showToast('Control log cleared', 'success');
        }
    }
};

/**
 * Schedule automated control
 * Example: Turn on lights at specific times
 */
window.scheduleControl = function(device, time, action) {
    // This is a placeholder for scheduling functionality
    // Could be expanded to support cron-like scheduling
    console.log(`Scheduling ${device} to ${action} at ${time}`);
    
    if (window.showToast) {
        window.showToast(`Scheduled: ${device} ${action} at ${time}`, 'success');
    }
};

// Initialize control panel
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎛️ Control panel initialized');
    initAutomatedSuggestions();
    updateControlLogUI();
});

export { addControlLog, updateControlLogUI };
