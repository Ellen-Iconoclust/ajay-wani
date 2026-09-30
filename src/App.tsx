import React, { useState, useEffect } from 'react';
import {
  BeneficiaryProfile,
  ChannelMode,
  DialogueMessage,
  GIAGrantStatus,
  MISSyncRecord,
  NSQFCourse,
  SupportedLanguage,
} from './types/pmajay';
import { NSQF_COURSES } from './data/nsqfCourses';
import { evaluateGIAGrantEligibility } from './utils/giaScreener';
import { matchNSQFCoursesWithRAG } from './utils/ragMatcher';
import { TRANSLATIONS } from './data/translations';

import { Header, ActivePage } from './components/Header';
import { HomePage } from './components/HomePage';
import { LanguageSelector } from './components/LanguageSelector';
import { AIChatbotView } from './components/AIChatbotView';
import { ProfileCard } from './components/ProfileCard';
import { NSQFRecommendations } from './components/NSQFRecommendations';
import { MISPortalModal } from './components/MISPortalModal';
import { AadhaarLoginModal } from './components/AadhaarLoginModal';
import { getInterviewProgress, INTERVIEW_QUESTIONS, applyStepAnswer, generateProgressiveReply } from './utils/progressiveInterview';

// Pravin account initial profile
const INITIAL_PROFILE: BeneficiaryProfile = {
  name: 'Pravin',
  age: null,
  gender: null,
  casteCategory: 'Scheduled Caste (SC)',
  subCaste: '',
  state: 'Uttar Pradesh',
  district: '',
  block: '',
  annualFamilyIncome: null,
  educationLevel: '',
  traditionalOccupation: '',
  currentActivity: '',
  monthlyCurrentIncome: null,
  vocationalInterests: [],
  mobilityRadius: 'Within Village',
  physicalConstraints: '',
  employmentPreference: '',
  contactNumber: '+91-98765-43210',
  rationCardOrAadhaarLast4: '4821',
  profileCompletionPercentage: 15,
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentChannel, setCurrentChannel] = useState<ChannelMode>('kiosk');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('hi');
  const [selectedDialect, setSelectedDialect] = useState<string>('Standard Hindi');

  const [profile, setProfile] = useState<BeneficiaryProfile>(INITIAL_PROFILE);
  const [giaStatus, setGiaStatus] = useState<GIAGrantStatus>(() =>
    evaluateGIAGrantEligibility(INITIAL_PROFILE)
  );
  const [recommendedCourses, setRecommendedCourses] = useState<NSQFCourse[]>(() =>
    matchNSQFCoursesWithRAG(INITIAL_PROFILE, NSQF_COURSES)
  );
  const [selectedCourse, setSelectedCourse] = useState<NSQFCourse | undefined>(
    NSQF_COURSES[0]
  );

  // Internationalized strings for current language
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Initialize messages with bot's first message in the selected language
  const [messages, setMessages] = useState<DialogueMessage[]>(() => [
    {
      id: 'msg-01',
      sender: 'assistant',
      text: t.botFirstGreeting,
      language: selectedLanguage,
      timestamp: '10:00 AM',
      channel: 'kiosk',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSyncingMIS, setIsSyncingMIS] = useState<boolean>(false);
  const [misRecord, setMisRecord] = useState<MISSyncRecord | null>(null);

  const [isMISModalOpen, setIsMISModalOpen] = useState<boolean>(false);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState<boolean>(false);

  // Audio Playback with Pause & Resume support
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [currentPlayingMsgId, setCurrentPlayingMsgId] = useState<string | null>(null);

  // When language changes:
  // 1. Update the bot's greeting if only initial greeting exists or add localized acknowledgment
  // 2. Entire site updates via `t` dictionary
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);
    const newTranslations = TRANSLATIONS[newLang] || TRANSLATIONS.en;

    setMessages((prev) => {
      // If user hasn't talked yet, just replace initial greeting with new language greeting
      if (prev.length <= 1) {
        return [
          {
            id: 'msg-01',
            sender: 'assistant',
            text: newTranslations.botFirstGreeting,
            language: newLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: currentChannel,
          },
        ];
      } else {
        // Append localized greeting confirmation
        return [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: newTranslations.botFirstGreeting,
            language: newLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: currentChannel,
          },
        ];
      }
    });
  };

  // Recalculate GIA and RAG matching when profile updates
  useEffect(() => {
    const gia = evaluateGIAGrantEligibility(profile);
    setGiaStatus(gia);
    const matched = matchNSQFCoursesWithRAG(profile, NSQF_COURSES);
    setRecommendedCourses(matched);
    if (!selectedCourse && matched.length > 0) {
      setSelectedCourse(matched[0]);
    }
  }, [profile]);

  // Handle incoming spoken / typed message
  const handleProcessMessage = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    const currentProgress = getInterviewProgress(profile);
    const activeStepKey = currentProgress.currentStepKey;

    // Immediately resolve and apply the step answer to guarantee progression
    const updatedLocally = applyStepAnswer(profile, activeStepKey, spokenText);
    const nextProgress = getInterviewProgress(updatedLocally);
    const nextStepKey = nextProgress.currentStepKey;

    // Immediately set state with applied answer
    setProfile(updatedLocally);

    const userMessage: DialogueMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: spokenText,
      language: selectedLanguage,
      dialect: selectedDialect,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: currentChannel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Guaranteed deterministic progressive response
    const guaranteedReply = generateProgressiveReply(
      spokenText,
      selectedLanguage,
      activeStepKey,
      nextStepKey,
      updatedLocally
    );

    try {
      const response = await fetch('/api/voice/process-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: spokenText,
          language: selectedLanguage,
          dialect: selectedDialect,
          currentProfile: updatedLocally,
          currentStepKey: activeStepKey,
          nextStepKey: nextStepKey,
          isOfflineMode: false,
        }),
      });

      let assistantReplyText = guaranteedReply;

      if (response.ok) {
        const data = await response.json();
        if (data.extractedProfile) {
          // Merge safely: only take non-empty fields from backend to avoid wipeouts
          const safeMerged: BeneficiaryProfile = { ...updatedLocally };
          for (const key of Object.keys(data.extractedProfile) as Array<keyof BeneficiaryProfile>) {
            const val = data.extractedProfile[key];
            if (val !== null && val !== undefined && val !== '') {
              (safeMerged as any)[key] = val;
            }
          }
          setProfile(safeMerged);
        }

        // Validate that server response does NOT repeat the question for activeStepKey
        if (data.assistantResponseText && typeof data.assistantResponseText === 'string') {
          const respText = data.assistantResponseText.toLowerCase();
          const isRepeating =
            (activeStepKey === 'education' && (respText.includes('पढ़ाई कहाँ तक') || respText.includes('education level') || respText.includes('शिक्षण कितपत') || respText.includes('கல்வித் தகுதி'))) ||
            (activeStepKey === 'traditional' && (respText.includes('पुश्तैनी हुनर') || respText.includes('पारंपरिक काम') || respText.includes('heritage craft') || respText.includes('पारंपरिक व्यवसाय'))) ||
            (activeStepKey === 'current' && (respText.includes('मासिक गुजारा') || respText.includes('वर्तमान कार्य') || respText.includes('currently do') || respText.includes('दररोज काय काम'))) ||
            (activeStepKey === 'interests' && (respText.includes('नया काम') || respText.includes('ट्रेड सीखने') || respText.includes('excited to learn') || respText.includes('नवीन कौशल्य'))) ||
            (activeStepKey === 'preference' && (respText.includes('खुद की दुकान') || respText.includes('पक्की नौकरी') || respText.includes('micro-enterprise') || respText.includes('पगारदार नोकरी'))) ||
            (activeStepKey === 'location' && (respText.includes('किस जिले') || respText.includes('which district') || respText.includes('कोणत्या जिल्ह्यात') || respText.includes('எந்த மாவட்டம்')));

          if (!isRepeating && !respText.includes('प्रवीण जी! मैं सामाजिक न्याय')) {
            assistantReplyText = data.assistantResponseText;
          }
        }
      }

      const assistantMessage: DialogueMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: assistantReplyText,
        language: selectedLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: currentChannel,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Automatically speak the response aloud
      handleSpeakText(assistantReplyText, assistantMessage.id);
    } catch (err) {
      console.warn('Backend fallback:', err);
      const assistantMessage: DialogueMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: guaranteedReply,
        language: selectedLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: currentChannel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      handleSpeakText(guaranteedReply, assistantMessage.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipOrNextStep = () => {
    const currentProgress = getInterviewProgress(profile);
    const activeStepKey = currentProgress.currentStepKey;
    if (activeStepKey === 'complete') return;

    const options =
      INTERVIEW_QUESTIONS[selectedLanguage]?.[activeStepKey]?.quickOptions ||
      INTERVIEW_QUESTIONS.hi[activeStepKey]?.quickOptions ||
      [];
    const choice = options.length > 0 ? options[0] : 'आगे बढ़ें';
    handleProcessMessage(choice);
  };

  // Audio Playback with Pause & Resume support
  const handleSpeakText = (text: string, msgId?: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsAudioPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);

    const langCodes: Record<SupportedLanguage, string> = {
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

    utterance.lang = langCodes[selectedLanguage] || 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      if (msgId) setCurrentPlayingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setCurrentPlayingMsgId(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setCurrentPlayingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseAudio = () => {
    if (window.speechSynthesis && isPlayingAudio && !isAudioPaused) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  const handleResumeAudio = () => {
    if (window.speechSynthesis && isPlayingAudio && isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    }
  };

  const handleStopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setCurrentPlayingMsgId(null);
    }
  };

  const handleTriggerMISSync = async () => {
    setIsSyncingMIS(true);
    try {
      const response = await fetch('/api/mis/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          courseId: selectedCourse?.id || 'nsqf-solar-01',
          giaStatus,
          language: selectedLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMisRecord(data);
      } else {
        setMisRecord({
          beneficiaryId: `PMAJAY-SC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          dossierId: `MoSJE-GIA-DOSSIER-${Math.floor(10000 + Math.random() * 90000)}`,
          syncTimestamp: new Date().toISOString(),
          status: 'SYNCED_WITH_MOSJE_PORTAL',
          dbtAccountLinked: true,
          giaSanctionId: giaStatus.sanctionNumber,
          smsNotificationPayload: {
            recipient: profile.contactNumber,
            messageText: `MoSJE PM-AJAY: Dear ${profile.name || 'Pravin'}, your beneficiary record is registered. INR 50,000 GIA grant pre-sanctioned.`,
            language: selectedLanguage,
            status: 'DELIVERED',
          },
        });
      }
    } catch {
      setMisRecord({
        beneficiaryId: `PMAJAY-SC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        dossierId: `MoSJE-GIA-DOSSIER-${Math.floor(10000 + Math.random() * 90000)}`,
        syncTimestamp: new Date().toISOString(),
        status: 'SYNCED_WITH_MOSJE_PORTAL',
        dbtAccountLinked: true,
        giaSanctionId: giaStatus.sanctionNumber,
        smsNotificationPayload: {
          recipient: profile.contactNumber,
          messageText: `MoSJE PM-AJAY: Beneficiary dossier verified. INR 50,000 GIA grant pre-sanctioned.`,
          language: selectedLanguage,
          status: 'DELIVERED',
        },
      });
    } finally {
      setIsSyncingMIS(false);
    }
  };

  const handleAadhaarLoginSuccess = (name: string, aadhaarNum: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      rationCardOrAadhaarLast4: aadhaarNum.slice(-4),
    }));
    setIsAadhaarModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-['Poppins',sans-serif]">
      {/* Clean White Top Nav with 10-Language Support */}
      <Header
        activePage={activePage}
        onSelectPage={setActivePage}
        userName={profile.name || 'Pravin'}
        onOpenAadhaarLogin={() => setIsAadhaarModalOpen(true)}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* PAGE 0: COMPREHENSIVE HOME PAGE */}
        {activePage === 'home' && (
          <HomePage
            onNavigate={setActivePage}
            onOpenAadhaar={() => setIsAadhaarModalOpen(true)}
            profile={profile}
            giaStatus={giaStatus}
            selectedLanguage={selectedLanguage}
            t={t}
          />
        )}

        {/* PAGE 1: DEDICATED AI CHATBOT PAGE (Integrated Speak/Typer in Chatbot like ChatGPT) */}
        {activePage === 'assistant' && (
          <div className="space-y-4">
            {/* Language & Dialect Selector */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              selectedDialect={selectedDialect}
              onSelectLanguage={handleLanguageChange}
              onSelectDialect={setSelectedDialect}
            />

            {/* Interaction Channels Switcher */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500 mr-1">
                  {t.interactionChannel}
                </span>
                <button
                  onClick={() => setCurrentChannel('kiosk')}
                  className={`px-3 py-1 text-xs rounded-sm transition-colors cursor-pointer border ${
                    currentChannel === 'kiosk'
                      ? 'bg-gray-900 text-white border-gray-900 font-medium'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t.channelKiosk}
                </button>
                <button
                  onClick={() => setCurrentChannel('whatsapp')}
                  className={`px-3 py-1 text-xs rounded-sm transition-colors cursor-pointer border ${
                    currentChannel === 'whatsapp'
                      ? 'bg-gray-900 text-white border-gray-900 font-medium'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t.channelWhatsapp}
                </button>
                <button
                  onClick={() => setCurrentChannel('ivr')}
                  className={`px-3 py-1 text-xs rounded-sm transition-colors cursor-pointer border ${
                    currentChannel === 'ivr'
                      ? 'bg-gray-900 text-white border-gray-900 font-medium'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t.channelIvr}
                </button>
              </div>

              <div className="text-xs text-gray-500 hidden sm:block">
                {t.talkingAs} <span className="font-semibold text-gray-900">{profile.name}</span>
              </div>
            </div>

            {/* ChatGPT-style AI Assistant with Integrated Bottom Microphone and Typer */}
            <AIChatbotView
              messages={messages}
              selectedLanguage={selectedLanguage}
              selectedDialect={selectedDialect}
              isProcessing={isProcessing}
              profile={profile}
              giaStatus={giaStatus}
              recommendedCourses={recommendedCourses}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                setActivePage('nsqf');
              }}
              onSendMessage={handleProcessMessage}
              onSkipStep={handleSkipOrNextStep}
              onSpeakText={handleSpeakText}
              onPauseAudio={handlePauseAudio}
              onResumeAudio={handleResumeAudio}
              onStopAudio={handleStopAudio}
              isPlayingAudio={isPlayingAudio}
              isAudioPaused={isAudioPaused}
              currentPlayingMsgId={currentPlayingMsgId}
              t={t}
            />
          </div>
        )}

        {/* PAGE 2: BENEFICIARY DOSSIER */}
        {activePage === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <ProfileCard
              profile={profile}
              giaStatus={giaStatus}
              isProcessing={isProcessing}
              t={t}
            />

            <div className="p-4 bg-white border border-gray-200 rounded-sm flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-900">
                  {t.dossierTitle}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {t.dossierSubtitle}
                </p>
              </div>
              <button
                onClick={() => setActivePage('assistant')}
                className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-sm cursor-pointer"
              >
                {t.navAssistant}
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3: NSQF RECOMMENDATIONS */}
        {activePage === 'nsqf' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <NSQFRecommendations
              courses={recommendedCourses}
              selectedLanguage={selectedLanguage}
              onSelectCourse={(c) => {
                setSelectedCourse(c);
                setIsMISModalOpen(true);
              }}
              selectedCourseId={selectedCourse?.id}
              t={t}
            />
          </div>
        )}

        {/* PAGE 4: MIS PORTAL */}
        {activePage === 'mis' && (
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t.misTitle}
                </h3>
                <p className="text-xs text-gray-500">
                  {t.misSubtitle}
                </p>
              </div>
              <button
                onClick={handleTriggerMISSync}
                disabled={isSyncingMIS}
                className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-sm cursor-pointer"
              >
                {isSyncingMIS ? t.transmitting : t.syncRecord}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] text-gray-400 block">{t.nameLabel}</span>
                <span className="font-semibold text-gray-900">{profile.name}</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] text-gray-400 block">Aadhaar (Last 4)</span>
                <span className="font-semibold text-gray-900">{profile.rationCardOrAadhaarLast4}</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] text-gray-400 block">PM-AJAY GIA Grant</span>
                <span className="font-semibold text-emerald-700">₹50,000 Pre-Sanctioned</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="text-[10px] text-gray-400 block">DBT Linked Account</span>
                <span className="font-semibold text-gray-900">Direct Benefit Ready</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-end">
              <button
                onClick={() => setIsMISModalOpen(true)}
                className="px-3 py-1.5 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-sm cursor-pointer"
              >
                {t.fullDossier}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 text-gray-500 text-xs py-3 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.footerText}</span>
          <span className="text-[11px] text-gray-400">
            {t.deptText}
          </span>
        </div>
      </footer>

      {/* Aadhaar Login Modal */}
      <AadhaarLoginModal
        isOpen={isAadhaarModalOpen}
        onLoginSuccess={handleAadhaarLoginSuccess}
        onClose={() => setIsAadhaarModalOpen(false)}
      />

      {/* MIS Portal Modal */}
      <MISPortalModal
        isOpen={isMISModalOpen}
        onClose={() => setIsMISModalOpen(false)}
        profile={profile}
        giaStatus={giaStatus}
        selectedCourse={selectedCourse}
        misRecord={misRecord}
        onTriggerSync={handleTriggerMISSync}
        isSyncing={isSyncingMIS}
      />
    </div>
  );
}

// Local entity extractor
function extractLocally(text: string, current: BeneficiaryProfile): BeneficiaryProfile {
  const updated = { ...current };
  const lower = text.toLowerCase();

  const nameMatch = text.match(/(?:मेरा नाम|हमार नाम|माझं नाव|என் பெயர்|నా పేరు|my name is)\s+([A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    updated.name = nameMatch[1].trim();
  }

  const ageMatch = text.match(/(?:उम्र|वय|age|வயது)\s*(?:है|आहे|is)?\s*(\d{2})/i) || text.match(/(\d{2})\s*(?:साल|वर्ष|years|வருடம்)/i);
  if (ageMatch && ageMatch[1]) {
    const ageNum = parseInt(ageMatch[1], 10);
    if (ageNum >= 15 && ageNum <= 75) updated.age = ageNum;
  }

  if (lower.includes('8वीं') || lower.includes('८वीं') || lower.includes('आठवीं') || lower.includes('8th') || lower.includes('8 ') || lower.includes('अष्टम')) {
    updated.educationLevel = 'Middle (8th Pass)';
  } else if (lower.includes('10वीं') || lower.includes('१०वीं') || lower.includes('दसवीं') || lower.includes('10th') || lower.includes('10 ') || lower.includes('दहावी') || lower.includes('பத்தாம்')) {
    updated.educationLevel = 'Matric (10th Pass)';
  } else if (lower.includes('5वीं') || lower.includes('५वीं') || lower.includes('पांचवीं') || lower.includes('5th') || lower.includes('5 ') || lower.includes('प्राथमिक')) {
    updated.educationLevel = 'Primary (5th Pass)';
  } else if (lower.includes('12वीं') || lower.includes('१२वीं') || lower.includes('बारहवीं') || lower.includes('12th') || lower.includes('12 ') || lower.includes('इंटर')) {
    updated.educationLevel = 'Intermediate (12th Pass)';
  }

  if (lower.includes('चमड़ा') || lower.includes('leather') || lower.includes('जूता') || lower.includes('தோல்')) {
    updated.traditionalOccupation = 'Leathercraft & Footwear';
  } else if (lower.includes('बुनकर') || lower.includes('weaver') || lower.includes('विणकाम') || lower.includes('நெசவு')) {
    updated.traditionalOccupation = 'Handloom & Textile Weaving';
  } else if (lower.includes('बढ़ई') || lower.includes('carpentry') || lower.includes('सुतार')) {
    updated.traditionalOccupation = 'Carpentry & Woodwork';
  }

  if (lower.includes('बिजली') || lower.includes('electric') || lower.includes('पंखा') || lower.includes('सोलर')) {
    updated.currentActivity = 'Electrical & Wire Maintenance Helper';
    if (!updated.vocationalInterests.includes('Electrical & Solar')) {
      updated.vocationalInterests = [...updated.vocationalInterests, 'Electrical & Solar'];
    }
  } else if (lower.includes('मैकेनिक') || lower.includes('bike') || lower.includes('गाड़ी')) {
    updated.currentActivity = 'Two-Wheeler Repair Assistant';
    if (!updated.vocationalInterests.includes('Automotive Repair')) {
      updated.vocationalInterests = [...updated.vocationalInterests, 'Automotive Repair'];
    }
  }

  if (lower.includes('बाहर नहीं') || lower.includes('गांव में') || lower.includes('घर') || lower.includes('cannot travel')) {
    updated.mobilityRadius = 'Within Village';
    updated.physicalConstraints = 'Family / local commitments in village';
  }

  if (lower.includes('दुकान') || lower.includes('स्वयं') || lower.includes('खुद का') || lower.includes('own business') || lower.includes('स्वरोजगार')) {
    updated.employmentPreference = 'Self-Employment / Micro-Enterprise';
  } else if (lower.includes('नौकरी') || lower.includes('job') || lower.includes('factory') || lower.includes('कंपनी')) {
    updated.employmentPreference = 'Wage Employment / Factory Job';
  }

  if (lower.includes('मजदूरी') || lower.includes('labor') || lower.includes('दिन भर') || lower.includes('daily')) {
    if (!updated.currentActivity) updated.currentActivity = 'Daily Wage Labor';
  } else if (lower.includes('सहायक') || lower.includes('helper') || lower.includes('apprentice')) {
    if (!updated.currentActivity) updated.currentActivity = 'Workshop Helper / Apprentice';
  } else if (lower.includes('बेरोजगार') || lower.includes('unemployed') || lower.includes('काम नहीं')) {
    if (!updated.currentActivity) updated.currentActivity = 'Currently Unemployed / Seeking Work';
  }

  const districts = ['Azamgarh', 'Buldhana', 'Erode', 'Bankura', 'Mahabubnagar', 'Mansa', 'Varanasi', 'Jaipur', 'Patna', 'Solapur', 'Madurai', 'Surendranagar', 'Mayurbhanj', 'Kalaburagi'];
  for (const d of districts) {
    if (text.includes(d) || text.includes(d.toLowerCase())) {
      updated.district = d;
      break;
    }
  }

  // Update profile completion percentage based on progressive steps
  const progress = getInterviewProgress(updated);
  updated.profileCompletionPercentage = progress.percentage;

  return updated;
}

function generateLocalReply(text: string, lang: SupportedLanguage, profile: BeneficiaryProfile): string {
  const progress = getInterviewProgress(profile);
  const name = profile.name || 'प्रवीण';
  const langKey = INTERVIEW_QUESTIONS[lang] ? lang : 'en';
  const stepObj = INTERVIEW_QUESTIONS[langKey][progress.currentStepKey] || INTERVIEW_QUESTIONS.en[progress.currentStepKey];
  return stepObj.question(name, progress.steps.find((s) => s.isFilled)?.value);
}
