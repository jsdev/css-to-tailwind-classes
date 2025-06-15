# Settings and Repeater Optimization

This document describes the new settings and repeater optimization features added to the CSS-to-Tailwind converter.

## Features Added

### 1. Settings System (`src/utils/settings.ts`)

A comprehensive settings system that allows users to configure converter behavior:

- **Size Optimization** (Default: ON) - Converts width + height pairs to size utilities
- **Repeater Optimization** (Default: ON) - Optimizes repeated grid values  
- **Repeater Threshold** (Default: 3) - Minimum repetitions to trigger optimization
- **Arbitrary Values** (Default: ON) - Use arbitrary value syntax for unsupported values
- **Short Class Names** (Default: ON) - Prefer shorter class names when available

### 2. Repeater Optimizer (`src/utils/repeater.ts`)

Detects and optimizes repeated values in CSS grid properties:

- Analyzes `grid-template-columns` and `grid-template-rows`
- Converts patterns like "200px 200px 200px" to "repeat(3, 200px)"
- Optimizes equal fr units to standard grid classes (e.g., "1fr 1fr 1fr 1fr" → "grid-cols-4")
- Falls back to arbitrary values when needed

### 3. Settings UI (`src/components/Settings.tsx`)

A modal settings panel accessible from the header:

- Toggle switches for all optimization features
- Slider for repeater threshold adjustment
- Real-time preview of changes
- Mobile-friendly design

## Examples

### Size Optimization
```css
/* Input */
.full-size {
  width: 100%;
  height: 100%;
}

/* Output (enabled) */
.full-size { @apply size-full; }

/* Output (disabled) */
.full-size { @apply w-full h-full; }
```

### Repeater Optimization
```css
/* Input */
.grid-container {
  grid-template-columns: 200px 200px 200px 200px;
}

/* Output (enabled) */
.grid-container { @apply grid-cols-[repeat(4,200px)]; }

/* Input */
.equal-cols {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

/* Output (enabled) */
.equal-cols { @apply grid-cols-4; }
```

## Technical Implementation

### Settings Integration
- Settings are globally managed through the settings module
- Changes trigger re-conversion of CSS through React state management
- All converter functions check settings before applying optimizations

### Grid Matcher Integration
- Added `gridTemplateColumnsFixedMatcher` and `gridRowsFixedMatcher` to pattern matchers
- New `convertGridRepeater` function handles repeater optimization
- Seamless fallback to arbitrary values when optimization is disabled

### UI Integration
- Settings component integrated into both desktop and mobile headers
- Settings changes immediately trigger CSS re-conversion
- Modal design ensures settings don't interfere with main workflow

## Usage

1. **Access Settings**: Click the settings gear icon in the header
2. **Toggle Features**: Use the checkboxes to enable/disable optimizations
3. **Adjust Threshold**: Use the slider to set minimum repetitions for repeater optimization
4. **See Results**: Changes are applied immediately to the conversion output

## Testing

To test the new features, try this CSS in the converter:

```css
/* Test size optimization */
.full-size {
  width: 100%;
  height: 100%;
}

/* Test repeater optimization */
.grid-container {
  grid-template-columns: 200px 200px 200px 200px;
  grid-template-rows: 100px 100px 100px;
}

.equal-cols {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
```

Toggle the settings to see how the output changes with different optimization levels.
