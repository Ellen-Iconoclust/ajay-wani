import React, { useRef, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { DialogueMessage, SupportedLanguage, NSQFCourse, GIAGrantStatus } from '../types/pmajay';

interface WhatsAppViewProps {
  messages: DialogueMessage[];
  selectedLanguage: SupportedLanguage;
  isProcessing: boolean;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  recommendedCourses: NSQFCourse[];
  giaStatus: GIAGrantStatus;
  onSelectCourse: (course: NSQFCourse) => void;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  messages,
  selectedLanguage,
  isProcessing,
  onSendMessage,
  onSpeakText,
  recommendedCourses,
  giaStatus,
  onSelectCourse,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  return (
    <div className="bg-white border border-gray-200 rounded-sm flex flex-col h-[560px]">
      {/* WhatsApp Header - Clean & Minimal */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-semibold text-gray-900">
              PM-AJAY WhatsApp Voice Helpline
            </h3>
          </div>
          <p className="text-[11px] text-gray-500">
            Voice-notes interface for low digital literacy beneficiaries
          </p>
        </div>
      </div>

      {/* WhatsApp Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-sm text-xs ${
                  isUser
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-100'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 pb-1 mb-1.5 border-b border-gray-100">
                  <span>{isUser ? 'Voice Note (Beneficiary)' : 'AJAY-Mitra Voice Note'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Audio Play Button */}
                <div className="flex items-center gap-2 py-1 mb-1.5 bg-gray-50 px-2 rounded-xs border border-gray-100">
                  <button
                    onClick={() => onSpeakText(msg.text)}
                    className="p-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-full cursor-pointer"
                    title="Play Audio"
                  >
                    <Play className="w-3 h-3 fill-gray-800 text-gray-800" />
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-gray-500 rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">0:24</span>
                </div>

                <p className="mt-1">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="text-xs text-gray-400 italic">
            AJAY-Mitra is transcribing voice note...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
        <span className="text-[10px] text-gray-400 whitespace-nowrap">Suggested:</span>
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => onSendMessage('गाँव में ही दुकान खोलने के लिए कौन सा कोर्स सबसे अच्छा रहेगा?')}
            className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm whitespace-nowrap cursor-pointer"
          >
            Local Shop Options
          </button>
          <button
            onClick={() => onSendMessage('मुझे ₹50,000 की ग्रांट कब तक मिल जाएगी?')}
            className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm whitespace-nowrap cursor-pointer"
          >
            Grant Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
