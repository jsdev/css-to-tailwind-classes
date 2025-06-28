/**
 * Enhanced conversion tests
 * Test the new opacity, z-index, transform, and margin auto conversions
 */

import { convertOpacity } from './src/utils/opacity.js';
import { convertZIndex } from './src/utils/zIndex.js';
import { convertTransform } from './src/utils/transform.js';
import { convertMarginAuto } from './src/utils/spacing.js';

function runTests() {
  console.log('🧪 Enhanced Conversion Tests');
  console.log('============================\n');

  let passed = 0;
  let total = 0;

  function test(description, expected, actual) {
    total++;
    if (actual === expected) {
      console.log(`✅ ${description}`);
      passed++;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   Expected: "${expected}"`);
      console.log(`   Actual:   "${actual}"`);
    }
  }

  // Opacity tests
  console.log('Opacity Tests:');
  test('opacity: 0.5 → opacity-50', 'opacity-50', convertOpacity('opacity', '0.5'));
  test('opacity: 0 → opacity-0', 'opacity-0', convertOpacity('opacity', '0'));
  test('opacity: 1 → opacity-100', 'opacity-100', convertOpacity('opacity', '1'));
  test('opacity: 75% → opacity-75', 'opacity-75', convertOpacity('opacity', '75%'));
  console.log('');

  // Z-index tests
  console.log('Z-Index Tests:');
  test('z-index: 50 → z-50', 'z-50', convertZIndex('z-index', '50'));
  test('z-index: auto → z-auto', 'z-auto', convertZIndex('z-index', 'auto'));
  test('z-index: -1 → z-[-1]', 'z-[-1]', convertZIndex('z-index', '-1'));
  test('z-index: 9999 → z-[9999]', 'z-[9999]', convertZIndex('z-index', '9999'));
  console.log('');

  // Transform tests
  console.log('Transform Tests:');
  test('transform: translateY(0) → translate-y-0', 'translate-y-0', convertTransform('transform', 'translateY(0)'));
  test('transform: scale(1.5) → scale-150', 'scale-150', convertTransform('transform', 'scale(1.5)'));
  test('transform: rotate(45deg) → rotate-45', 'rotate-45', convertTransform('transform', 'rotate(45deg)'));
  console.log('');

  // Margin auto tests
  console.log('Margin Auto Tests:');
  test('margin: 0 auto → mx-auto my-0', 'mx-auto my-0', convertMarginAuto('margin', '0 auto'));
  test('margin: auto → m-auto', 'm-auto', convertMarginAuto('margin', 'auto'));
  test('margin: 0 auto 0 → mx-auto my-0', 'mx-auto my-0', convertMarginAuto('margin', '0 auto 0'));
  console.log('');

  console.log(`Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All enhanced conversion tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the implementation.');
  }
}

runTests();
