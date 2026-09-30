import React from 'react';
import { SupportedLanguage } from '../types/pmajay';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  selectedDialect: string;
  onSelectLanguage: (code: SupportedLanguage) => void;
  onSelectDialect: (dialect: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  selectedDialect,
  onSelectLanguage,
  onSelectDialect,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-3.5 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Language Selection Chips */}
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>Spoken Language:</span>
            <span className="text-blue-700 font-medium">
              {currentLangObj.name} ({currentLangObj.nativeName})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === selectedLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onSelectDialect(lang.dialects[0] || 'Standard');
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-mono text-[10px] text-gray-400 mr-1">
                    {lang.code.toUpperCase()}
                  </span>
                  {lang.nativeName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dialect */}
        <div className="lg:border-l lg:border-gray-200 lg:pl-4 min-w-[220px]">
          <div className="text-xs font-semibold text-gray-700 mb-2">
            Regional Dialect:
          </div>
          <div className="flex flex-wrap gap-1">
            {currentLangObj.dialects.map((dialect) => {
              const isSelected = dialect === selectedDialect;
              return (
                <button
                  key={dialect}
                  onClick={() => onSelectDialect(dialect)}
                  className={`px-2 py-0.5 text-xs rounded-sm border cursor-pointer ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900 font-medium'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {dialect}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
