// Serial Data Simulator for Functional Test
// This file simulates real serial port data for testing purposes

console.log("🔧 Serial Data Simulator Started");

// Initialize the global serial data handler
window.onSerialData = function(data) {
    console.log("📡 Called window.onSerialData with:", data);
};

// Function to generate random functional test data
function generateFunctionalTestData() {
    const data = {
        test_type: "acceleration",
        
        // Acceleration-related measurements
        acceleration_time: (2 + Math.random() * 6).toFixed(2), // 2-8 seconds (main value for acceleration test)
        speed_initial: "0.00",
        speed_final: "60.00",
        
        // Vehicle dynamics data
        axle_play_horizontal: (Math.random() * 0.5).toFixed(2), // 0-0.5mm
        axle_play_vertical: (Math.random() * 0.3).toFixed(2), // 0-0.3mm
        joint_play_per_wheel: (Math.random() * 0.8).toFixed(2), // 0-0.8mm
        
        // Suspension measurements
        suspension_deflection_front_left: (Math.random() * 2.5).toFixed(2), // 0-2.5mm
        suspension_deflection_front_right: (Math.random() * 2.5).toFixed(2), // 0-2.5mm
        suspension_deflection_rear_left: (Math.random() * 2.0).toFixed(2), // 0-2.0mm
        suspension_deflection_rear_right: (Math.random() * 2.0).toFixed(2), // 0-2.0mm
        
        // Alignment and stability
        wheel_lift_amount: (Math.random() * 1.0).toFixed(2), // 0-1.0mm
        axle_misalignment: (Math.random() * 0.1).toFixed(2), // 0-0.1 degrees
        side_slip: (Math.random() * 3.0).toFixed(2), // 0-3.0mm/m
        
        // Dynamic measurements
        vibration_level: (Math.random() * 5.0).toFixed(2), // 0-5.0 Hz
        noise_level: (60 + Math.random() * 20).toFixed(2), // 60-80 dB
        
        // Component wear indicators
        bushing_wear_front_left: (Math.random() * 0.2).toFixed(2), // 0-0.2mm
        bushing_wear_front_right: (Math.random() * 0.2).toFixed(2), // 0-0.2mm
        shock_absorber_damping_force: (80 + Math.random() * 40).toFixed(2), // 80-120 N
        
        // Test environment
        temperature: (20 + Math.random() * 10).toFixed(1), // 20-30°C
        humidity: (40 + Math.random() * 20).toFixed(1), // 40-60%
        
        // Test status
        test_progress: Math.min(100, (Date.now() % 100000) / 1000).toFixed(0), // 0-100%
        test_phase: getTestPhase(),
        
        // Timestamp
        timestamp: new Date().toISOString()
    };

    return formatSerialData(data);
}

// Get current test phase based on time
function getTestPhase() {
    const phases = ["initializing", "positioning", "calibrating", "testing", "measuring", "completing"];
    const currentTime = Math.floor(Date.now() / 2000) % phases.length; // Change phase every 2 seconds
    return phases[currentTime];
}

// Format data as serial string (key:value,key:value format)
function formatSerialData(data) {
    return Object.entries(data)
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
}

// Generate random variations for more realistic testing
function addRandomVariation() {
    // Add some random spikes or dips occasionally
    const variation = Math.random();
    if (variation < 0.05) { // 5% chance of anomaly
        return {
            acceleration_time: (10 + Math.random() * 5).toFixed(2), // Unusually high reading
            test_anomaly: "spike_detected"
        };
    } else if (variation < 0.1) { // 5% chance of low reading
        return {
            acceleration_time: (0.5 + Math.random() * 1).toFixed(2), // Unusually low reading
            test_anomaly: "low_reading"
        };
    }
    return {};
}

// Simulation control variables
let simulationRunning = false;
let simulationInterval = null;
let testStartTime = null;

// Start simulation function
function startSimulation() {
    if (simulationRunning) return;
    
    console.log("🚀 Starting serial data simulation...");
    simulationRunning = true;
    testStartTime = Date.now();
    
    simulationInterval = setInterval(() => {
        if (window.onSerialData && typeof window.onSerialData === 'function') {
            const baseData = generateFunctionalTestData();
            const variations = addRandomVariation();
            
            // Merge base data with variations
            const finalData = baseData + (Object.keys(variations).length > 0 ? 
                ',' + formatSerialData(variations) : '');
            
            // Call the serial data handler
            window.onSerialData(finalData);
            
            // Log every 5th update to avoid console spam
            const elapsedTime = Math.floor((Date.now() - testStartTime) / 1000);
            if (elapsedTime % 5 === 0) {
                console.log(`📊 [${elapsedTime}s] Serial data sent:`, finalData.substring(0, 100) + '...');
            }
        } else {
            console.log("⚠️ No serial data handler found (window.onSerialData)");
        }
    }, 1000); // Update every 1 second
}

// Stop simulation function
function stopSimulation() {
    if (!simulationRunning) return;
    
    console.log("🛑 Stopping serial data simulation...");
    simulationRunning = false;
    
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    // Send final data packet
    if (window.onSerialData && typeof window.onSerialData === 'function') {
        const finalData = formatSerialData({
            test_type: "acceleration",
            acceleration_time: (3 + Math.random() * 3).toFixed(2), // Final reading
            test_phase: "completed",
            test_status: "finished",
            timestamp: new Date().toISOString()
        });
        window.onSerialData(finalData);
        console.log("📋 Final data packet sent:", finalData);
    }
}

// Expose control functions globally for manual testing
window.startSerialSimulation = startSimulation;
window.stopSerialSimulation = stopSimulation;

// Auto-start simulation (for automatic testing)
window.addEventListener('load', function() {
    console.log("🌐 Page loaded - Serial simulator ready");
    console.log("💡 Use window.startSerialSimulation() to start simulation manually");
    console.log("💡 Use window.stopSerialSimulation() to stop simulation manually");
    
    // Auto-start after 2 seconds for testing
    setTimeout(() => {
        console.log("🔄 Auto-starting simulation for testing...");
        startSimulation();
    }, 2000);
});

// Stop simulation when page unloads
window.addEventListener('beforeunload', function() {
    stopSimulation();
});

console.log("✅ Serial Data Simulator Loaded Successfully");
console.log("📝 Available functions:");
console.log("   - window.startSerialSimulation()");
console.log("   - window.stopSerialSimulation()"); 
console.log("   - window.onSerialData (handler function)");
