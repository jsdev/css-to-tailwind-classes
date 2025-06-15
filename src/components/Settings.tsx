import React, { useState } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { 
  getSettings, 
  updateSettings, 
  ConverterSettings 
} from '../utils/settings';

interface SettingsProps {
  onSettingsChange?: () => void;
  onModalToggle?: (isOpen: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSettingsChange, onModalToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettingsState] = useState<ConverterSettings>(getSettings());

  const handleToggle = (key: keyof ConverterSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettingsState(newSettings);
    updateSettings(newSettings);
    onSettingsChange?.();
  };

  const handleThresholdChange = (value: number) => {
    const newSettings = {
      ...settings,
      repeaterThreshold: value
    };
    setSettingsState(newSettings);
    updateSettings(newSettings);
    onSettingsChange?.();
  };

  const handleModalOpen = () => {
    setIsOpen(true);
    onModalToggle?.(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    onModalToggle?.(false);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={handleModalOpen}
        className="p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleModalClose}
          />
          {/* Modal */}
          <div className="relative z-[9999999] flex items-center justify-center min-h-full p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Converter Settings</h2>
                <button
                  onClick={handleModalClose}
                  className="p-1 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-4 space-y-6">
                {/* Size Optimization */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.enableSizeOptimization}
                      onChange={() => handleToggle('enableSizeOptimization')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Size Optimization</span>
                      <p className="text-xs text-gray-400">
                        Convert width + height pairs to size utility
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Example: "width: 100%; height: 100%" → "size-full"
                      </p>
                    </div>
                  </label>
                </div>

                {/* Repeater Optimization */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.enableRepeaterOptimization}
                      onChange={() => handleToggle('enableRepeaterOptimization')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Repeater Optimization</span>
                      <p className="text-xs text-gray-400">
                        Convert repeated grid values to repeat() syntax or optimized classes
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Example: "200px 200px 200px" → "grid-cols-[repeat(3,200px)]"
                      </p>
                      <p className="text-xs text-green-400">
                        Example: "1fr 1fr 1fr 1fr" → "grid-cols-4"
                      </p>
                    </div>
                  </label>

                  {/* Repeater Threshold */}
                  {settings.enableRepeaterOptimization && (
                    <div className="ml-7 space-y-2">
                      <label className="block text-xs font-medium text-gray-300">
                        Minimum repetitions to trigger optimization
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="2"
                          max="6"
                          value={settings.repeaterThreshold}
                          onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-300 w-8 text-center">
                          {settings.repeaterThreshold}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Example: With threshold 3, "200px 200px 200px" becomes "repeat(3, 200px)"
                      </p>
                    </div>
                  )}
                </div>

                {/* Arbitrary Values */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.enableArbitraryValues}
                      onChange={() => handleToggle('enableArbitraryValues')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Arbitrary Values</span>
                      <p className="text-xs text-gray-400">
                        Use arbitrary value syntax for unsupported values (e.g., w-[123px])
                      </p>
                    </div>
                  </label>
                </div>

                {/* Short Class Names */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.preferShortClassNames}
                      onChange={() => handleToggle('preferShortClassNames')}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">Prefer Short Class Names</span>
                      <p className="text-xs text-gray-400">
                        Use shorter class names when available (e.g., m-4 instead of margin-4)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                <button
                  onClick={handleModalClose}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
