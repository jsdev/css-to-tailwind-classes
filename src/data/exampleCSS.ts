export const EXAMPLE_CSS = `/* Grid layout with repeated columns */
.grid-container {
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  grid-template-rows: 100px 100px 100px;
  gap: 16px;
}

/* Size optimization example */
.full-size {
  width: 100%;
  height: 100%;
}

/* Equal columns using fr units */
.equal-cols {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

/* Video aspect ratio example */
video {
  aspect-ratio: 16 / 9;
  accent-color: yellow;
}

/* Card component example */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}

.card-button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Custom variable fill test */
.icon {
  fill: var(--my-brand-color);
}

/* Pseudo-class examples */
.btn:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}

.btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.btn:active {
  transform: scale(0.95);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-field:required {
  border-color: #ef4444;
}

/* Structural pseudo-classes */
.list-item:first-child {
  margin-top: 0;
}

.list-item:last-child {
  margin-bottom: 0;
}

.table-row:nth-child(odd) {
  background-color: #f9fafb;
}

.table-row:nth-child(even) {
  background-color: #ffffff;
}

/* Pseudo-elements */
.tooltip::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #374151;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #374151;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.file-input::file-selector-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.quote::first-line {
  font-weight: bold;
  font-style: italic;
}

.article::first-letter {
  font-size: 2em;
  float: left;
  line-height: 1;
  margin-right: 8px;
}

/* Complex pseudo-class functions */
.sidebar:has(> .menu-open) {
  width: 250px;
}

.form-group:not(.disabled) {
  opacity: 1;
}

.card:not(:hover):not(:focus) {
  box-shadow: none;
}

/* Modern pseudo-classes */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

::selection {
  background-color: #3b82f6;
  color: white;
}

ul li::marker {
  color: #3b82f6;
}
`;
