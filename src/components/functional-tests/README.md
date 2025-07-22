# Functional Tests Components

This directory contains modular components for the functional test system. The structure is designed to be easily maintainable and extensible as new tests are added.

## Structure

### Core Files
- `TestConfigs.js` - Configuration for all test types (rules, parameters, etc.)
- `TestHandlers.js` - Business logic for data processing and test completion
- `index.js` - Central export file for clean imports

### UI Components
- `TestStatusDisplay.jsx` - Shows current test status and readings
- `SerialDataStatus.jsx` - Displays serial connection status
- `TestProgress.jsx` - Progress bar and duration display
- `TestResults.jsx` - Final test results display
- `LiveSerialData.jsx` - Real-time serial data visualization
- `TestActionButtons.jsx` - Start, Stop, Retry, Submit buttons

## Adding New Tests

### 1. Add Test Configuration
In `TestConfigs.js`, add a new entry:
```javascript
export const testConfigs = {
  // existing tests...
  rule189_X: {
    name: 'Rule 189.X - New Test Name',
    description: 'Test description',
    maxValue: 100,
    acceptableRange: [min, max],
    unit: 'units',
    duration: 30, // seconds, or null for manual
    type: 'test_type'
  }
};
```

### 2. Update Serial Data Handler
In `TestHandlers.js`, modify `createSerialDataHandler` to handle your test's data format:
```javascript
if (selectedRule === 'rule189_X') {
  // Parse your specific data format
  const testValue = parseFloat(parsedData.YourField || 0);
  setLiveReading(testValue);
  setLastValidReading(testValue);
}
```

### 3. Update UI Components (if needed)
- Customize live data display in `LiveSerialData.jsx`
- Add result-specific info in `TestResults.jsx`

### 4. Update Status Display (if needed)
Modify `TestStatusDisplay.jsx` to show test-specific metrics.

## Best Practices

1. **Keep Components Small**: Each component should have a single responsibility
2. **Use Configuration**: Add test parameters to `TestConfigs.js` rather than hardcoding
3. **Reuse Logic**: Put shared business logic in `TestHandlers.js`
4. **Test-Specific Code**: Use the `selectedRule` prop to customize behavior per test
5. **Clean Imports**: Use the index file for importing multiple components

## Example Usage

```javascript
import { 
  TestStatusDisplay, 
  testConfigs, 
  createSerialDataHandler 
} from './functional-tests';
```

This modular approach makes it easy to:
- Add new test types without touching existing code
- Maintain and debug individual components
- Reuse components across different test configurations
- Keep the main form component clean and readable
