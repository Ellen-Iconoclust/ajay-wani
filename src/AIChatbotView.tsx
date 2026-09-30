import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Square, Mic, MicOff, Send, CheckCircle2, Circle, Sparkles, Award } from 'lucide-react';
import { DialogueMessage, SupportedLanguage, BeneficiaryProfile, GIAGrantStatus, NSQFCourse } from '../types/pmajay';
import { TranslationStrings } from '../data/translations';
import { getInterviewProgress, INTERVIEW_QUESTIONS } from '../utils/progressiveInterview';

interface AIChatbotViewProps {
  messages: DialogueMessage[];
  selectedLanguage: SupportedLanguage;
  selectedDialect: string;
  isProcessing: boolean;
  profile: BeneficiaryProfile;
  giaStatus?: GIAGrantStatus;
  recommendedCourses?: NSQFCourse[];
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string, msgId?: string) => void;
  onPauseAudio: () => void;
  onResumeAudio: () => void;
  onStopAudio: () => void;
  onSelectCourse?: (course: NSQFCourse) => void;
  onSkipStep?: () => void;
  isPlayingAudio: boolean;
  isAudioPaused: boolean;
  currentPlayingMsgId?: string | null;
  t: TranslationStrings;
}

export const AIChatbotView: React.FC<AIChatbotViewProps> = ({
  messages,
  selectedLanguage,
  selectedDialect,
  isProcessing,
  profile,
  giaStatus,
  recommendedCourses = [],
  onSendMessage,
  onSpeakText,
  onPauseAudio,
  onResumeAudio,
  onStopAudio,
  onSelectCourse,
  onSkipStep,
  isPlayingAudio,
  isAudioPaused,
  currentPlayingMsgId,
  t,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const progress = getInterviewProgress(profile);

  // Dynamic suggested prompts based on the current missing step
  const currentStepInfo =
    INTERVIEW_QUESTIONS[selectedLanguage]?.[progress.currentStepKey] ||
    INTERVIEW_QUESTIONS.en[progress.currentStepKey] ||
    INTERVIEW_QUESTIONS.hi[progress.currentStepKey];

  const suggestedOptions = currentStepInfo?.quickOptions || t.suggestedPrompts;

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

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
        setInputText(currentTranscript);
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
      if (inputText.trim()) {
        onSendMessage(inputText);
        setInputText('');
      }
    } else {
      setInputText('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleChipClick = (chipText: string) => {
    onSendMessage(chipText);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-xs flex flex-col h-[660px] overflow-hidden">
      {/* Bot Chat Top Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-gray-900">
                AJAY-Mitra (अजय-मित्र)
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-gray-500">
              {t.appSubtitle} • {selectedDialect}
            </p>
          </div>
        </div>

        {/* Global audio player controller if speaking */}
        {isPlayingAudio && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-sm text-xs">
            <span className="text-[10px] text-gray-500 font-mono font-medium">
              {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
            </span>
            {!isAudioPaused ? (
              <button
                onClick={onPauseAudio}
                className="p-1 hover:bg-gray-200 rounded-xs cursor-pointer text-gray-700"
                title={t.pauseAudio}
              >
                <Pause className="w-3.5 h-3.5 fill-gray-700" />
              </button>
            ) : (
              <button
                onClick={onResumeAudio}
                className="p-1 hover:bg-gray-200 rounded-xs cursor-pointer text-gray-700"
                title={t.resumeAudio}
              >
                <Play className="w-3.5 h-3.5 fill-gray-700" />
              </button>
            )}
            <button
              onClick={onStopAudio}
              className="p-1 hover:bg-gray-200 rounded-xs cursor-pointer text-rose-600"
              title={t.stopAudio}
            >
              <Square className="w-3.5 h-3.5 fill-rose-600" />
            </button>
          </div>
        )}
      </div>

      {/* Progressive Profiling Progress Bar & Step Tracker */}
      <div className="bg-gray-50/90 border-b border-gray-200 px-4 py-2.5 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-[11px]">
              Livelihood Details Gathered:
            </span>
            <span className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-1.5 py-0.2 rounded-xs">
              {progress.completedSteps} of {progress.totalSteps} ({progress.percentage}%)
            </span>
          </div>
          <span className="text-[10px] text-gray-500">
            {progress.isComplete ? '✓ Ready for Recommendations' : 'Asking step-by-step before recommending'}
          </span>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              progress.isComplete ? 'bg-emerald-600' : 'bg-gray-900'
            }`}
            style={{ width: `${Math.max(progress.percentage, 10)}%` }}
          />
        </div>

        {/* 6 Step Interactive Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pt-0.5">
          {progress.steps.map((s, idx) => {
            const isCurrent = progress.currentStepKey === s.key;
            const stepNames: Record<string, string> = {
              education: selectedLanguage === 'hi' ? 'शिक्षा' : 'Education',
              traditional: selectedLanguage === 'hi' ? 'पुश्तैनी हुनर' : 'Family Craft',
              current: selectedLanguage === 'hi' ? 'वर्तमान कार्य' : 'Current Work',
              interests: selectedLanguage === 'hi' ? 'ट्रेड रुचि' : 'Interests',
              preference: selectedLanguage === 'hi' ? 'रोजगार प्रकार' : 'Preference',
              location: selectedLanguage === 'hi' ? 'जिला/स्थान' : 'Location',
            };
            const label = stepNames[s.key] || s.key;

            return (
              <div
                key={s.key}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-xs border whitespace-nowrap transition-colors ${
                  s.isFilled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                    : isCurrent
                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold ring-1 ring-amber-300'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {s.isFilled ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className={`w-2.5 h-2.5 shrink-0 ${isCurrent ? 'text-amber-600 fill-amber-500' : 'text-gray-400'}`} />
                )}
                <span>
                  {idx + 1}. {label}: {s.value ? s.value.slice(0, 16) : 'लंबित'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThisMsgPlaying = isPlayingAudio && currentPlayingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-gray-400 mb-1">
                {isUser ? profile.name : 'AJAY-Mitra'} • {msg.timestamp}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-sm text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Inline Voice Player for Bot Messages */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">
                      {isThisMsgPlaying ? (isAudioPaused ? 'Audio Paused' : 'Playing...') : 'Spoken Voice'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isThisMsgPlaying ? (
                        <button
                          onClick={() => onSpeakText(msg.text, msg.id)}
                          className="px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xs text-[11px] text-gray-700 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Play className="w-3 h-3 fill-gray-700" />
                          <span>{t.playAudio}</span>
                        </button>
                      ) : (
                        <>
                          {!isAudioPaused ? (
                            <button
                              onClick={onPauseAudio}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xs text-[11px] text-amber-800 flex items-center gap-1 cursor-pointer"
                              title={t.pauseAudio}
                            >
                              <Pause className="w-3 h-3 fill-amber-800" />
                              <span>{t.pauseAudio}</span>
                            </button>
                          ) : (
                            <button
                              onClick={onResumeAudio}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xs text-[11px] text-emerald-800 flex items-center gap-1 cursor-pointer"
                              title={t.resumeAudio}
                            >
                              <Play className="w-3 h-3 fill-emerald-800" />
                              <span>{t.resumeAudio}</span>
                            </button>
                          )}
                          <button
                            onClick={onStopAudio}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xs text-[11px] text-rose-700 flex items-center gap-1 cursor-pointer"
                            title={t.stopAudio}
                          >
                            <Square className="w-3 h-3 fill-rose-700" />
                            <span>{t.stopAudio}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* When profile reaches completion, show an inline celebration card */}
        {progress.isComplete && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 text-xs space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Livelihood Mapping Complete for {profile.name}!</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-normal">
              Based on your verified Scheduled Caste status, education ({profile.educationLevel || '8th Pass'}), traditional background ({profile.traditionalOccupation || 'Handicrafts'}), and preference for {profile.employmentPreference || 'Self-Employment'}, you are pre-qualified for the <strong>PM-AJAY GIA ₹50,000 Capital Grant</strong>.
            </p>

            {/* Quick Recommended Courses Inline Preview */}
            {recommendedCourses.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide">
                  Top Recommended NSQF Skilling Trades:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedCourses.slice(0, 2).map((course) => (
                    <div
                      key={course.id}
                      onClick={() => onSelectCourse?.(course)}
                      className="p-2.5 bg-white border border-emerald-200 rounded-xs hover:border-emerald-400 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-xs truncate">
                          {course.title}
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xs font-bold">
                          NSQF L{course.nsqfLevel}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {course.sector} • ₹50k GIA Toolkit
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] text-gray-400 mb-1">{t.thinking}</div>
            <div className="bg-white border border-gray-200 p-3 rounded-sm text-xs text-gray-500 shadow-2xs">
              <span className="animate-pulse">{t.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {speechError && (
        <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-800 text-[11px]">
          {speechError}
        </div>
      )}

      {/* Suggested Quick Options for the Current Step */}
      <div className="px-4 py-2 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0">
          <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap shrink-0">
            {progress.isComplete ? 'Next Actions:' : `त्वरित विकल्प (${progress.currentStepKey}):`}
          </span>
          <div className="flex gap-1.5 overflow-x-auto">
            {suggestedOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(opt)}
                disabled={isProcessing}
                className="text-[11px] bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 hover:border-gray-400 px-2.5 py-1 rounded-xs whitespace-nowrap cursor-pointer transition-colors shadow-2xs font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Skip / Next Question Button so user is NEVER stuck */}
        {!progress.isComplete && onSkipStep && (
          <button
            type="button"
            onClick={onSkipStep}
            disabled={isProcessing}
            className="text-[11px] bg-gray-900 hover:bg-black text-white px-2.5 py-1 rounded-xs whitespace-nowrap cursor-pointer font-medium shrink-0 flex items-center gap-1 shadow-2xs"
            title="Next Step"
          >
            <span>अगला प्रश्न ➔</span>
          </button>
        )}
      </div>

      {/* Integrated ChatGPT-style Bottom Bar (Microphone Speak Button + Typer + Send Button) */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
      >
        {/* Speak Voice Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`p-2.5 rounded-sm border transition-colors flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
          }`}
          title={isListening ? t.listening : t.speakVoice}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-rose-600" />
          ) : (
            <Mic className="w-4 h-4 text-gray-700" />
          )}
        </button>

        {/* Input Text Box */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? t.listening : t.chatPlaceholder}
          className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-hidden focus:bg-white focus:border-gray-400 text-gray-900"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className={`p-2.5 rounded-sm border flex items-center justify-center cursor-pointer transition-colors ${
            !inputText.trim() || isProcessing
              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-black text-white border-gray-900'
          }`}
          title={t.processVoice}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
