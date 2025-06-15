// Test file to verify settings and repeater functionality
import { parseCSS } from '../src/utils/cssParser';
import { convertCSSToTailwind } from '../src/utils/tailwindConverter';
import { 
  updateSettings, 
  resetSettings,
  getSettings,
  isSizeOptimizationEnabled,
  isRepeaterOptimizationEnabled 
} from '../src/utils/settings';

// Test CSS with repeated grid values
const testCSS = `
.grid-container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 100px 100px;
  gap: 16px;
  width: 100%;
  height: 100%;
}

.size-test {
  width: 100%;
  height: 100%;
}

.repeat-test {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
`;

function runTests() {
  console.log('🧪 Testing Settings and Repeater Functionality\n');

  // Reset to defaults
  resetSettings();
  console.log('Initial settings:', getSettings());

  // Parse the test CSS
  const rules = parseCSS(testCSS);
  console.log('Parsed rules:', rules.length);

  // Test with default settings (both optimizations enabled)
  console.log('\n📊 Testing with default settings (optimizations enabled):');
  let results = convertCSSToTailwind(rules);
  results.forEach(result => {
    console.log(`${result.selector}:`, result.tailwindClasses.join(' '));
  });

  // Test with size optimization disabled
  console.log('\n📊 Testing with size optimization disabled:');
  updateSettings({ enableSizeOptimization: false });
  console.log('Size optimization enabled:', isSizeOptimizationEnabled());
  results = convertCSSToTailwind(rules);
  results.forEach(result => {
    console.log(`${result.selector}:`, result.tailwindClasses.join(' '));
  });

  // Test with repeater optimization disabled
  console.log('\n📊 Testing with repeater optimization disabled:');
  updateSettings({ enableSizeOptimization: true, enableRepeaterOptimization: false });
  console.log('Repeater optimization enabled:', isRepeaterOptimizationEnabled());
  results = convertCSSToTailwind(rules);
  results.forEach(result => {
    console.log(`${result.selector}:`, result.tailwindClasses.join(' '));
  });

  // Test with both optimizations disabled
  console.log('\n📊 Testing with both optimizations disabled:');
  updateSettings({ enableSizeOptimization: false, enableRepeaterOptimization: false });
  results = convertCSSToTailwind(rules);
  results.forEach(result => {
    console.log(`${result.selector}:`, result.tailwindClasses.join(' '));
  });

  // Reset to defaults
  resetSettings();
  console.log('\n✅ Tests completed. Settings reset to defaults.');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runConverterTests = runTests;
}

export { runTests };
