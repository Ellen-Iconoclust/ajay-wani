import React from 'react';

interface VoskOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  queueCount: number;
  onFlushQueue: () => void;
}

export const VoskOfflineModal: React.FC<VoskOfflineModalProps> = ({
  isOpen,
  onClose,
  isOfflineMode,
  onToggleOffline,
  queueCount,
  onFlushQueue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-400 rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#1e293b] text-white px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
              [SYSTEM ARCHITECTURE & RELIABILITY SPECIFICATION]
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              VOSK OFFLINE ACOUSTIC SPEECH ENGINE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 px-2 py-1 rounded-xs uppercase tracking-wider font-mono cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Status Box */}
          <div className="bg-gray-50 border border-gray-300 p-3 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">
                CURRENT NETWORK CONNECTIVITY STATE:
              </span>
              <span className="font-bold text-sm">
                {isOfflineMode ? (
                  <span className="text-amber-700">[SIMULATED RURAL NETWORK BLACKOUT (AIR-GAPPED)]</span>
                ) : (
                  <span className="text-emerald-700">[ONLINE CLOUD / BROADBAND NETWORK CONNECTED]</span>
                )}
              </span>
              <div className="text-[11px] text-gray-600 mt-0.5">
                Vosk small acoustic models run locally with zero latency and 0 bytes transmitted over the cloud.
              </div>
            </div>

            <button
              onClick={onToggleOffline}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded-xs border cursor-pointer whitespace-nowrap ${
                isOfflineMode
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
                  : 'bg-amber-700 hover:bg-amber-800 text-white border-amber-800'
              }`}
            >
              {isOfflineMode ? '[RESTORE CLOUD CONNECTIVITY]' : '[SEVER NETWORK (TEST VOSK OFFLINE)]'}
            </button>
          </div>

          {/* Technical Specs Grid */}
          <div className="border border-gray-200 p-3 rounded-sm space-y-2">
            <span className="font-bold text-gray-900 uppercase font-mono block text-[11px]">
              VOSK KALDI ACOUSTIC PIPELINE SPECIFICATIONS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">MODEL ARCHITECTURE:</span>
                <span className="font-bold text-gray-900">Kaldi nnet3 / LF-MMI</span>
              </div>
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">MEMORY FOOTPRINT:</span>
                <span className="font-bold text-gray-900">~43 MB RAM</span>
              </div>
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">AUDIO SAMPLING:</span>
                <span className="font-bold text-gray-900">16kHz Mono 16-bit PCM</span>
              </div>
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">RURAL LATENCY:</span>
                <span className="font-bold text-gray-900">&lt; 120ms (Real-Time)</span>
              </div>
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">DIALECT TOLERANCE:</span>
                <span className="font-bold text-gray-900">Grapheme-to-Phoneme</span>
              </div>
              <div className="bg-gray-50 p-2 border border-gray-200 rounded-xs">
                <span className="text-gray-500 block uppercase">CLOUD REQUIREMENT:</span>
                <span className="font-bold text-emerald-700">0% (100% Standalone)</span>
              </div>
            </div>
          </div>

          {/* Offline Queue Information */}
          <div className="border border-amber-300 bg-amber-50/50 p-3 rounded-sm space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 uppercase font-mono block text-[11px]">
                  LOCAL EDGE TRANSACTION QUEUE
                </span>
                <p className="text-[11px] text-amber-950">
                  During rural network blackouts, all beneficiary voice interviews, extracted variables, and GIA sanction tokens are securely buffered in encrypted local storage.
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-amber-900">
                  {queueCount}
                </span>
                <span className="text-[10px] block font-mono text-gray-500 uppercase">
                  RECORDS QUEUED
                </span>
              </div>
            </div>

            {queueCount > 0 && (
              <button
                onClick={onFlushQueue}
                className="mt-2 w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-mono uppercase rounded-xs cursor-pointer"
              >
                [AUTO-SYNC {queueCount} QUEUED RECORDS TO CENTRAL MoSJE MIS]
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-xs text-xs font-mono uppercase cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>
      </div>
    </div>
  );
};
