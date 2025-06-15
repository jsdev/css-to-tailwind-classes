// settings.ts
// Configuration settings for the CSS to Tailwind converter

export interface ConverterSettings {
  /** Enable size optimization (e.g., w-full h-full → size-full) */
  enableSizeOptimization: boolean;
  
  /** Enable repeater optimization (e.g., repeated values → repeat() syntax) */
  enableRepeaterOptimization: boolean;
  
  /** Minimum number of repeated values to trigger repeater optimization */
  repeaterThreshold: number;
  
  /** Enable arbitrary value fallbacks */
  enableArbitraryValues: boolean;
  
  /** Prefer shorter class names when possible */
  preferShortClassNames: boolean;
}

// Default settings
export const defaultSettings: ConverterSettings = {
  enableSizeOptimization: true,
  enableRepeaterOptimization: true,
  repeaterThreshold: 3,
  enableArbitraryValues: true,
  preferShortClassNames: true,
};

// Global settings instance
let currentSettings: ConverterSettings = { ...defaultSettings };

// Settings management functions
export function getSettings(): ConverterSettings {
  return { ...currentSettings };
}

export function updateSettings(newSettings: Partial<ConverterSettings>): void {
  currentSettings = { ...currentSettings, ...newSettings };
}

export function resetSettings(): void {
  currentSettings = { ...defaultSettings };
}

// Specific setting getters for performance
export function isSizeOptimizationEnabled(): boolean {
  return currentSettings.enableSizeOptimization;
}

export function isRepeaterOptimizationEnabled(): boolean {
  return currentSettings.enableRepeaterOptimization;
}

export function getRepeaterThreshold(): number {
  return currentSettings.repeaterThreshold;
}

export function isArbitraryValuesEnabled(): boolean {
  return currentSettings.enableArbitraryValues;
}

export function shouldPreferShortClassNames(): boolean {
  return currentSettings.preferShortClassNames;
}
