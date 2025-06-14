import { ConversionResult, CSSRule } from '../types';
import { tailwindMap } from '../tailwindMap';

export function convertCSSToTailwind(rules: CSSRule[]): ConversionResult[] {
  return rules.map(rule => {
    const tailwindClasses: string[] = [];
    const unconvertible: Array<{ property: string; value: string; reason: string }> = [];

    rule.declarations.forEach(({ property, value }) => {
      const mapping = tailwindMap[property];
      
      if (mapping) {
        let tailwindClass: string | null = null;
        
        // Check if mapping is a function
        if (typeof mapping === 'function') {
          tailwindClass = mapping(value);
        } else {
          // Check if mapping is an object with direct value lookup
          tailwindClass = mapping[value] || null;
        }
        
        if (tailwindClass) {
          tailwindClasses.push(tailwindClass);
        } else {
          unconvertible.push({
            property,
            value,
            reason: 'Value not supported in standard Tailwind classes'
          });
        }
      } else {
        unconvertible.push({
          property,
          value,
          reason: 'Property not supported in this converter'
        });
      }
    });

    return {
      selector: rule.selector,
      tailwindClasses: [...new Set(tailwindClasses)], // Remove duplicates
      unconvertible
    };
  });
}