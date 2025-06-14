import {
    TRANSITION_PROPERTY_MAP,
    EASING_FUNCTION_MAP,
    DURATION_AND_DELAY_MAP,
  } from './constants'
  
  // The main pattern matcher for all transition properties
  export const transitionPatternMatcher = {
    test: (property: string, value: string) => {
      return property.toLowerCase().trim().startsWith('transition');
    },
    convert: (property: string, value: string): string | null => {
      const prop = property.toLowerCase().trim();
      const val = value.trim();
  
      // 1. Handle long-hand properties first
      switch (prop) {
        case 'transition-property':
          return val.split(',').map(p => TRANSITION_PROPERTY_MAP[p.trim()] || null).filter(Boolean).join(' ');
        
        case 'transition-duration':
          return convertToTailwindClass(val, 'duration');
          
        case 'transition-timing-function':
          return convertToTailwindClass(val, 'ease');
  
        case 'transition-delay':
          return convertToTailwindClass(val, 'delay');
      }
  
      // 2. Handle the 'transition' shorthand property
      if (prop === 'transition') {
        // Split by commas for multiple transitions
        const transitions = val.split(',');
        const all_classes = new Set<string>();
  
        transitions.forEach(transitionStr => {
          const parts = transitionStr.trim().split(/\s+/);
          let hasFoundDuration = false;
  
          parts.forEach(part => {
            // Try to identify what each part is
            let convertedClass: string | null = null;
            
            // Is it a known property?
            if (TRANSITION_PROPERTY_MAP[part]) {
              convertedClass = TRANSITION_PROPERTY_MAP[part];
            }
            // Is it an easing function?
            else if (EASING_FUNCTION_MAP[part]) {
              convertedClass = EASING_FUNCTION_MAP[part];
            }
            // Is it a cubic-bezier function?
            else if (part.startsWith('cubic-bezier')) {
              convertedClass = convertToTailwindClass(part, 'ease');
            }
            // Is it a time value (duration or delay)?
            else if (part.match(/(\d*\.?\d+)(ms|s)/)) {
              if (!hasFoundDuration) {
                convertedClass = convertToTailwindClass(part, 'duration');
                hasFoundDuration = true;
              } else {
                convertedClass = convertToTailwindClass(part, 'delay');
              }
            }
  
            if (convertedClass) {
              all_classes.add(convertedClass);
            }
          });
        });
        
        // If no specific property was found (e.g., transition: .3s), default to `transition-all`
        if (!Array.from(all_classes).some(c => c.startsWith('transition-'))) {
          all_classes.add('transition-all');
        }
  
        return Array.from(all_classes).join(' ');
      }
  
      return null;
    },
  };
  
  /**
   * Helper function to convert a CSS value to a Tailwind class for duration, delay, or easing.
   * @param value The CSS value string (e.g., "0.3s", "ease-in", "cubic-bezier(...)").
   * @param type The type of class to generate ("duration", "delay", or "ease").
   * @returns The corresponding Tailwind class or null.
   */
  function convertToTailwindClass(value: string, type: 'duration' | 'delay' | 'ease'): string | null {
      const val = value.trim();
  
      if (type === 'ease') {
          if (EASING_FUNCTION_MAP[val]) {
              return EASING_FUNCTION_MAP[val];
          }
          if (val.startsWith('cubic-bezier')) {
              // For arbitrary values, Tailwind requires spaces to be replaced with underscores
              const sanitizedValue = val.replace(/\s/g, '_');
              return `ease-[${sanitizedValue}]`;
          }
          return null;
      }
  
      // Handle duration and delay
      const timeMatch = val.match(/(\d*\.?\d+)(ms|s)/);
      if (!timeMatch) return null;
  
      let ms = parseFloat(timeMatch[1]);
      if (timeMatch[2] === 's') {
          ms *= 1000;
      }
      const msStr = ms.toString();
      
      // Check if it's a default Tailwind value
      if (DURATION_AND_DELAY_MAP[msStr]) {
          return `${type}-${DURATION_AND_DELAY_MAP[msStr]}`;
      }
      
      // Otherwise, create an arbitrary value
      return `${type}-[${ms}ms]`;
  }
  