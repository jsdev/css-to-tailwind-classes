import React, { memo, useCallback, useRef, KeyboardEvent } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: 'css' | 'tailwind';
  readOnly?: boolean;
  hidden?: boolean;
  'aria-label'?: string;
}

const LANGUAGE_COLORS = {
  css: 'text-blue-400',
  tailwind: 'text-green-400'
} as const;

const TAB_SIZE = 2;

export const CodeEditor = memo(function CodeEditor({ 
  value, 
  onChange, 
  placeholder = "Enter code here...", 
  language = 'css', 
  readOnly = false,
  hidden = false,
  'aria-label': ariaLabel
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value);
    }
  }, [onChange, readOnly]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const spaces = ' '.repeat(TAB_SIZE);
      const newValue = value.slice(0, selectionStart) + spaces + value.slice(selectionEnd);
      
      onChange(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + TAB_SIZE;
      }, 0);
    }
    
    // Handle Enter key for auto-indentation
    else if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const lineText = value.slice(lineStart, selectionStart);
      const indentMatch = lineText.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Add extra indentation after opening braces
      const extraIndent = lineText.trim().endsWith('{') ? ' '.repeat(TAB_SIZE) : '';
      const newIndent = '\n' + currentIndent + extraIndent;
      
      e.preventDefault();
      const newValue = value.slice(0, selectionStart) + newIndent + value.slice(selectionEnd);
      onChange(newValue);
      
      // Set cursor position after the indentation
      setTimeout(() => {
        const newPosition = selectionStart + newIndent.length;
        textarea.selectionStart = textarea.selectionEnd = newPosition;
      }, 0);
    }
    
    // Handle Shift+Tab for dedentation
    else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const lineEnd = value.indexOf('\n', selectionStart);
      const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
      
      const lineText = value.slice(lineStart, actualLineEnd);
      const dedentedLine = lineText.replace(new RegExp(`^\\s{1,${TAB_SIZE}}`), '');
      const removedSpaces = lineText.length - dedentedLine.length;
      
      if (removedSpaces > 0) {
        const newValue = value.slice(0, lineStart) + dedentedLine + value.slice(actualLineEnd);
        onChange(newValue);
        
        // Adjust cursor position
        setTimeout(() => {
          const newPosition = Math.max(lineStart, selectionStart - removedSpaces);
          textarea.selectionStart = textarea.selectionEnd = newPosition;
        }, 0);
      }
    }
  }, [value, onChange]);

  // Handle bracket matching (optional enhancement)
  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, value: currentValue } = textarea;
    
    // Auto-close brackets and braces
    const lastChar = currentValue[selectionStart - 1];
    const closingChars: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'"
    };
    
    if (lastChar && lastChar in closingChars && !readOnly) {
      const closingChar = closingChars[lastChar];
      const newValue = currentValue.slice(0, selectionStart) + closingChar + currentValue.slice(selectionStart);
      
      // Only auto-close if the next character isn't the same closing character
      if (currentValue[selectionStart] !== closingChar) {
        onChange(newValue);
        
        // Keep cursor between the brackets
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart;
        }, 0);
      }
    }
  }, [onChange, readOnly]);

  const textareaClasses = [
    'w-full h-full resize-none border-0 bg-transparent p-3 sm:p-4',
    'font-mono text-xs sm:text-sm leading-relaxed',
    'focus:outline-none focus:ring-0',
    'placeholder-gray-500',
    'selection:bg-blue-500/30',
    LANGUAGE_COLORS[language],
    readOnly ? 'cursor-default' : 'cursor-text'
  ].join(' ');

  return (
    <div className="relative group h-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${textareaClasses} ${hidden ? 'opacity-0 pointer-events-none' : ''}`}

        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        wrap="soft"
        tabIndex={readOnly ? -1 : 0}
        aria-label={ariaLabel || `${language} code editor`}
        aria-multiline="true"
        role="textbox"
        data-language={language}
      />
      
      {/* Line numbers could be added here as an enhancement */}
      {value && !hidden && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-400">
            {value.split('\n').length} lines
          </div>
        </div>
      )}
    </div>
  );
});