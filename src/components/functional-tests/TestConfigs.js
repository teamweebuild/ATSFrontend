// Test configurations for different functional test rules
export const testConfigs = {
  rule189_37: {
    name: 'Rule 189.37 - Acceleration Test',
    description: 'Measure vehicle acceleration performance',
    maxValue: 10,
    acceptableRange: [2, 8],
    unit: 'seconds',
    duration: 12, // seconds for acceleration test
    type: 'acceleration'
  },
  rule189_4: {
    name: 'Rule 189.4 - Speedometer Test',
    description: 'Measure speedometer accuracy performance',
    maxValue: 7,
    acceptableRange: [-3, 3],
    unit: 'km/h',
    duration: null, // Manual stop only
    type: 'speedometer'
  }
};

// Helper function to parse serial data string
export const parseSerialData = (dataString) => {
  const data = {};
  const pairs = dataString.split(',');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value !== undefined) {
      data[key.trim()] = value.trim();
    }
  });
  
  return data;
};
