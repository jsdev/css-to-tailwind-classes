// grid.ts
// Utility matchers for grid-related CSS to Tailwind conversion
import { GRID_PATTERNS, GRID_ROWS_PATTERNS } from './constants';

// Matcher for grid-template-columns (equal columns with fr units)
export const gridTemplateColumnsMatcher = {
  match: (property: string, value: string) => {
    return property === 'grid-template-columns' && !!GRID_PATTERNS[value.toLowerCase().trim()];
  }
};

// Matcher for grid-template-rows (equal rows with fr units)
export const gridRowsMatcher = {
  match: (property: string, value: string) => {
    return property === 'grid-template-rows' && !!GRID_ROWS_PATTERNS[value.toLowerCase().trim()];
  }
};

// Matcher for grid-template-columns with fixed sizes (e.g., "200px 200px 200px")
export const gridTemplateColumnsFixedMatcher = {
  match: (property: string, value: string) => {
    if (property !== 'grid-template-columns') return false;
    const parts = value.trim().split(/\s+/);
    return parts.length > 1 && parts.every(p => p === parts[0]);
  }
};

// Matcher for grid-template-rows with fixed sizes
export const gridRowsFixedMatcher = {
  match: (property: string, value: string) => {
    if (property !== 'grid-template-rows') return false;
    const parts = value.trim().split(/\s+/);
    return parts.length > 1 && parts.every(p => p === parts[0]);
  }
};

// Matcher for grid gap
export const gridGapMatcher = {
  match: (property: string, value: string) => {
    return ['gap', 'grid-gap'].includes(property);
  }
};

// Matcher for grid column gap
export const gridColumnGapMatcher = {
  match: (property: string, value: string) => {
    return ['column-gap', 'grid-column-gap'].includes(property);
  }
};

// Matcher for grid row gap
export const gridRowGapMatcher = {
  match: (property: string, value: string) => {
    return ['row-gap', 'grid-row-gap'].includes(property);
  }
};

// Matcher for grid column/row span
export const gridSpanMatcher = {
  match: (property: string, value: string) => {
    return (property === 'grid-column' || property === 'grid-row') && /^span\s+\d+$/.test(value.trim());
  }
};

// Matcher for grid column/row start/end
export const gridStartEndMatcher = {
  match: (property: string, value: string) => {
    return (
      ['grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end'].includes(property) &&
      (/^\d+$/.test(value.trim()) || value.trim() === 'auto')
    );
  }
};
