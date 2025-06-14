import React, { useState, useMemo } from 'react';
import { Waves, Github, Copy, Trash2 } from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import { ConversionOutput } from './components/ConversionOutput';
import { parseCSS } from './utils/cssParser';
import { convertCSSToTailwind } from './utils/tailwindConverter';
import { useClipboard } from './hooks/useClipboard';

const EXAMPLE_CSS = `example1 {
  display: grid;
  grid-template-columns: 200px 200px;
  justify-content: space-around;
}

example2 {
  position: absolute;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}`;

function App() {
  const [cssInput, setCssInput] = useState(EXAMPLE_CSS);
  const { copiedText, copyToClipboard } = useClipboard();

  const conversionResults = useMemo(() => {
    if (!cssInput.trim()) return [];
    
    try {
      const rules = parseCSS(cssInput);
      return convertCSSToTailwind(rules);
    } catch (error) {
      console.error('Error parsing CSS:', error);
      return [];
    }
  }, [cssInput]);

  const handleClear = () => {
    setCssInput('');
  };

  const copyAllClasses = () => {
    const allClasses = conversionResults
      .flatMap(result => result.tailwindClasses)
      .join(' ');
    if (allClasses) {
      copyToClipboard(allClasses);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CSS Tailwind Converter</h1>
                <p className="text-sm text-gray-400">
                  Convert CSS rules to Tailwind utility classes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={copyAllClasses}
                disabled={conversionResults.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                         disabled:bg-gray-700 disabled:text-gray-400 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                         rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-89px)]">
        {/* CSS Input Panel */}
        <div className="flex-1 border-r border-gray-800">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-300">CSS Input</span>
              </div>
              <span className="text-xs text-gray-500">
                /* Paste CSS here */
              </span>
            </div>
            
            <div className="flex-1 bg-gray-950">
              <CodeEditor
                value={cssInput}
                onChange={setCssInput}
                placeholder="Enter your CSS rules here..."
                language="css"
              />
            </div>
          </div>
        </div>

        {/* Tailwind Output Panel */}
        <div className="flex-1">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-300">Tailwind Output</span>
              </div>
              {conversionResults.length > 0 && (
                <span className="text-xs text-gray-500">
                  {conversionResults.length} rule{conversionResults.length !== 1 ? 's' : ''} converted
                </span>
              )}
            </div>
            
            <div className="flex-1 bg-gray-950">
              <ConversionOutput
                results={conversionResults}
                onCopy={copyToClipboard}
                copiedText={copiedText}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600">
        <p>Built with React + TypeScript + Tailwind CSS</p>
      </div>
    </div>
  );
}

export default App;