import React, { memo, useMemo } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { ConversionResult } from '../types';

interface ConversionOutputProps {
  results: ConversionResult[];
  onCopy: (text: string) => void;
  copiedText: string | null;
}

// Constants
const EMPTY_STATE_MESSAGES = {
  primary: "Enter CSS to see Tailwind conversion",
  secondary: "Paste your CSS rules in the left panel"
} as const;

// Helper component for status indicators
const StatusIndicator = memo(({ type, label }: { type: 'success' | 'warning'; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
      type === 'success' ? 'bg-green-500' : 'bg-orange-500'
    }`} />
    <span className="text-xs text-gray-400 uppercase tracking-wide">
      {label}
    </span>
  </div>
));

StatusIndicator.displayName = 'StatusIndicator';

// Helper component for copy button
const CopyButton = memo(({ 
  text, 
  onCopy, 
  isCopied 
}: { 
  text: string; 
  onCopy: (text: string) => void; 
  isCopied: boolean; 
}) => (
  <button
    onClick={() => onCopy(text)}
    className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 
               focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
               opacity-0 group-hover:opacity-100 sm:opacity-100 transition-all duration-200"
    title={isCopied ? "Copied!" : "Copy classes"}
    aria-label={isCopied ? "Classes copied to clipboard" : "Copy classes to clipboard"}
  >
    {isCopied ? (
      <Check className="w-3 h-3 text-green-400" />
    ) : (
      <Copy className="w-3 h-3 text-gray-300" />
    )}
  </button>
));

CopyButton.displayName = 'CopyButton';

// Empty state component
const EmptyState = memo(() => (
  <div className="h-full flex items-center justify-center text-gray-500 p-4">
    <div className="text-center" role="status" aria-live="polite">
      <p className="text-sm sm:text-base">{EMPTY_STATE_MESSAGES.primary}</p>
      <p className="text-xs text-gray-600 mt-2 hidden sm:block">
        {EMPTY_STATE_MESSAGES.secondary}
      </p>
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';

// Main component
export const ConversionOutput = memo(({ results, onCopy, copiedText }: ConversionOutputProps) => {
  // Memoize processed results to avoid recalculating joins
  const processedResults = useMemo(() => 
    results.map(result => ({
      ...result,
      tailwindClassesString: result.tailwindClasses.join(' ')
    })), [results]
  );

  if (results.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6" role="region" aria-label="Conversion results">
      {processedResults.map((result, index) => {
        const hasTailwindClasses = result.tailwindClasses.length > 0;
        const hasUnconvertible = result.unconvertible.length > 0;
        const isCopied = copiedText === result.tailwindClassesString;

        return (
          <article key={index} className="space-y-3">
            {/* Selector header */}
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300 break-all" title={result.selector}>
                {result.selector}
              </h3>
            </header>
            
            {/* Tailwind classes section */}
            {hasTailwindClasses && (
              <section className="space-y-2" aria-labelledby={`tailwind-${index}`}>
                <StatusIndicator type="success" label="Tailwind Classes" />
                <div className="relative group">
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <code 
                      className="text-green-400 text-xs sm:text-sm break-all leading-relaxed"
                      aria-label="Generated Tailwind CSS classes"
                    >
                      {result.tailwindClassesString}
                    </code>
                  </div>
                  <CopyButton 
                    text={result.tailwindClassesString}
                    onCopy={onCopy}
                    isCopied={isCopied}
                  />
                </div>
              </section>
            )}

            {/* Unconvertible section */}
            {hasUnconvertible && (
              <section className="space-y-2" aria-labelledby={`unconvertible-${index}`}>
                <StatusIndicator type="warning" label="Unable to Convert" />
                <div className="space-y-2">
                  {result.unconvertible.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-3"
                      role="alert"
                      aria-describedby={`error-${index}-${idx}`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle 
                          className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" 
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <code 
                            className="text-orange-300 text-xs sm:text-sm font-mono break-all"
                            aria-label="Unconvertible CSS property"
                          >
                            {item.property}: {item.value};
                          </code>
                          <p 
                            id={`error-${index}-${idx}`}
                            className="text-xs text-orange-200/70 mt-1 break-words"
                          >
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        );
      })}
    </div>
  );
});

ConversionOutput.displayName = 'ConversionOutput';