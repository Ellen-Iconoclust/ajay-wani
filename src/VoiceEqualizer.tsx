import React from 'react';

interface VoiceEqualizerProps {
  isActive: boolean;
  color?: string;
  label?: string;
}

export const VoiceEqualizer: React.FC<VoiceEqualizerProps> = ({
  isActive,
  color = 'bg-blue-600',
  label = 'AUDIO STREAM'
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-1 h-5 w-16 px-1 py-0.5 bg-gray-100 border border-gray-300 rounded-sm">
        <div
          className={`w-1 rounded-xs transition-all duration-150 ${color} ${
            isActive ? 'h-4 animate-pulse' : 'h-1.5'
          }`}
        />
        <div
          className={`w-1 rounded-xs transition-all duration-150 ${color} ${
            isActive ? 'h-3 animate-pulse delay-75' : 'h-2'
          }`}
        />
        <div
          className={`w-1 rounded-xs transition-all duration-150 ${color} ${
            isActive ? 'h-5 animate-pulse delay-150' : 'h-1'
          }`}
        />
        <div
          className={`w-1 rounded-xs transition-all duration-150 ${color} ${
            isActive ? 'h-2.5 animate-pulse delay-100' : 'h-2'
          }`}
        />
        <div
          className={`w-1 rounded-xs transition-all duration-150 ${color} ${
            isActive ? 'h-4 animate-pulse delay-200' : 'h-1'
          }`}
        />
      </div>
      <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
        {isActive ? `[LIVE: ${label}]` : '[STANDBY]'}
      </span>
    </div>
  );
};
