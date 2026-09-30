import React, { useRef, useEffect } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';
import { DialogueMessage, SupportedLanguage } from '../types/pmajay';

interface CSCKioskViewProps {
  messages: DialogueMessage[];
  selectedLanguage: SupportedLanguage;
  selectedDialect: string;
  isProcessing: boolean;
  onSendSuggestedPrompt: (prompt: string) => void;
  onSpeakText: (text: string) => void;
  onStopAudio?: () => void;
  isPlayingAudio?: boolean;
}

export const CSCKioskView: React.FC<CSCKioskViewProps> = ({
  messages,
  selectedLanguage,
  isProcessing,
  onSendSuggestedPrompt,
  onSpeakText,
  onStopAudio,
  isPlayingAudio,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const suggestedPrompts: Record<SupportedLanguage, string[]> = {
    hi: [
      'हमारे परिवार में चमड़े का काम होता था, मैं अपनी दुकान खोलना चाहता हूँ।',
      'गाँव में रहकर बिजली और सोलर पंप का काम कैसे शुरू करूँ?',
      'मेरी उम्र 26 साल है और 8वीं पास हूँ, क्या ₹50,000 की अनुदान सहायता मिलेगी?'
    ],
    mr: [
      'आमच्या कुटुंबात विणकाम होते, मला सौर ऊर्जा तंत्रज्ञान शिकायचे आहे.',
      'मी दहावी पास आहे, स्वतःचा वर्कशॉप सुरू करण्यासाठी अनुदान हवे आहे.',
      'माझ्या घरात वृद्ध आई आहे, गावातच राहून काय व्यवसाय करता येईल?'
    ],
    ta: [
      'என் குடும்பத்தில் பாரம்பரிய நெசவுத் தொழில் இருந்தது, நான் இருசக்கர வாகன மெக்கானிக் ஆக விரும்புகிறேன்.',
      'பத்தாம் வகுப்பு படித்துள்ளேன், கிராமத்திலேயே தொழில் செய்ய ரூ. 50,000 மானியம் கிடைக்குமா?',
      'மொபைல் போன் பழுதுபார்க்கும் பயிற்சி எங்கு கிடைக்கும்?'
    ],
    te: [
      'మా పూర్వీకులు తోలు వస్తువులు చేసేవారు, నేను ఎలక్ట్రికల్ మరమ్మతు నేర్చుకోవాలనుకుంటున్నాను.',
      'పదవ తరగతి చదివాను, గ్రామంలోనే ఉంటూ ₹50,000 గ్రాంట్ ఎలా పొందాలి?',
      'వ్యవసాయ ఆధారిత స్వయం ఉపాధి కోర్సులు ఏవి ఉన్నాయి?'
    ],
    bn: [
      'আমাদের বংশে তাঁত বোনার কাজ ছিল, আমি এখন আধুনিক কাঠের কাজের প্রশিক্ষণ চাই।',
      'অষ্টম পাশ করেছি, গ্রামে থেকে স্বনির্ভর ব্যবসার জন্য কি অনুদান পাব?',
      'সৌর প্যানেল ইনস্টলেশন কোর্স কিভাবে করা যায়?'
    ],
    pa: [
      'ਪਰਿਵਾਰ ਵਿੱਚ ਚਮੜੇ ਦਾ ਕੰਮ ਸੀ, ਹੁਣ ਮੈਂ ਟਰੈਕਟਰ ਮੁਰੰਮਤ ਵਰਕਸ਼ਾਪ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।',
      'ਦਸਵੀਂ ਪਾਸ ਹਾਂ, ਪਿੰਡ ਵਿੱਚ ਮੋਬਾਈਲ ਸਰਵਿਸ ਲਈ 50 ਹਜ਼ਾਰ ਦੀ ਗ੍ਰਾਂਟ ਮਿਲੇਗੀ?',
      'ਖੇਤੀਬਾੜੀ ਡਰੋਨ ਚਲਾਉਣ ਦੀ ਸਿਖਲਾਈ ਕਿਵੇਂ ਮਿਲੇਗੀ?'
    ],
    gu: [
      'અમારા પરિવારમાં પરંપરાગત કારીગરી હતી, હું સોલર ટેકનિશિયન બનવા માંગુ છું.',
      'આઠમું પાસ છું, ગામમાં જ દુકાન શરૂ કરવા માટે ₹50,000 ગ્રાન્ટ કઈ રીતે મળે?',
      'ઇલેક્ટ્રિકલ રિપેરિંગ માટે નજીકનું ટ્રેનિંગ સેન્ટર ક્યાં છે?'
    ],
    or: [
      'ଆମ ପରିବାରରେ ପାରମ୍ପରିକ କାମ ଥିଲା, ମୁଁ ଏବେ ବିଦ୍ୟୁତ ଉପକରଣ ମରାମତି ଶିଖିବାକୁ ଚାହେଁ।',
      'ଅଷ୍ଟମ ପାସ୍ ପରେ ଗ୍ରାମରେ ବ୍ୟବସାୟ ପାଇଁ ₹୫୦,୦୦୦ ଅନୁଦାନ ମିଳିବ କି?',
      'ସୌର ଶକ୍ତି ସ୍ଥାପନ ତାଲିମ କିପରି ମିଳିବ?'
    ],
    kn: [
      'ನಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಕಸುಬು ಇತ್ತು, ನಾನು ವಿದ್ಯುತ್ ಉಪಕರಣ ದುರಸ್ತಿ ಕಲಿಯಲು ಬಯಸುತ್ತೇನೆ.',
      'ಹತ್ತನೇ ತರಗತಿ ಉತ್ತೀರ್ಣನಾಗಿದ್ದೇನೆ, ಗ್ರಾಮದಲ್ಲೇ ಸ್ವಯಂ ಉದ್ಯೋಗಕ್ಕೆ ₹50,000 ಅನುದಾನ ಸಿಗುತ್ತದೆಯೇ?',
      'ಸೌರ ಶಕ್ತಿ ತಂತ್ರಜ್ಞ ಕೋರ್ಸ್ ವಿವರ ತಿಳಿಸಿ.'
    ],
    en: [
      'My family had a traditional leathercraft background; I want to start an electrical repair shop.',
      'I am 8th pass and cannot leave my native village due to family care. How can I get the ₹50,000 grant?',
      'Tell me about solar PV installer training opportunities near my district.'
    ]
  };

  const currentPrompts = suggestedPrompts[selectedLanguage] || suggestedPrompts.en;

  return (
    <div className="bg-white border border-gray-200 rounded-sm flex flex-col h-[560px]">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-900">
            Voice Conversation with AJAY-Mitra
          </h3>
          <p className="text-[11px] text-gray-500">
            Speak naturally about your education, background, and work preferences
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-gray-400 mb-1">
                {isUser ? 'You' : 'AJAY-Mitra'} • {msg.timestamp}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-sm text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>

                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Audio playback</span>
                    <button
                      onClick={() => onSpeakText(msg.text)}
                      className="text-[11px] text-gray-700 hover:text-black font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-gray-700" />
                      <span>Play Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] text-gray-400 mb-1">AJAY-Mitra is thinking...</div>
            <div className="bg-white border border-gray-200 p-3 rounded-sm text-xs text-gray-500">
              Analyzing spoken statement and screening GIA grant options...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Spoken Phrases */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="text-[10px] font-medium text-gray-500 mb-1.5">
          Suggested responses (click to speak):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendSuggestedPrompt(prompt)}
              className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-sm text-left truncate max-w-sm cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
