import { parseSerialData } from './TestConfigs';

// Handler for processing serial data based on test type
export const createSerialDataHandler = (
  selectedRule,
  setSerialData,
  setLiveReading,
  setLastValidReading,
  setMaxAccuracy,
  setAllAccuracyReadings
) => {
  return (data) => {
    console.log("Received serial data:", data);
    
    try {
      // Parse the serial data string
      const parsedData = parseSerialData(data);
      console.log("Parsed data:", parsedData);
      
      if (selectedRule === 'rule189_4') {
        // Speedometer test - only read data via window events from external sources
        // No serial data simulation involved for speedometer
        if (parsedData.test_type === 'speedometer_hd') {
          console.log("Processing speedometer data");
          setSerialData(parsedData);
          
          // Use Speed_Accuracy field for speedometer test
          const speedAccuracy = parseFloat(parsedData.Speed_Accuracy?.replace(/[^\d.-]/g, '') || 0);
          console.log("Extracted Speed_Accuracy:", speedAccuracy, "from:", parsedData.Speed_Accuracy);
          setLiveReading(speedAccuracy);
          setLastValidReading(speedAccuracy);
          
          // Track all accuracy readings and find maximum absolute value
          setAllAccuracyReadings(prev => {
            const newReadings = [...prev, speedAccuracy];
            const maxAbs = Math.max(...newReadings.map(Math.abs));
            setMaxAccuracy(maxAbs);
            console.log("Updated accuracy readings:", newReadings, "Max:", maxAbs);
            return newReadings;
          });
        } else {
          console.log("Ignoring non-speedometer data for speedometer test:", parsedData.test_type);
        }
      } else if (selectedRule === 'rule189_37') {
        // Acceleration test - uses serial data simulation from JS simulator
        if (parsedData.test_type === 'acceleration') {
          console.log("Processing acceleration data");
          setSerialData(parsedData);
          
          // Use acceleration_time or axle_play_horizontal as acceleration reading
          const accelerationReading = parseFloat(parsedData.acceleration_time || parsedData.axle_play_horizontal || 0);
          console.log("Extracted acceleration_time:", accelerationReading, "from:", parsedData.acceleration_time);
          
          setLiveReading(accelerationReading);
          setLastValidReading(accelerationReading);
        } else {
          console.log("Ignoring non-acceleration data for acceleration test:", parsedData.test_type);
        }
      }
    } catch (error) {
      console.error("Error parsing serial data:", error);
    }
  };
};

// Test completion logic
export const createTestCompletionHandler = (
  selectedRule,
  maxAccuracy,
  allAccuracyReadings,
  testDuration,
  serialData,
  currentTest
) => {
  return (finalValue) => {
    console.log("Completing test with final value:", finalValue);
    
    let testValue = finalValue;
    
    // For speedometer test, use the maximum accuracy reading
    if (selectedRule === 'rule189_4') {
      testValue = maxAccuracy;
      console.log(`Using max accuracy: ${maxAccuracy} from readings:`, allAccuracyReadings);
    }
    
    const passed = testValue >= currentTest.acceptableRange[0] && 
                   testValue <= currentTest.acceptableRange[1];
    
    const result = {
      value: testValue,
      passed: passed,
      duration: testDuration,
      serialData: serialData, // Include the last serial data received
      ...(selectedRule === 'rule189_4' && { 
        maxAccuracy: maxAccuracy,
        allReadings: allAccuracyReadings 
      })
    };
    
    return result;
  };
};
