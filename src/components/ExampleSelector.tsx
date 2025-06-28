import { memo } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { EXAMPLE_SETS, ExampleSetKey } from '../data/examples';

interface ExampleSelectorProps {
  onExampleSelect: (example: string) => void;
  className?: string;
}

export const ExampleSelector = memo(({ onExampleSelect, className = '' }: ExampleSelectorProps) => {
  const handleExampleSelect = (key: ExampleSetKey) => {
    onExampleSelect(EXAMPLE_SETS[key]);
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-300 
                   focus:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   rounded-lg transition-colors"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <BookOpen className="w-4 h-4" />
        <span>Examples</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 
                      rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 
                      group-hover:visible group-focus-within:opacity-100 group-focus-within:visible 
                      transition-all duration-200 z-50">
        <div className="py-2">
          <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
            Example Sets
          </div>
          {(Object.keys(EXAMPLE_SETS) as ExampleSetKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleExampleSelect(key)}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 
                         hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none 
                         transition-colors"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

ExampleSelector.displayName = 'ExampleSelector';
