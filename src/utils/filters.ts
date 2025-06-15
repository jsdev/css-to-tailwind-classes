// Helper to sanitize arbitrary values for Tailwind class names.
// Replaces spaces with underscores and handles other problematic characters for CSS class names.
const sanitizeArbitraryValue = (value: string): string => {
  return value
    .trim()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^\w\d_-]/g, ''); // Remove characters not suitable for class names (conservative)
};

// Specific named blur values
const blurValueMap: Record<string, string> = {
  'var(--blur-xs)': 'blur-xs',
  'var(--blur-sm)': 'blur-sm',
  'var(--blur-md)': 'blur-md',
  'var(--blur-lg)': 'blur-lg',
  'var(--blur-xl)': 'blur-xl',
  'var(--blur-2xl)': 'blur-2xl',
  'var(--blur-3xl)': 'blur-3xl',
};

// Specific named drop-shadow values
const dropShadowValueMap: Record<string, string> = {
  'var(--drop-shadow-xs)': 'drop-shadow-xs',
  'var(--drop-shadow-sm)': 'drop-shadow-sm',
  'var(--drop-shadow-md)': 'drop-shadow-md',
  'var(--drop-shadow-lg)': 'drop-shadow-lg',
  'var(--drop-shadow-xl)': 'drop-shadow-xl',
  'var(--drop-shadow-2xl)': 'drop-shadow-2xl',
  '0 0 #0000': 'drop-shadow-none',
};

/**
 * Processes a CSS `filter` or `backdrop-filter` declaration and returns corresponding Tailwind classes.
 * @param cssProperty The CSS property name ('filter' or 'backdrop-filter').
 * @param cssValue The CSS property value.
 * @returns An array of Tailwind classes.
 */
export function processFilterOrBackdropFilter(
  cssProperty: 'filter' | 'backdrop-filter',
  cssValue: string
): string[] {
  const basePrefix = cssProperty === 'backdrop-filter' ? 'backdrop-' : '';
  const fullPropertyPrefix = cssProperty === 'backdrop-filter' ? 'backdrop-filter' : 'filter';

  const trimmedValue = cssValue.trim();

  if (trimmedValue === 'none') {
    return [`${fullPropertyPrefix}-none`];
  }

  // For 'filter:', maps to 'blur-none'. For 'backdrop-filter:', maps to 'backdrop-blur-none'.
  if (trimmedValue === '') {
    return [`${basePrefix}blur-none`];
  }

  const results: string[] = [];
  const filterFunctions: { name: string; value: string }[] = [];
  const functionMatcher = /\b([\w-]+)\(([^)]*)\)/g;
  let match;
  let lastIndex = 0;
  let hasFunctions = false;

  while ((match = functionMatcher.exec(trimmedValue)) !== null) {
    hasFunctions = true;
    if (match.index > lastIndex && trimmedValue.substring(lastIndex, match.index).trim() !== '') {
      hasFunctions = false;
      filterFunctions.length = 0;
      break;
    }
    filterFunctions.push({
      name: match[1].toLowerCase(),
      value: match[2].trim(),
    });
    lastIndex = functionMatcher.lastIndex;
  }

  if (hasFunctions && lastIndex < trimmedValue.length && trimmedValue.substring(lastIndex).trim() !== '') {
    hasFunctions = false;
    filterFunctions.length = 0;
  }

  if (hasFunctions && filterFunctions.length > 0) {
    for (const func of filterFunctions) {
      const { name, value } = func;
      let tailwindClass = '';
      const varNameMatch = value.match(/^var\(\s*(--[\w-]+|[\w-]+)\s*\)$/);
      const varName = varNameMatch ? varNameMatch[1].trim() : null;

      switch (name) {
        case 'blur':
          if (blurValueMap[value]) {
            tailwindClass = cssProperty === 'backdrop-filter' ? `backdrop-${blurValueMap[value]}` : blurValueMap[value];
          } else if (varName) {
            tailwindClass = `${basePrefix}blur-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}blur-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'brightness':
          if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) {
              tailwindClass = `${basePrefix}brightness-${numStr}`;
            } else {
               // For unitless numbers like 0.75, Tailwind expects them as is in arbitrary values
              tailwindClass = `${basePrefix}brightness-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}brightness-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}brightness-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'contrast':
          if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
             if (value.endsWith('%')) {
                tailwindClass = `${basePrefix}contrast-${numStr}`;
            } else {
                tailwindClass = `${basePrefix}contrast-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}contrast-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}contrast-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'grayscale':
          if (value === '100%' || value === '1') {
            tailwindClass = `${basePrefix}grayscale`;
          } else if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) { // e.g. grayscale-50 for 50%
                tailwindClass = `${basePrefix}grayscale-${numStr}`;
            } else { // e.g. grayscale-[0.5]
                tailwindClass = `${basePrefix}grayscale-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}grayscale-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}grayscale-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'hue-rotate':
          const calcMatch = value.match(/^calc\(\s*(-?[\d.]+)\s*deg\s*\*\s*-1\s*\)$/);
          const degMatch = value.match(/^(-?[\d.]+)\s*deg$/);
          if (calcMatch) {
            const num = parseFloat(calcMatch[1]);
            const finalRotation = -num;
            tailwindClass = `${finalRotation < 0 ? '-' : ''}${basePrefix}hue-rotate-${Math.abs(finalRotation)}`;
          } else if (degMatch) {
            const num = parseFloat(degMatch[1]);
            tailwindClass = `${num < 0 ? '-' : ''}${basePrefix}hue-rotate-${Math.abs(num)}`;
          } else if (varName) {
            tailwindClass = `${basePrefix}hue-rotate-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}hue-rotate-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'invert':
          if (value === '100%' || value === '1') {
            tailwindClass = `${basePrefix}invert`;
          } else if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
             const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) { // e.g. invert-75 for 75%
                tailwindClass = `${basePrefix}invert-${numStr}`;
            } else { // e.g. invert-[0.25]
                tailwindClass = `${basePrefix}invert-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}invert-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}invert-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'opacity':
          if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) { // e.g. opacity-50 for 50%
                tailwindClass = `${basePrefix}opacity-${numStr}`;
            } else { // For values like 0.5, map to percentage or use arbitrary
                const numericValue = parseFloat(numStr);
                if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1) {
                    tailwindClass = `${basePrefix}opacity-${Math.round(numericValue * 100)}`;
                } else { // For values like 50 (interpreted as 50%)
                    tailwindClass = `${basePrefix}opacity-${numStr}`;
                }
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}opacity-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}opacity-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'saturate':
          if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) { // e.g. saturate-150 for 150%
                tailwindClass = `${basePrefix}saturate-${numStr}`;
            } else { // e.g. saturate-[1.5] or saturate-[150]
                tailwindClass = `${basePrefix}saturate-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}saturate-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}saturate-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'sepia':
          if (value === '100%' || value === '1') {
            tailwindClass = `${basePrefix}sepia`;
          } else if (value.match(/^\d+(\.\d+)?\s*%?$/)) {
            const numStr = value.replace(/\s*%$/, '');
            if (value.endsWith('%')) { // e.g. sepia-75 for 75%
                tailwindClass = `${basePrefix}sepia-${numStr}`;
            } else { // e.g. sepia-[0.25]
                tailwindClass = `${basePrefix}sepia-[${sanitizeArbitraryValue(value)}]`;
            }
          } else if (varName) {
            tailwindClass = `${basePrefix}sepia-(${varName})`;
          } else {
            tailwindClass = `${basePrefix}sepia-[${sanitizeArbitraryValue(value)}]`;
          }
          break;
        case 'drop-shadow':
          if (cssProperty === 'filter') { // drop-shadow is not for backdrop-filter
            if (dropShadowValueMap[value]) {
              tailwindClass = dropShadowValueMap[value];
            } else if (varName) {
              tailwindClass = `drop-shadow-(${varName})`;
            } else {
              // Tailwind's drop-shadow arbitrary values are complex, often better to use named vars or simpler values.
              // For direct CSS drop-shadow values, they might need to be wrapped carefully.
              // Example: drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]
              tailwindClass = `drop-shadow-[${sanitizeArbitraryValue(value).replace(/\s+/g, '_')}]`;
            }
          }
          break;
      }
      if (tailwindClass) {
        results.push(tailwindClass);
      }
    }
  }

  if (results.length === 0) {
    const varMatchGlobal = trimmedValue.match(/^var\(\s*(--[\w-]+|[\w-]+)\s*\)$/);
    if (varMatchGlobal) {
      const varNameGlobal = varMatchGlobal[1].trim();
      results.push(`${fullPropertyPrefix}-(${varNameGlobal})`);
    } else {
      results.push(`${fullPropertyPrefix}-[${sanitizeArbitraryValue(trimmedValue).replace(/\s+/g, '_')}]`);
    }
  }

  return results.filter(Boolean);
}
