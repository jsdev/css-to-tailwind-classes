export const BASIC_LAYOUT_EXAMPLES = `/* Basic Layout Examples */

/* Flexbox container */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

/* Grid layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}

/* Responsive design */
.responsive-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Positioning */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

/* Size utilities */
.full-screen {
  width: 100vw;
  height: 100vh;
}

.square {
  width: 200px;
  height: 200px;
  aspect-ratio: 1 / 1;
}`;

export const INTERACTIVE_EXAMPLES = `/* Interactive & State Examples */

/* Hover effects */
.btn {
  background-color: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);
}

/* Focus states */
.input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

/* Form states */
.form-field:required {
  border-left: 3px solid #ef4444;
}

.form-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Structural pseudo-classes */
.list-item:first-child {
  border-top: none;
}

.list-item:last-child {
  border-bottom: none;
}

.table-row:nth-child(even) {
  background-color: #f9fafb;
}`;

export const PSEUDO_ELEMENTS_EXAMPLES = `/* Pseudo-elements Examples */

/* Tooltips with ::before and ::after */
.tooltip {
  position: relative;
}

.tooltip::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #374151;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #374151;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  margin-bottom: 8px;
}

/* Input styling */
input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* File input button */
.file-input::file-selector-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 16px;
  cursor: pointer;
}

/* Selection styling */
::selection {
  background-color: #3b82f6;
  color: white;
}

/* First line and letter */
.article-intro::first-line {
  font-weight: 600;
  color: #374151;
}

.drop-cap::first-letter {
  float: left;
  font-size: 4rem;
  line-height: 1;
  margin: 0 8px 0 0;
  color: #3b82f6;
}`;

export const COMPLEX_SELECTORS_EXAMPLES = `/* Complex Selectors Examples */

/* :has() selector */
.card:has(img) {
  padding: 0;
  overflow: hidden;
}

.form-group:has(input:focus) {
  box-shadow: 0 0 0 2px #3b82f6;
}

/* :not() selector */
.btn:not(.btn-secondary) {
  background-color: #3b82f6;
}

.list-item:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

/* Combining states */
.card:hover:not(.disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Modal backdrop */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

/* Custom markers */
ul.custom-list li::marker {
  content: "→ ";
  color: #3b82f6;
}`;

export const ANIMATION_EXAMPLES = `/* Animation & Transition Examples */

/* Smooth transitions */
.smooth-box {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  border-radius: 8px;
  padding: 20px;
}

.smooth-box:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

/* Loading spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Fade animations */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

.slide-up {
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.6s ease-out forwards;
}

/* Transform utilities */
.rotate-45 {
  transform: rotate(45deg);
}

.scale-hover:hover {
  transform: scale(1.1);
}`;

export const UTILITY_EXAMPLES = `/* Utility Class Examples */

/* Typography */
.heading-large {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.text-muted {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Spacing utilities */
.section-padding {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.stack-small > * + * {
  margin-top: 0.5rem;
}

/* Background utilities */
.gradient-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.pattern-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Border utilities */
.card-border {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

/* Shadow utilities */
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}`;

export const ENHANCED_CONVERSION_EXAMPLES = `/* Enhanced Conversion Test Cases */

/* Opacity values */
.opacity-examples {
  opacity: 0.5;
}

.opacity-zero {
  opacity: 0;
}

.opacity-full {
  opacity: 1;
}

.opacity-percentage {
  opacity: 75%;
}

/* Z-index values */
.z-index-examples {
  z-index: 50;
  position: relative;
}

.z-index-auto {
  z-index: auto;
}

.z-index-negative {
  z-index: -1;
}

.z-index-high {
  z-index: 9999;
}

/* Transform values */
.transform-translate {
  transform: translateY(0);
}

.transform-scale {
  transform: scale(1.5);
}

.transform-rotate {
  transform: rotate(45deg);
}

.transform-combined {
  transform: translateX(10px) scale(0.9) rotate(-2deg);
}

/* Margin auto patterns (centering) */
.centered-horizontal {
  margin: 0 auto;
}

.centered-all {
  margin: auto;
}

.centered-with-vertical {
  margin: 10px auto 20px;
}

.centered-four-values {
  margin: 0 auto 0 auto;
}

.centered-different-values {
  margin: 16px auto 24px;
}

.centered-complex {
  margin: 8px auto 12px auto;
}

/* Mixed enhanced patterns */
.enhanced-card {
  margin: 0 auto;
  opacity: 0.9;
  transform: scale(1.05);
  z-index: 10;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.8);
}

.enhanced-button {
  opacity: 0.8;
  transform: translateY(-2px);
  z-index: 1;
  margin: 8px auto;
}

/* Complex transforms */
.complex-transform {
  transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
}

.hover-effect {
  transform: translateY(0px);
  opacity: 1;
  transition: all 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-4px);
  opacity: 0.95;
}`;

// Export all examples as a collection
export const EXAMPLE_SETS = {
  'Basic Layout': BASIC_LAYOUT_EXAMPLES,
  'Interactive States': INTERACTIVE_EXAMPLES,
  'Pseudo-elements': PSEUDO_ELEMENTS_EXAMPLES,
  'Complex Selectors': COMPLEX_SELECTORS_EXAMPLES,
  'Animations': ANIMATION_EXAMPLES,
  'Utility Classes': UTILITY_EXAMPLES,
  'Enhanced Conversion': ENHANCED_CONVERSION_EXAMPLES
} as const;

export type ExampleSetKey = keyof typeof EXAMPLE_SETS;
