import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { ConversionResult } from '../types';

interface ConversionOutputProps {
  results: ConversionResult[];
  onCopy: (text: string) => void;
  copiedText: string | null;
}

export function ConversionOutput({ results, onCopy, copiedText }: ConversionOutputProps) {
  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Enter CSS to see Tailwind conversion</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {results.map((result, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">
              {result.selector}
            </h3>
          </div>
          
          {result.tailwindClasses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Tailwind Classes
                </span>
              </div>
              <div className="relative group">
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <code className="text-green-400 text-sm break-all">
                    {result.tailwindClasses.join(' ')}
                  </code>
                </div>
                <button
                  onClick={() => onCopy(result.tailwindClasses.join(' '))}
                  className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 
                           opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy classes"
                >
                  {copiedText === result.tailwindClasses.join(' ') ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          )}

          {result.unconvertible.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Unable to Convert
                </span>
              </div>
              <div className="space-y-2">
                {result.unconvertible.map((item, idx) => (
                  <div key={idx} className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <code className="text-orange-300 text-sm font-mono">
                          {item.property}: {item.value};
                        </code>
                        <p className="text-xs text-orange-200/70 mt-1">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}