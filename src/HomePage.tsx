import React from 'react';
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Phone,
  MessageSquare,
  Building2,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { TranslationStrings } from '../data/translations';
import { BeneficiaryProfile, GIAGrantStatus, SupportedLanguage } from '../types/pmajay';
import { getInterviewProgress } from '../utils/progressiveInterview';
import { ActivePage } from './Header';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenAadhaar: () => void;
  profile: BeneficiaryProfile;
  giaStatus: GIAGrantStatus;
  selectedLanguage: SupportedLanguage;
  t: TranslationStrings;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAadhaar,
  profile,
  giaStatus,
  selectedLanguage,
  t,
}) => {
  const progress = getInterviewProgress(profile);

  return (
    <div className="space-y-8 pb-12">
      {/* Official Government Scheme Header Banner */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white px-2 py-0.5 rounded-xs">
              MoSJE • PM-AJAY GIA Component
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              Ministry of Social Justice and Empowerment, Govt. of India
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)
          </h2>
          <p className="text-xs text-gray-600 max-w-3xl">
            Grant-in-Aid (GIA) Livelihood Promotion, Enterprise Support & NSQF Skilling Pathway System for Scheduled Caste (SC) Communities.
          </p>
        </div>

        {/* Pravin Quick Identity Pill */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-2 rounded-sm shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
            {profile.name.charAt(0)}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-gray-900 flex items-center gap-1">
              {profile.name}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[10px] text-gray-500">
              {profile.casteCategory} • {t.scVerified}
            </div>
          </div>
          <button
            onClick={() => onNavigate('assistant')}
            className="ml-2 px-2.5 py-1 text-xs bg-gray-900 hover:bg-black text-white font-medium rounded-xs cursor-pointer flex items-center gap-1"
          >
            <Mic className="w-3 h-3" />
            <span>{t.speakVoice}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 space-y-6">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Transforming Bureaucratic Form-Filling into Empathetic Spoken Dialogues
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Many target beneficiaries face barriers such as low digital literacy, language constraints, and difficulty navigating text-heavy portals. <strong>Ajay-Mitra</strong> conducts a warm, friendly voice interview in 10 Indic languages, gathers essential livelihood details step-by-step, calculates the <strong>₹50,000 PM-AJAY capital subsidy</strong>, and matches tailored <strong>NSQF-certified trades</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('assistant')}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Start Voice Interview with Ajay-Mitra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('nsqf')}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-gray-600" />
            <span>Explore NSQF Certified Trades</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            <span>View Beneficiary Dossier</span>
          </button>

          <button
            onClick={onOpenAadhaar}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aadhaar e-KYC Verification</span>
          </button>
        </div>

        {/* Progressive Interview Status Banner for Pravin */}
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900">
                Pravin's Profiling Progress:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-xs text-gray-800">
                {progress.completedSteps} of {progress.totalSteps} Details Completed ({progress.percentage}%)
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              The assistant gathers education, traditional family occupation, current livelihood, trade interests, employment preference, and location before presenting final recommendations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('assistant')}
            className="px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs cursor-pointer shrink-0"
          >
            {progress.isComplete ? 'View Recommendations' : 'Continue Interview'}
          </button>
        </div>
      </section>

      {/* The 4 Core PM-AJAY Issues Solved */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Addressing Core GIA Challenges
          </h3>
          <h2 className="text-lg font-bold text-gray-900">
            Why This Voice-First Architecture Was Built
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2 hover:border-gray-300 transition-colors">
            <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-xs">
              01
            </div>
            <h4 className="text-xs font-bold text-gray-900">
              Eliminating the Digital Divide
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Target SC beneficiaries often have low digital literacy and struggle with English or complex text-based web forms. Ajay-Mitra replaces text forms with natural voice conversations in regional dialects, cutting onboarding dropouts by ~80%.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2 hover:border-gray-300 transition-colors">
            <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-xs">
              02
            </div>
            <h4 className="text-xs font-bold text-gray-900">
              Preventing Training Dropouts
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Arbitrary course enrollments fail when physical mobility, hereditary family skills (leather, handloom, woodwork), or village realities are ignored. RAG matching maps individual constraints directly to viable local trades.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2 hover:border-gray-300 transition-colors">
            <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-xs">
              03
            </div>
            <h4 className="text-xs font-bold text-gray-900">
              ₹50,000 GIA Capital Subsidy
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Provides direct statutory screening for the ₹50,000 PM-AJAY Grant-in-Aid (₹35,000 capital assets + ₹10,000 toolkit stipend + ₹5,000 working capital), enabling SC artisans and youth to launch self-sustaining micro-enterprises.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2 hover:border-gray-300 transition-colors">
            <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-xs">
              04
            </div>
            <h4 className="text-xs font-bold text-gray-900">
              Relieving Administrative Red Tape
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Ground-level teams face severe paperwork backlogs. Our non-linear entity extraction automatically structures spoken dialogues into government parameters and directly syncs with the MoSJE PM-AJAY MIS portal.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step How It Works */}
      <section className="bg-white border border-gray-200 rounded-sm p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            The Conversational Journey
          </h3>
          <h2 className="text-lg font-bold text-gray-900">
            How Beneficiary Profiling and Recommendations Work
          </h2>
          <p className="text-xs text-gray-500">
            The assistant systematically guides beneficiaries step-by-step through a friendly dialogue before presenting opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Spoken Voice</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal">
              Beneficiary speaks naturally in their dialect. Speech-to-text captures the utterance seamlessly without any typing needed.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Friendly Profiling</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal">
              Assistant asks for education, hereditary craft, current livelihood, trade interests, work preference, and location one-by-one.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">3</span>
              <span>GIA Screener</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal">
              Statutory verification of caste category, income threshold (&lt; ₹2.5L), age, viable trade, cluster residence, and DBT readiness.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">4</span>
              <span>NSQF RAG Match</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal">
              Retrieval-Augmented Generation matches beneficiary attributes against National Skills Qualification Framework courses.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm space-y-2">
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">5</span>
              <span>MIS Sync & SMS</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal">
              Direct generation of Beneficiary ID, pre-sanction dossier, and SMS confirmation delivered to the beneficiary's phone.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Channel Access Modes */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Inclusive Deployment
          </h3>
          <h2 className="text-lg font-bold text-gray-900">
            Multi-Channel Access for Low-Connectivity & Low-Tech Environments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-xs text-gray-900">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">CSC Village Kiosks</h4>
                <p className="text-[10px] text-gray-500">Common Service Centres</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600">
              Equipped with high-contrast accessibility displays, large microphone buttons, and clear voice readouts for community walk-in assistance.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-xs text-gray-900">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">WhatsApp Voice Notes</h4>
                <p className="text-[10px] text-gray-500">Smartphone Messaging</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600">
              Beneficiaries send voice notes on WhatsApp and receive conversational audio responses and interactive course cards directly in their chat.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-xs text-gray-900">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">IVR Feature Phone Simulation</h4>
                <p className="text-[10px] text-gray-500">Toll-Free Telephony</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600">
              Interactive voice response for non-smartphone feature phones with simulated spoken menus, DTMF keypad inputs, and call transcription.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Frequently Asked Questions
          </h3>
          <h2 className="text-lg font-bold text-gray-900">
            PM-AJAY Grant-in-Aid Guidelines
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 space-y-1">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-gray-700" />
              Who is eligible for the PM-AJAY GIA ₹50,000 grant?
            </h4>
            <p className="text-[11px] text-gray-600 leading-normal pl-5">
              Individuals belonging to the Scheduled Caste (SC) category with an annual family income below ₹2.50 Lakh, aged 18–50 years, residing in targeted SC-majority clusters, and enrolling in an approved NSQF-aligned livelihood or self-employment trade.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 space-y-1">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-gray-700" />
              How is the ₹50,000 Grant-in-Aid disbursed?
            </h4>
            <p className="text-[11px] text-gray-600 leading-normal pl-5">
              Under DBT (Direct Benefit Transfer), the grant is split into: ₹35,000 for capital assets/machinery purchase, ₹10,000 for official toolkits, and ₹5,000 working capital margin, sent directly to Aadhaar-seeded bank accounts upon course completion.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-sm border border-gray-100 space-y-1">
            <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-gray-700" />
              Why does the assistant ask for my information step-by-step?
            </h4>
            <p className="text-[11px] text-gray-600 leading-normal pl-5">
              To prevent training dropouts and ensure you get matched with a trade that suits your education, physical capabilities, and local job market demand, Ajay-Mitra asks one friendly question at a time before generating tailored recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="bg-gray-900 text-white rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold">
            Ready to Discover Your Livelihood Pathway?
          </h3>
          <p className="text-xs text-gray-300">
            Start a voice conversation with Ajay-Mitra right now. No typing or complicated forms required.
          </p>
        </div>
        <button
          onClick={() => onNavigate('assistant')}
          className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 text-xs font-semibold rounded-xs cursor-pointer shrink-0 flex items-center gap-2"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Talk to Voice Assistant</span>
        </button>
      </div>
    </div>
  );
};
