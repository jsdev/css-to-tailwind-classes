import React, { useState, useMemo, useCallback } from 'react';
import { Waves, Github, Copy, Trash2, Menu, X } from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import { ConversionOutput } from './components/ConversionOutput';
import { parseCSS } from './utils/cssParser';
import { convertCSSToTailwind } from './utils/tailwindConverter';
import { useClipboard } from './hooks/useClipboard';

// Constants
const EXAMPLE_CSS = `video {
  aspect-ratio: 16 / 9;
}

example1 {
  background: #fff;
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
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.card-content {
  font-size: 16px;
  line-height: 1.5;
  color: #666666;
}

.card-button {
  display: inline-block;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 16px;
  transition: background-color 0.3s ease;
}

.card-button:hover {
  background-color: #2563eb;
}

`;

const HEADER_HEIGHT = 89;
const GITHUB_URL = 'https://github.com/jsdev/css-to-tailwind-classes';

// Types
interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

// Helper Components
const ActionButton = ({ onClick, disabled = false, variant, children, className = '' }: ActionButtonProps) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium";
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 focus:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400",
    secondary: "bg-gray-700 hover:bg-gray-600 focus:bg-gray-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={disabled ? "No classes to copy" : undefined}
    >
      {children}
    </button>
  );
};

const PanelHeader = ({ 
  title, 
  color, 
  subtitle 
}: { 
  title: string; 
  color: string; 
  subtitle?: string; 
}) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm font-medium text-gray-300">{title}</span>
    </div>
    {subtitle && (
      <span className="text-xs text-gray-500 hidden sm:block">
        {subtitle}
      </span>
    )}
  </div>
);

function App() {
  const [cssInput, setCssInput] = useState(EXAMPLE_CSS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { copiedText, copyToClipboard } = useClipboard();

  // Memoized conversion results
  const conversionResults = useMemo(() => {
    const trimmedInput = cssInput.trim();
    if (!trimmedInput) return [];
    
    try {
      const rules = parseCSS(trimmedInput);
      return convertCSSToTailwind(rules);
    } catch (error) {
      console.error('Error parsing CSS:', error);
      return [];
    }
  }, [cssInput]);

  // Memoized computed values
  const hasResults = conversionResults.length > 0;
  const resultCount = useMemo(() => {
    if (!hasResults) return '';
    return `${conversionResults.length} rule${conversionResults.length !== 1 ? 's' : ''} converted`;
  }, [conversionResults.length, hasResults]);

  const allTailwindClasses = useMemo(() => {
    return conversionResults
      .flatMap(result => result.tailwindClasses)
      .join(' ');
  }, [conversionResults]);

  // Event handlers
  const handleClear = useCallback(() => {
    setCssInput('');
  }, []);

  const handleCopyAll = useCallback(() => {
    if (allTailwindClasses) {
      copyToClipboard(allTailwindClasses);
    }
  }, [allTailwindClasses, copyToClipboard]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleMobileAction = useCallback((action: () => void) => {
    return () => {
      action();
      closeMobileMenu();
    };
  }, [closeMobileMenu]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Waves className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">CSS Tailwind Converter</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Convert CSS rules to Tailwind utility classes
                </p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ActionButton
                onClick={handleCopyAll}
                disabled={!hasResults}
                variant="primary"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </ActionButton>
              
              <ActionButton
                onClick={handleClear}
                variant="secondary"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </ActionButton>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
                aria-label="View source code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-800" role="navigation">
              <div className="flex flex-col gap-3">
                <ActionButton
                  onClick={handleMobileAction(handleCopyAll)}
                  disabled={!hasResults}
                  variant="primary"
                >
                  <Copy className="w-4 h-4" />
                  Copy All Classes
                </ActionButton>
                
                <ActionButton
                  onClick={handleMobileAction(handleClear)}
                  variant="secondary"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Input
                </ActionButton>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors text-sm font-medium"
                  onClick={closeMobileMenu}
                  aria-label="View source code on GitHub"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        {/* CSS Input Panel */}
        <section className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-800 min-h-[50vh] lg:min-h-0">
          <div className="h-full flex flex-col">
            <PanelHeader 
              title="CSS Input" 
              color="bg-blue-500" 
              subtitle="/* Paste CSS here */" 
            />
            
            <div className="flex-1 bg-gray-950">
              <CodeEditor
                value={cssInput}
                onChange={setCssInput}
                placeholder="Enter your CSS rules here..."
                language="css"
                aria-label="CSS input editor"
              />
            </div>
          </div>
        </section>

        {/* Tailwind Output Panel */}
        <section className="flex-1 min-h-[50vh] lg:min-h-0">
          <div className="h-full flex flex-col">
            <PanelHeader 
              title="Tailwind Output" 
              color="bg-green-500" 
              subtitle={resultCount} 
            />
            
            <div className="flex-1 bg-gray-950">
              <ConversionOutput
                results={conversionResults}
                onCopy={copyToClipboard}
                copiedText={copiedText}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-4 text-xs text-gray-600 hidden sm:block">
        <p>Built with React + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;