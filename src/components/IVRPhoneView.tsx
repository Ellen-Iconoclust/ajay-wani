import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Play, Square } from 'lucide-react';
import { DialogueMessage, SupportedLanguage, GIAGrantStatus, NSQFCourse } from '../types/pmajay';

interface IVRPhoneViewProps {
  messages: DialogueMessage[];
  selectedLanguage: SupportedLanguage;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  giaStatus: GIAGrantStatus;
  recommendedCourses: NSQFCourse[];
  isProcessing: boolean;
}

export const IVRPhoneView: React.FC<IVRPhoneViewProps> = ({
  messages,
  selectedLanguage,
  onSendMessage,
  onSpeakText,
  giaStatus,
  recommendedCourses,
  isProcessing,
}) => {
  const [callActive, setCallActive] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(24);
  const [dialedDigits, setDialedDigits] = useState<string>('1800-11-2529');

  useEffect(() => {
    let interval: any;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (key: string) => {
    setDialedDigits((prev) => prev + key);
    if (key === '1') {
      onSendMessage('मैंने फोन पर 1 दबाया है, मुझे हिंदी में सिलाई और गारमेंट ट्रेनिंग चाहिए।');
    } else if (key === '2') {
      onSendMessage('मैंने फोन पर 2 दबाया है, मुझे सोलर पैनल और विद्युत उपकरण रिपेयर की जानकारी चाहिए।');
    } else if (key === '3') {
      onSendMessage('मैंने 3 दबाया है, मुझे ₹50,000 की सरकारी अनुदान सहायता कैसे मिलेगी?');
    }
  };

  const toggleCall = () => {
    if (callActive) {
      setCallActive(false);
    } else {
      setCallActive(true);
      setCallDuration(0);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row gap-4 h-[560px]">
      {/* Phone Simulator Left Column */}
      <div className="w-full md:w-64 bg-gray-50 border border-gray-200 p-3 rounded-sm flex flex-col justify-between">
        {/* Phone Top Display */}
        <div className="bg-white p-3 rounded-sm border border-gray-200 text-center">
          <div className="text-[10px] text-gray-500 uppercase">
            {callActive ? 'Toll-Free Call Connected' : 'Call Ended'}
          </div>
          <div className="text-sm font-semibold tracking-wider text-gray-900 mt-0.5">
            {dialedDigits}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {callActive ? formatTimer(callDuration) : 'Disconnected'}
          </div>
        </div>

        {/* DTMF Keypad Grid */}
        <div className="grid grid-cols-3 gap-1.5 my-3">
          {[
            { num: '1', sub: 'HINDI' },
            { num: '2', sub: 'SOLAR' },
            { num: '3', sub: 'GRANT' },
            { num: '4', sub: 'GHI' },
            { num: '5', sub: 'JKL' },
            { num: '6', sub: 'MNO' },
            { num: '7', sub: 'PQRS' },
            { num: '8', sub: 'TUV' },
            { num: '9', sub: 'AGENT' },
            { num: '*', sub: '' },
            { num: '0', sub: '+' },
            { num: '#', sub: '' },
          ].map((k) => (
            <button
              key={k.num}
              onClick={() => handleKeyPress(k.num)}
              disabled={!callActive}
              className="bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-200 p-2 rounded-xs text-center cursor-pointer transition-colors"
            >
              <span className="block text-xs font-semibold text-gray-900">{k.num}</span>
              <span className="block text-[8px] text-gray-400">{k.sub}</span>
            </button>
          ))}
        </div>

        {/* Call Toggle Button */}
        <button
          onClick={toggleCall}
          className={`w-full py-2 text-xs font-semibold rounded-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
            callActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {callActive ? (
            <>
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Hang Up Call</span>
            </>
          ) : (
            <>
              <Phone className="w-3.5 h-3.5" />
              <span>Dial 1800-PM-AJAY</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Audio Transcript */}
      <div className="flex-1 flex flex-col bg-gray-50/50 border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-gray-200 text-xs">
          <span className="font-semibold text-gray-800">
            IVR Phone Dialogue Transcript
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            Demo Simulator (Web Speech API)
          </span>
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
          <div className="bg-blue-50/60 border border-blue-100 p-2 rounded-sm text-xs text-blue-900">
            IVR Automated Prompt: "Welcome to Ministry of Social Justice PM-AJAY Livelihood Voice Portal. Press 1 for Hindi, Press 2 for Solar/Electrician, Press 3 to check your ₹50,000 GIA grant status, or speak naturally."
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`p-2.5 rounded-sm text-xs leading-relaxed border ${
                  isUser
                    ? 'bg-white text-gray-900 border-gray-200 ml-4'
                    : 'bg-emerald-50/60 text-gray-900 border-emerald-100 mr-4'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 border-b border-gray-100 pb-1">
                  <span>{isUser ? 'Caller Audio' : 'IVR Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
                {!isUser && (
                  <button
                    onClick={() => onSpeakText(msg.text)}
                    className="mt-1.5 text-[11px] text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-gray-700" />
                    <span>Play Prompt Audio</span>
                  </button>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="p-2 text-xs text-gray-400 italic">
              Processing telephone audio stream...
            </div>
          )}
        </div>

        {/* Quick Speak */}
        <div className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
          <span className="text-[10px] text-gray-400 whitespace-nowrap">Voice Prompts:</span>
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => onSendMessage('गाँव में बिजली का काम करने के लिए क्या मुझे औजार और ₹50,000 की ग्रांट मिलेगी?')}
              className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm cursor-pointer whitespace-nowrap"
            >
              Inquire Grant & Toolkit
            </button>
            <button
              onClick={() => onSendMessage('नजदीकी कौशल प्रशिक्षण केंद्र कहाँ है?')}
              className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm cursor-pointer whitespace-nowrap"
            >
              Find Nearest Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
