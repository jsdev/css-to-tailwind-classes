import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: 'css' | 'tailwind';
  readOnly?: boolean;
}

export function CodeEditor({ 
  value, 
  onChange, 
  placeholder, 
  language = 'css', 
  readOnly = false 
}: CodeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative h-full">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`
          w-full h-full resize-none border-0 bg-transparent p-4 font-mono text-sm
          focus:outline-none focus:ring-0
          ${language === 'css' ? 'text-blue-400' : 'text-green-400'}
          placeholder-gray-500
        `}
        spellCheck={false}
      />
    </div>
  );
}