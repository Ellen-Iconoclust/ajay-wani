import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, MicOff, Volume2 } from 'lucide-react';
import { SupportedLanguage } from '../types/pmajay';
import { SAMPLE_BENEFICIARY_UTTERANCES } from '../data/languages';

interface VoiceControllerProps {
  selectedLanguage: SupportedLanguage;
  selectedDialect: string;
  isOfflineMode: boolean;
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  onSpeakResponse?: (text: string) => void;
  onStopAudio?: () => void;
  isPlayingAudio?: boolean;
  lastAssistantReply?: string;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  selectedLanguage,
  selectedDialect,
  isOfflineMode,
  onSendMessage,
  isProcessing,
  onSpeakResponse,
  onStopAudio,
  isPlayingAudio = false,
  lastAssistantReply,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const bcp47Map: Record<SupportedLanguage, string> = {
    hi: 'hi-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    pa: 'pa-IN',
    gu: 'gu-IN',
    or: 'or-IN',
    kn: 'kn-IN',
    en: 'en-IN',
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = bcp47Map[selectedLanguage] || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(`Speech notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      if (transcript.trim()) {
        onSendMessage(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      setSpeechError(null);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = bcp47Map[selectedLanguage] || 'hi-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSendMessage(transcript);
    setTranscript('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4">
      {/* Top Bar with Icon Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Microphone Action Button */}
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`px-3 py-2 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isListening
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : isProcessing
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-black border-gray-900 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Listening... Click to finish</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Speak Voice</span>
              </>
            )}
          </button>

          {/* Audio Playback Controls with Play and Stop Icons */}
          {lastAssistantReply && onSpeakResponse && (
            <div className="flex items-center gap-1">
              {!isPlayingAudio ? (
                <button
                  onClick={() => onSpeakResponse(lastAssistantReply)}
                  className="px-2.5 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-sm flex items-center gap-1.5 cursor-pointer"
                  title="Listen to Assistant Voice"
                >
                  <Play className="w-3.5 h-3.5 fill-gray-700" />
                  <span>Play Audio</span>
                </button>
              ) : (
                <button
                  onClick={onStopAudio}
                  className="px-2.5 py-2 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-sm flex items-center gap-1.5 cursor-pointer"
                  title="Stop Audio"
                >
                  <Square className="w-3.5 h-3.5 fill-rose-700" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-gray-400" />
          <span>Regional Dialect: {selectedDialect}</span>
        </div>
      </div>

      {speechError && (
        <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-sm">
          {speechError}
        </div>
      )}

      {/* Voice or text input */}
      <form onSubmit={handleManualSubmit} className="mt-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to spoken words...'
                : 'Click "Speak Voice" or type your details here...'
            }
            className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-hidden focus:bg-white focus:border-gray-400"
          />

          <button
            type="submit"
            disabled={!transcript.trim() || isProcessing}
            className={`px-3 py-2 text-xs font-medium rounded-sm border cursor-pointer ${
              !transcript.trim() || isProcessing
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-black text-white border-black'
            }`}
          >
            Process Voice
          </button>
        </div>
      </form>

      {/* Quick Dialect Samples */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-[11px] text-gray-500 mb-1.5 font-medium">
          Quick Dialect Samples (Click to test):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_BENEFICIARY_UTTERANCES.slice(0, 3).map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTranscript(sample.text);
                onSendMessage(sample.text);
              }}
              className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm text-left truncate max-w-xs cursor-pointer"
            >
              <span className="font-semibold mr-1">{sample.dialect}:</span>
              {sample.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
