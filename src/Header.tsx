import React from 'react';
import { TranslationStrings } from '../data/translations';

export type ActivePage = 'home' | 'assistant' | 'profile' | 'nsqf' | 'mis';

interface HeaderProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  userName: string;
  onOpenAadhaarLogin: () => void;
  t: TranslationStrings;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onSelectPage,
  userName,
  onOpenAadhaarLogin,
  t,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo / Brand Title */}
        <div
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs bg-gray-900 text-white px-2 py-0.5 rounded-sm">
              {t.appName}
            </span>
            <span className="text-sm font-semibold tracking-tight text-gray-900 hidden sm:inline">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Clean Page Navigation */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onSelectPage('home')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.navHome}
          </button>

          <button
            onClick={() => onSelectPage('assistant')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
              activePage === 'assistant'
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.navAssistant}
          </button>

          <button
            onClick={() => onSelectPage('profile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
              activePage === 'profile'
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.navProfile}
          </button>

          <button
            onClick={() => onSelectPage('nsqf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
              activePage === 'nsqf'
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.navNsqf}
          </button>

          <button
            onClick={() => onSelectPage('mis')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
              activePage === 'mis'
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t.navMis}
          </button>
        </nav>

        {/* User Account / Aadhaar Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAadhaarLogin}
            className="flex items-center gap-2 px-2.5 py-1 text-xs border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer text-gray-800"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">{userName || 'Pravin'}</span>
            <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
              [{t.scVerified}]
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
