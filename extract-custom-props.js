const fs = require('fs');

try {
  // Read the tailwindMap.ts file
  const content = fs.readFileSync('src/tailwindMap.ts', 'utf8');

  // Find all lines that contain custom properties
  const customPropertyLines = content.split('\n')
    .filter(line => line.includes('<custom-property>'))
    .map(line => line.trim());

  console.log('Found', customPropertyLines.length, 'lines with custom properties');

  // Extract CSS properties
  const cssProperties = new Set();

  customPropertyLines.forEach(line => {
    // Extract the CSS property name from the key part (before the colon)
    const match = line.match(/^"([^:]+):/);
    if (match) {
      const cssProperty = match[1].trim();
      cssProperties.add(cssProperty);
    }
  });

  // Sort and display the results
  const sortedProperties = Array.from(cssProperties).sort();

  console.log('CSS Properties that support (<custom-property>) syntax:');
  console.log('Total count:', sortedProperties.length);
  console.log('\nProperties:');
  sortedProperties.forEach(prop => console.log(`'${prop}',`));
} catch (error) {
  console.error('Error:', error.message);
}
