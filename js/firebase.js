/**
 * Firebase Configuration Module
 * Initializes Firebase services for Smart Agriculture System
 * Using Firebase SDK v9+ (Modular approach)
 */

// Import Firebase modules 1. khởi tạo kết nối 2. Lấy dữ liệu realtime 3. lấy dữ liệu ảnh
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, onValue, set, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'; /* đọc 

/**
 * Firebase configuration object
 * Contains all necessary credentials and settings
 */
const firebaseConfig = {
    apiKey: "AIzaSyAH10hJQcfzTIR_0R6Mjqx6Kj10VPC4wW8",
    authDomain: "hethonggiamsatnhakinh.firebaseapp.com",
    databaseURL: "https://hethonggiamsatnhakinh-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hethonggiamsatnhakinh",
    storageBucket: "hethonggiamsatnhakinh.firebasestorage.app",
    messagingSenderId: "131487040363",
    appId: "1:131487040363:web:ef515100d1bb1eefc1822e",
    measurementId: "G-EWFBQ32YQY"
};

/**
 * Initialize Firebase application
 */
const app = initializeApp(firebaseConfig);

/**
 * Get Firebase Realtime Database instance
 */
const database = getDatabase(app);

/**
 * Get Firebase Storage instance
 */
const storage = getStorage(app);

/**
 * Update connection status in UI
 */
function updateConnectionStatus(connected) {
    const statusDot = document.getElementById('connectionStatus');
    const statusText = document.getElementById('connectionText');
    const fbStatus = document.getElementById('fbStatus');
    
    if (connected) {
        statusDot.classList.remove('bg-yellow-400', 'bg-red-400');
        statusDot.classList.add('bg-green-400');
        statusDot.classList.remove('animate-pulse');
        statusText.textContent = 'Connected';
        if (fbStatus) fbStatus.textContent = 'Connected';
        console.log('✅ Firebase connected successfully');
    } else {
        statusDot.classList.remove('bg-green-400', 'bg-yellow-400');
        statusDot.classList.add('bg-red-400');
        statusDot.classList.add('animate-pulse');
        statusText.textContent = 'Disconnected';
        if (fbStatus) fbStatus.textContent = 'Disconnected';
        console.log('❌ Firebase disconnected');
    }
}

/**
 * Initialize connection status monitoring
 */
function initConnectionMonitoring() {
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
        const connected = snapshot.val() === true;
        updateConnectionStatus(connected);
    });
}

// Initialize connection monitoring on load
initConnectionMonitoring();

/**
 * Export Firebase services and functions
 */
export {
    app,
    database,
    storage,
    ref,
    onValue,
    set,
    update,
    storageRef,
    uploadBytes,
    getDownloadURL,
    updateConnectionStatus
};

console.log('🌱 Firebase module initialized');
