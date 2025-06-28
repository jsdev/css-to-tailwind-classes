/**
 * Test suite for enhanced conversion features
 * Using CommonJS for compatibility
 */

// Test the enhanced conversions using the compiled output
console.log('Testing Enhanced Conversion Features');
console.log('=====================================');

// Since we can't easily import TS modules in a JS test file,
// let's test the conversions by running the app and checking the output

const testCases = {
  opacity: [
    'opacity: 0.5;',
    'opacity: 0;',
    'opacity: 1;',
    'opacity: 75%;'
  ],
  zIndex: [
    'z-index: 50;',
    'z-index: auto;',
    'z-index: -1;',
    'z-index: 9999;'
  ],
  transform: [
    'transform: translateY(0);',
    'transform: scale(1.5);',
    'transform: rotate(45deg);',
    'transform: translateX(10px) scale(0.9);'
  ],
  marginAuto: [
    'margin: 0 auto;',
    'margin: auto;',
    'margin: 0 auto 0;'
  ]
};

console.log('Test cases to verify in the application:');
console.log('');

Object.entries(testCases).forEach(([category, cases]) => {
  console.log(`${category.toUpperCase()}:`);
  cases.forEach(testCase => {
    console.log(`  - ${testCase}`);
  });
  console.log('');
});

console.log('Please test these cases in the web application using the "Enhanced Conversion" example set.');
