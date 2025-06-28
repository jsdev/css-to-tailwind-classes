import { CSSRule } from '../types';
import { parsePseudoFromSelector, getBaseSelector } from './pseudoParser';

export function parseCSS(cssText: string): CSSRule[] {
  const rules: CSSRule[] = [];
  
  // Remove comments
  const cleanCSS = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match CSS rules
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;
  
  while ((match = ruleRegex.exec(cleanCSS)) !== null) {
    const selector = match[1].trim();
    const declarationBlock = match[2].trim();
    
    // Parse pseudo-classes and pseudo-elements from selector
    const pseudoInfo = parsePseudoFromSelector(selector);
    const baseSelector = getBaseSelector(selector);
    
    const declarations = declarationBlock
      .split(';')
      .map(decl => decl.trim())
      .filter(decl => decl.length > 0)
      .map(decl => {
        const [property, ...valueParts] = decl.split(':');
        return {
          property: property.trim(),
          value: valueParts.join(':').trim()
        };
      });
    
    rules.push({
      selector,
      baseSelector,
      pseudoInfo,
      declarations
    });
  }
  
  return rules;
}