import { ref, update } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { database } from './firebase.js';

// Light control
export function setupControls() {
    // Setup all light toggles
    const lightToggles = document.querySelectorAll('#lightToggle, #lightToggleMain');
    lightToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', async (e) => {
                const newState = e.target.checked ? 1 : 0;
                await update(ref(database, '/'), { light: newState });
                
                // Update all other toggles
                lightToggles.forEach(t => {
                    if (t !== toggle) t.checked = e.target.checked;
                });
                
                showToast(`Light turned ${newState === 1 ? 'ON' : 'OFF'}`);
            });
        }
    });
    
    // Setup all pump toggles
    const pumpToggles = document.querySelectorAll('#pumpToggle, #pumpToggleMain');
    pumpToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', async (e) => {
                const newState = e.target.checked ? 1 : 0;
                await update(ref(database, '/'), { pump: newState });
                
                // Update all other toggles
                pumpToggles.forEach(t => {
                    if (t !== toggle) t.checked = e.target.checked;
                });
                
                showToast(`Pump turned ${newState === 1 ? 'ON' : 'OFF'}`);
            });
        }
    });
}

// Show toast notification
function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 z-50';
        toast.style.transform = 'translateY(200px)';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.transform = 'translateY(200px)';
    }, 3000);
}

// Initialize controls
setupControls();
