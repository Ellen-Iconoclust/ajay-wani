export type SupportedLanguage = 
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'pa' // Punjabi
  | 'gu' // Gujarati
  | 'or' // Odia
  | 'kn' // Kannada
  | 'en'; // English

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dialects: string[];
}

export interface BeneficiaryProfile {
  name: string;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  casteCategory: 'Scheduled Caste (SC)';
  subCaste: string;
  state: string;
  district: string;
  block: string;
  annualFamilyIncome: number | null;
  educationLevel: string;
  traditionalOccupation: string;
  currentActivity: string;
  monthlyCurrentIncome: number | null;
  vocationalInterests: string[];
  mobilityRadius: 'Within Village' | 'Within Block (< 15km)' | 'District HQ (< 40km)' | 'State / Can Migrate';
  physicalConstraints: string;
  employmentPreference: 'Self-Employment / Micro-Enterprise' | 'Wage Employment / Factory Job' | 'Both / Flexible' | '';
  contactNumber: string;
  rationCardOrAadhaarLast4: string;
  profileCompletionPercentage: number;
}

export interface GIAGrantStatus {
  isEligible: boolean;
  eligibleAmount: number; // ₹50,000 under PM-AJAY GIA
  sanctionNumber: string;
  criteriaResults: {
    casteVerified: boolean;
    incomeUnderCeiling: boolean;
    ageCompliant: boolean;
    viableTradeIdentified: boolean;
    residenceInTargetCluster: boolean;
    bankAccountDbtReady: boolean;
  };
  subsidyBreakdown: {
    capitalAssetGrant: number; // e.g. 35,000 for machines/tools
    toolkitStipend: number; // e.g. 10,000
    workingCapitalMargin: number; // e.g. 5,000
  };
  statusSummary: string;
  verificationBadge: string;
}

export interface NSQFCourse {
  id: string;
  title: string;
  titleRegional: Record<string, string>;
  sector: string;
  nsqfLevel: number;
  qpCode: string;
  durationHours: number;
  minEducation: string;
  matchScore: number;
  matchReasons: string[];
  suitabilityType: 'Self-Employment Ideal' | 'High Wage Placement' | 'Traditional Skill Modernization';
  avgMonthlyEarnings: string;
  trainingCenters: {
    name: string;
    location: string;
    distanceKm: number;
    seatsAvailable: number;
  }[];
  pmAjayGiaToolkitSupplied: string;
  placementGuarantee: string;
  careerPathway: string;
}

export interface DialogueMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  audioBase64?: string;
  language: SupportedLanguage;
  dialect?: string;
  timestamp: string;
  offlineProcessed?: boolean;
  channel: 'kiosk' | 'whatsapp' | 'ivr';
  extractedEntities?: Partial<BeneficiaryProfile>;
}

export interface MISSyncRecord {
  beneficiaryId: string;
  dossierId: string;
  syncTimestamp: string;
  status: 'SYNCED_WITH_MOSJE_PORTAL' | 'PENDING_OFFLINE_QUEUE';
  dbtAccountLinked: boolean;
  selectedCourseId?: string;
  giaSanctionId: string;
  smsNotificationPayload: {
    recipient: string;
    messageText: string;
    language: string;
    status: 'DELIVERED' | 'QUEUED';
  };
}

export type ChannelMode = 'kiosk' | 'whatsapp' | 'ivr';
