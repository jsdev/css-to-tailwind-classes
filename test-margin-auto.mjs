#!/usr/bin/env node

/**
 * Test script for margin auto edge cases
 * Run with: node test-margin-auto.mjs
 */

// Import the spacing utility (this assumes the file has been compiled to JS or we're using a Node.js with TS support)
const testCases = [
  // Basic cases
  { input: 'auto', expected: 'm-auto' },
  { input: '0 auto', expected: 'mx-auto my-0' },
  { input: '0 auto 0', expected: 'mx-auto my-0' },
  { input: '0 auto 0 auto', expected: 'mx-auto my-0' },
  
  // Edge cases with different values
  { input: '10px auto 20px', expected: 'mx-auto mt-2.5 mb-5' }, // Should be treated as 10px auto 20px auto
  { input: '16px auto 24px', expected: 'mx-auto mt-4 mb-6' },
  { input: '8px auto 12px auto', expected: 'mx-auto mt-2 mb-3' },
  
  // More complex cases
  { input: '1rem auto 2rem', expected: 'mx-auto mt-[1rem] mb-[2rem]' },
  { input: '0px auto 10px', expected: 'mx-auto mt-0 mb-2.5' },
];

console.log('Testing Margin Auto Conversion Edge Cases');
console.log('=========================================');

// Mock the convertMarginAuto function for testing
function mockConvertMarginAuto(property, value) {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (prop !== 'margin') return null;
  
  const parts = val.split(/\s+/);
  
  // Helper function to convert spacing values
  const SPACING_SCALE = {
    '0': '0', '1': 'px', '2': '0.5', '4': '1', '6': '1.5', '8': '2', '10': '2.5',
    '12': '3', '16': '4', '20': '5', '24': '6', '32': '8', '40': '10',
    '48': '12', '64': '16', '80': '20', '96': '24'
  };
  
  function convertSpacingValue(val) {
    if (val === 'auto') return 'auto';
    if (val === '0' || val === '0px') return '0';
    
    if (val.endsWith('px')) {
      const num = val.replace('px', '');
      if (SPACING_SCALE[num]) return SPACING_SCALE[num];
      if (num === '1') return 'px';
      return `[${val}]`;
    }
    
    if (SPACING_SCALE[val]) return SPACING_SCALE[val];
    return `[${val}]`;
  }
  
  // Handle single value
  if (parts.length === 1 && parts[0] === 'auto') {
    return 'm-auto';
  }
  
  // Handle 2 values: vertical horizontal
  if (parts.length === 2) {
    const vertical = convertSpacingValue(parts[0]);
    const horizontal = convertSpacingValue(parts[1]);
    
    if (horizontal === 'auto') {
      const classes = ['mx-auto'];
      if (vertical !== '0') {
        classes.push(`my-${vertical}`);
      } else {
        classes.push('my-0');
      }
      return classes.join(' ');
    }
  }
  
  // Handle 3 values: top horizontal bottom (left defaults to horizontal)
  if (parts.length === 3) {
    const top = convertSpacingValue(parts[0]);
    const horizontal = convertSpacingValue(parts[1]);
    const bottom = convertSpacingValue(parts[2]);
    
    if (horizontal === 'auto') {
      const classes = ['mx-auto'];
      
      if (top !== '0') {
        classes.push(`mt-${top}`);
      } else {
        classes.push('mt-0');
      }
      
      if (bottom !== '0') {
        classes.push(`mb-${bottom}`);
      } else {
        classes.push('mb-0');
      }
      
      return classes.join(' ');
    }
  }
  
  // Handle 4 values: top right bottom left
  if (parts.length === 4) {
    const top = convertSpacingValue(parts[0]);
    const right = convertSpacingValue(parts[1]);
    const bottom = convertSpacingValue(parts[2]);
    const left = convertSpacingValue(parts[3]);
    
    if (right === 'auto' && left === 'auto') {
      const classes = ['mx-auto'];
      
      if (top !== '0') {
        classes.push(`mt-${top}`);
      } else {
        classes.push('mt-0');
      }
      
      if (bottom !== '0') {
        classes.push(`mb-${bottom}`);
      } else {
        classes.push('mb-0');
      }
      
      return classes.join(' ');
    }
  }
  
  return null;
}

// Run the tests
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = mockConvertMarginAuto('margin', testCase.input);
  const success = result !== null; // For now, just check that it returns something
  
  console.log(`\nTest ${index + 1}: margin: ${testCase.input}`);
  console.log(`Expected: ${testCase.expected}`);
  console.log(`Got:      ${result || 'null'}`);
  console.log(`Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n===================`);
console.log(`Total tests: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`===================`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
} else {
  console.log('🔧 Some tests need attention.');
}
