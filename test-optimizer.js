// Simple test for custom variable optimizer
const { optimizeCustomVariable, isCustomVariableOptimizable } = require('./src/utils/customVariableOptimizer.ts');

// Test cases
const testCases = [
  { property: 'padding', class: 'p-[var(--spacing)]', expected: 'p-(spacing)' },
  { property: 'padding-top', class: 'pt-[var(--spacing)]', expected: 'pt-(spacing)' },
  { property: 'outline', class: 'outline-[var(--border-width)]', expected: 'outline-(border-width)' },
  { property: 'outline-offset', class: 'outline-offset-[var(--offset)]', expected: 'outline-offset-(offset)' },
  { property: 'perspective', class: 'perspective-[var(--depth)]', expected: 'perspective-(depth)' },
  { property: 'rotate', class: 'rotate-[var(--angle)]', expected: 'rotate-(angle)' },
  { property: 'unknown-property', class: 'unknown-[var(--test)]', expected: 'unknown-[var(--test)]' }, // Should not be optimized
];

console.log('Testing custom variable optimizer...');
testCases.forEach(({ property, class: inputClass, expected }) => {
  const result = optimizeCustomVariable(property, inputClass);
  const supported = isCustomVariableOptimizable(property);
  const passed = result === expected;
  console.log(`${passed ? '✓' : '✗'} ${property} (${supported ? 'supported' : 'not supported'}): ${inputClass} -> ${result} (expected: ${expected})`);
});
