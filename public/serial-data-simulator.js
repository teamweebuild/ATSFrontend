// Serial Data Simulator for Functional Test
// This file simulates real serial port data for testing purposes

console.log("🔧 Serial Data Simulator Started");

// Initialize the global serial data handler
window.onSerialData = function(data) {
    console.log("📡 Called window.onSerialData with:", data);
};

// Function to ge    console.log("   🚗 Speedometer Test:");erate acceleration test data
function generateAccelerationTestData() {
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

// Function to generate speedometer test data
function generateSpeedometerTestData() {
    const currentSpeed = (Math.random() * 80 + 20).toFixed(0); // 20-100 km/h
    const speedAccuracy = (Math.random() * 10 - 5).toFixed(0); // -5 to +5 km/h
    const speedometerReading = (parseInt(currentSpeed) + parseInt(speedAccuracy)).toFixed(0);
    
    const data = {
        test_type: "speedometer_hd",
        
        // Main speedometer measurements
        Current_Speed: `${currentSpeed} km/h`,
        Speedometer_Reading: `${speedometerReading} km/h`,
        Speed_Accuracy: `${speedAccuracy >= 0 ? '+' : ''}${speedAccuracy} km/h`, // Main value for speedometer test
        
        // Engine and drivetrain data
        RPM: `${(Math.random() * 2000 + 1000).toFixed(0)} rpm`,
        Distance_Traveled: `${(Math.random() * 50 + 10).toFixed(2)} km`,
        Elapsed_Time: `${(Math.random() * 500 + 200).toFixed(0)} seconds`,
        
        // Braking system data
        Brake_Force: `${(Math.random() * 1000 + 800).toFixed(0)} N`,
        Deceleration_Rate: `-${(Math.random() * 8 + 2).toFixed(1)} m/s²`,
        
        // Vehicle specifications
        Wheel_Circumference: `${(Math.random() * 0.5 + 1.8).toFixed(1)} m`,
        Pedal_Force: `${(Math.random() * 30 + 20).toFixed(0)} kgf`,
        
        // Additional measurements
        Gear_Position: Math.floor(Math.random() * 6) + 1, // 1-6th gear
        Throttle_Position: `${(Math.random() * 100).toFixed(1)}%`,
        Vehicle_Load: `${(Math.random() * 500 + 1000).toFixed(0)} kg`,
        
        // Test environment
        Temperature: `${(20 + Math.random() * 10).toFixed(1)}°C`,
        Humidity: `${(40 + Math.random() * 20).toFixed(1)}%`,
        
        // Test status
        Test_Phase: getSpeedometerTestPhase(),
        Test_Progress: `${Math.min(100, (Date.now() % 100000) / 1000).toFixed(0)}%`,
        
        // Timestamp
        Timestamp: new Date().toISOString()
    };

    return formatSerialData(data);
}

// Get current test phase based on time (for acceleration)
function getTestPhase() {
    const phases = ["initializing", "positioning", "calibrating", "testing", "measuring", "completing"];
    const currentTime = Math.floor(Date.now() / 2000) % phases.length; // Change phase every 2 seconds
    return phases[currentTime];
}

// Get current test phase for speedometer
function getSpeedometerTestPhase() {
    const phases = ["calibrating", "accelerating", "steady_speed", "measuring", "decelerating", "completing"];
    const currentTime = Math.floor(Date.now() / 3000) % phases.length; // Change phase every 3 seconds
    return phases[currentTime];
}

// Format data as serial string (key:value,key:value format)
function formatSerialData(data) {
    return Object.entries(data)
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
}

// Generate random variations for acceleration test
function addAccelerationVariation() {
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

// Generate random variations for speedometer test
function addSpeedometerVariation() {
    const variation = Math.random();
    if (variation < 0.05) { // 5% chance of high accuracy error
        return {
            Speed_Accuracy: `${(Math.random() * 10 + 5).toFixed(0)} km/h`, // High error
            Test_Anomaly: "high_error_detected"
        };
    } else if (variation < 0.1) { // 5% chance of perfect accuracy
        return {
            Speed_Accuracy: "+0 km/h", // Perfect accuracy
            Test_Anomaly: "perfect_reading"
        };
    }
    return {};
}

// Simulation control variables
let accelerationSimulationRunning = false;
let accelerationSimulationInterval = null;
let accelerationTestStartTime = null;

let speedometerSimulationRunning = false;
let speedometerSimulationInterval = null;
let speedometerTestStartTime = null;

// Start acceleration simulation function
function startAccelerationSimulation() {
    if (accelerationSimulationRunning) return;
    
    console.log("🚀 Starting acceleration test simulation...");
    accelerationSimulationRunning = true;
    accelerationTestStartTime = Date.now();
    
    accelerationSimulationInterval = setInterval(() => {
        if (window.onSerialData && typeof window.onSerialData === 'function') {
            const baseData = generateAccelerationTestData();
            const variations = addAccelerationVariation();
            
            // Merge base data with variations
            const finalData = baseData + (Object.keys(variations).length > 0 ? 
                ',' + formatSerialData(variations) : '');
            
            // Call the serial data handler
            window.onSerialData(finalData);
            
            // Log every 5th update to avoid console spam
            const elapsedTime = Math.floor((Date.now() - accelerationTestStartTime) / 1000);
            if (elapsedTime % 5 === 0) {
                console.log(`📊 [${elapsedTime}s] Acceleration data sent:`, finalData.substring(0, 100) + '...');
            }
        } else {
            console.log("⚠️ No serial data handler found (window.onSerialData)");
        }
    }, 1000); // Update every 1 second
}

// Start speedometer simulation function
function startSpeedometerSimulation() {
    if (speedometerSimulationRunning) return;
    
    console.log("🚗 Starting speedometer test simulation...");
    speedometerSimulationRunning = true;
    speedometerTestStartTime = Date.now();
    
    speedometerSimulationInterval = setInterval(() => {
        if (window.onSerialData && typeof window.onSerialData === 'function') {
            const baseData = generateSpeedometerTestData();
            const variations = addSpeedometerVariation();
            
            // Merge base data with variations
            const finalData = baseData + (Object.keys(variations).length > 0 ? 
                ',' + formatSerialData(variations) : '');
            
            // Call the serial data handler
            window.onSerialData(finalData);
            
            // Log every 3rd update to avoid console spam
            const elapsedTime = Math.floor((Date.now() - speedometerTestStartTime) / 1000);
            if (elapsedTime % 3 === 0) {
                console.log(`🚗 [${elapsedTime}s] Speedometer data sent:`, finalData.substring(0, 100) + '...');
            }
        } else {
            console.log("⚠️ No serial data handler found (window.onSerialData)");
        }
    }, 1000); // Update every 1 second
}

// Stop acceleration simulation function
function stopAccelerationSimulation() {
    if (!accelerationSimulationRunning) return;
    
    console.log("🛑 Stopping acceleration test simulation...");
    accelerationSimulationRunning = false;
    
    if (accelerationSimulationInterval) {
        clearInterval(accelerationSimulationInterval);
        accelerationSimulationInterval = null;
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
        console.log("📋 Final acceleration data packet sent:", finalData);
    }
}

// Stop speedometer simulation function
function stopSpeedometerSimulation() {
    if (!speedometerSimulationRunning) return;
    
    console.log("🛑 Stopping speedometer test simulation...");
    speedometerSimulationRunning = false;
    
    if (speedometerSimulationInterval) {
        clearInterval(speedometerSimulationInterval);
        speedometerSimulationInterval = null;
    }
    
    // Send final data packet
    if (window.onSerialData && typeof window.onSerialData === 'function') {
        const finalData = formatSerialData({
            test_type: "speedometer_hd",
            Current_Speed: "0 km/h",
            Speed_Accuracy: "+0 km/h", // Final perfect reading
            Test_Phase: "completed",
            Test_Status: "finished",
            Timestamp: new Date().toISOString()
        });
        window.onSerialData(finalData);
        console.log("📋 Final speedometer data packet sent:", finalData);
    }
}

// Send single test data functions
function sendSingleAccelerationData() {
    if (window.onSerialData && typeof window.onSerialData === 'function') {
        const data = generateAccelerationTestData();
        window.onSerialData(data);
        console.log("📤 Single acceleration data sent:", data);
    } else {
        console.log("⚠️ No serial data handler found (window.onSerialData)");
    }
}

function sendSingleSpeedometerData() {
    if (window.onSerialData && typeof window.onSerialData === 'function') {
        const data = generateSpeedometerTestData();
        window.onSerialData(data);
        console.log("📤 Single speedometer data sent:", data);
    } else {
        console.log("⚠️ No serial data handler found (window.onSerialData)");
    }
}

// Expose control functions globally for manual testing
window.startAccelerationSimulation = startAccelerationSimulation;
window.stopAccelerationSimulation = stopAccelerationSimulation;
window.sendSingleAccelerationData = sendSingleAccelerationData;

window.startSpeedometerSimulation = startSpeedometerSimulation;
window.stopSpeedometerSimulation = stopSpeedometerSimulation;
window.sendSingleSpeedometerData = sendSingleSpeedometerData;

// Legacy function names for backward compatibility
window.startSerialSimulation = startAccelerationSimulation;
window.stopSerialSimulation = stopAccelerationSimulation;

// Auto-start simulation (for automatic testing)
window.addEventListener('load', function() {
    console.log("🌐 Page loaded - Serial simulator ready");
    console.log("💡 Available simulation functions:");
    console.log("   🚀 Acceleration Test:");
    console.log("      - window.startAccelerationSimulation()");
    console.log("      - window.stopAccelerationSimulation()");
    console.log("      - window.sendSingleAccelerationData()");
    console.log("   � Speedometer Test:");
    console.log("      - window.startSpeedometerSimulation()");
    console.log("      - window.stopSpeedometerSimulation()");
    console.log("      - window.sendSingleSpeedometerData()");
    
    // Auto-start disabled - use manual start only
    // setTimeout(() => {
    //     console.log("🔄 Auto-starting simulation for testing...");
    //     startAccelerationSimulation();
    // }, 2000);
});

// Stop all simulations when page unloads
window.addEventListener('beforeunload', function() {
    stopAccelerationSimulation();
    stopSpeedometerSimulation();
});

console.log("✅ Serial Data Simulator Loaded Successfully");
console.log("📝 Available functions:");
console.log("   🚀 Acceleration: startAccelerationSimulation() | stopAccelerationSimulation() | sendSingleAccelerationData()");
console.log("   🚗 Speedometer: startSpeedometerSimulation() | stopSpeedometerSimulation() | sendSingleSpeedometerData()");
console.log("   📡 Handler: window.onSerialData (set by your app)");
