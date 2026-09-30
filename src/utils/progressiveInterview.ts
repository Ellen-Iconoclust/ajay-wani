import { BeneficiaryProfile, SupportedLanguage } from '../types/pmajay';

export interface StepStatus {
  key: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location';
  labelKey: string;
  isFilled: boolean;
  value: string;
}

export interface InterviewProgress {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
  currentStepKey: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete';
  isComplete: boolean;
  steps: StepStatus[];
}

export function getInterviewProgress(profile: BeneficiaryProfile): InterviewProgress {
  const steps: StepStatus[] = [
    {
      key: 'education',
      labelKey: 'stepEducation',
      isFilled: Boolean(profile.educationLevel && profile.educationLevel.trim().length > 0),
      value: profile.educationLevel || '',
    },
    {
      key: 'traditional',
      labelKey: 'stepTraditional',
      isFilled: Boolean(profile.traditionalOccupation && profile.traditionalOccupation.trim().length > 0),
      value: profile.traditionalOccupation || '',
    },
    {
      key: 'current',
      labelKey: 'stepCurrent',
      isFilled: Boolean(profile.currentActivity && profile.currentActivity.trim().length > 0),
      value: profile.currentActivity || '',
    },
    {
      key: 'interests',
      labelKey: 'stepInterests',
      isFilled: Boolean(profile.vocationalInterests && profile.vocationalInterests.length > 0),
      value: profile.vocationalInterests?.join(', ') || '',
    },
    {
      key: 'preference',
      labelKey: 'stepPreference',
      isFilled: Boolean(profile.employmentPreference && profile.employmentPreference.trim().length > 0),
      value: profile.employmentPreference || '',
    },
    {
      key: 'location',
      labelKey: 'stepLocation',
      isFilled: Boolean(profile.district && profile.district.trim().length > 0),
      value: profile.district ? `${profile.district} (${profile.mobilityRadius || 'Local'})` : '',
    },
  ];

  const completedSteps = steps.filter((s) => s.isFilled).length;
  const totalSteps = steps.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  // Find the first unfilled step
  const nextMissing = steps.find((s) => !s.isFilled);
  const currentStepKey = nextMissing ? nextMissing.key : 'complete';
  const isComplete = completedSteps >= 5; // allow recommendations when at least 5 key items are provided

  return {
    totalSteps,
    completedSteps,
    percentage,
    currentStepKey,
    isComplete,
    steps,
  };
}

/**
 * Infallibly applies the user's spoken answer to the current step.
 * Even if regex does not match exact keywords, this guarantees that the current
 * missing field is populated and the interview ALWAYS advances to the next step.
 */
export function applyStepAnswer(
  currentProfile: BeneficiaryProfile,
  stepKey: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete',
  userText: string
): BeneficiaryProfile {
  const updated = { ...currentProfile };
  const lower = userText.toLowerCase();

  // Name check
  const nameMatch = userText.match(/(?:मेरा नाम|हमार नाम|माझं नाव|என் பெயர்|నా పేరు|my name is)\s+([A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    updated.name = nameMatch[1].trim();
  }

  // Cross-entity detection across user utterance
  if (lower.includes('8वीं') || lower.includes('८वीं') || lower.includes('8th') || lower.includes('आठवीं') || lower.includes('8 ') || lower.includes('अष्टम')) {
    updated.educationLevel = 'Middle (8th Pass)';
  } else if (lower.includes('10वीं') || lower.includes('१०वीं') || lower.includes('10th') || lower.includes('दसवीं') || lower.includes('10 ') || lower.includes('दहावी') || lower.includes('பத்தாம்')) {
    updated.educationLevel = 'Matric (10th Pass)';
  } else if (lower.includes('5वीं') || lower.includes('५वीं') || lower.includes('5th') || lower.includes('पांचवीं') || lower.includes('5 ') || lower.includes('प्राथमिक')) {
    updated.educationLevel = 'Primary (5th Pass)';
  } else if (lower.includes('12वीं') || lower.includes('१२वीं') || lower.includes('12th') || lower.includes('बारहवीं') || lower.includes('12 ') || lower.includes('इंटर')) {
    updated.educationLevel = 'Intermediate (12th Pass)';
  }

  if (lower.includes('चमड़ा') || lower.includes('leather') || lower.includes('जूता') || lower.includes('पादत्राण') || lower.includes('தோல்')) {
    updated.traditionalOccupation = 'Leathercraft & Footwear';
  } else if (lower.includes('बुनकर') || lower.includes('हथकरघा') || lower.includes('weaving') || lower.includes('तांत') || lower.includes('हातमाग') || lower.includes('நெசவு')) {
    updated.traditionalOccupation = 'Handloom & Textile Weaving';
  } else if (lower.includes('बढ़ई') || lower.includes('काष्ठ') || lower.includes('carpentry') || lower.includes('सुतार') || lower.includes('தச்சு')) {
    updated.traditionalOccupation = 'Carpentry & Woodwork';
  }

  if (lower.includes('सोलर') || lower.includes('बिजली') || lower.includes('electric') || lower.includes('वायरिंग') || lower.includes('solar')) {
    if (!updated.vocationalInterests.includes('Solar & Electrical Maintenance')) {
      updated.vocationalInterests = [...updated.vocationalInterests, 'Solar & Electrical Maintenance'];
    }
  }
  if (lower.includes('मैकेनिक') || lower.includes('गाड़ी') || lower.includes('bike') || lower.includes('मोटर') || lower.includes('mechanic')) {
    if (!updated.vocationalInterests.includes('Two-Wheeler & Auto Repair')) {
      updated.vocationalInterests = [...updated.vocationalInterests, 'Two-Wheeler & Auto Repair'];
    }
  }
  if (lower.includes('सिलाई') || lower.includes('कढ़ाई') || lower.includes('tailor') || lower.includes('वस्त्र') || lower.includes('தையல்')) {
    if (!updated.vocationalInterests.includes('Garment Construction & Tailoring')) {
      updated.vocationalInterests = [...updated.vocationalInterests, 'Garment Construction & Tailoring'];
    }
  }

  if (lower.includes('दुकान') || lower.includes('स्वरोजगार') || lower.includes('खुद का') || lower.includes('own shop') || lower.includes('self-employment')) {
    updated.employmentPreference = 'Self-Employment / Micro-Enterprise';
  } else if (lower.includes('नौकरी') || lower.includes('job') || lower.includes('कंपनी') || lower.includes('factory') || lower.includes('வேலை')) {
    updated.employmentPreference = 'Wage Employment / Factory Job';
  }

  // GUARANTEED STEP RESOLUTION FOR CURRENT STEP
  if (stepKey === 'education' && (!updated.educationLevel || updated.educationLevel.trim().length === 0)) {
    if (lower.includes('नहीं') || lower.includes('no') || lower.includes('नाही') || lower.includes('இல்லை') || lower.includes('uneducated') || lower.includes('साक्षर')) {
      updated.educationLevel = 'Informal / Basic Literacy';
    } else {
      updated.educationLevel = userText.trim().slice(0, 30) || 'Middle (8th Pass)';
    }
  }

  if (stepKey === 'traditional' && (!updated.traditionalOccupation || updated.traditionalOccupation.trim().length === 0)) {
    if (lower.includes('नहीं') || lower.includes('no') || lower.includes('none') || lower.includes('नाही') || lower.includes('இல்லை') || lower.includes('లేదు')) {
      updated.traditionalOccupation = 'No Traditional Craft / First-Generation Aspirant';
    } else if (lower.includes('कृषि') || lower.includes('मजदूरी') || lower.includes('farm') || lower.includes('labor')) {
      updated.traditionalOccupation = 'Agrarian Labor & Allied Craft';
    } else {
      updated.traditionalOccupation = userText.trim().slice(0, 35) || 'Traditional Heritage Trade';
    }
  }

  if (stepKey === 'current' && (!updated.currentActivity || updated.currentActivity.trim().length === 0)) {
    if (lower.includes('मजदूरी') || lower.includes('daily') || lower.includes('दिन भर') || lower.includes('കൂলি')) {
      updated.currentActivity = 'Daily Wage Labor';
    } else if (lower.includes('सहायक') || lower.includes('helper') || lower.includes('workshop')) {
      updated.currentActivity = 'Workshop Helper / Assistant';
    } else if (lower.includes('बेरोजगार') || lower.includes('unemployed') || lower.includes('काम नहीं')) {
      updated.currentActivity = 'Currently Unemployed / Seeking Work';
    } else {
      updated.currentActivity = userText.trim().slice(0, 40) || 'Daily Wage Laborer';
    }
  }

  if (stepKey === 'interests' && (!updated.vocationalInterests || updated.vocationalInterests.length === 0)) {
    updated.vocationalInterests = [userText.trim().slice(0, 30) || 'Solar & Electrical Maintenance'];
  }

  if (stepKey === 'preference' && (!updated.employmentPreference || updated.employmentPreference.trim().length === 0)) {
    if (lower.includes('नौकरी') || lower.includes('job') || lower.includes('factory')) {
      updated.employmentPreference = 'Wage Employment / Factory Job';
    } else {
      updated.employmentPreference = 'Self-Employment / Micro-Enterprise';
    }
  }

  if (stepKey === 'location' && (!updated.district || updated.district.trim().length === 0)) {
    const districts = ['Azamgarh', 'Varanasi', 'Buldhana', 'Erode', 'Bankura', 'Mahabubnagar', 'Mansa', 'Jaipur', 'Patna', 'Solapur', 'Madurai', 'Surendranagar', 'Mayurbhanj', 'Kalaburagi'];
    for (const d of districts) {
      if (lower.includes(d.toLowerCase())) {
        updated.district = d;
        break;
      }
    }
    if (!updated.district) {
      updated.district = userText.trim().slice(0, 25) || 'Azamgarh';
    }
    if (lower.includes('गांव') || lower.includes('village') || lower.includes('घर')) {
      updated.mobilityRadius = 'Within Village';
    }
  }

  const prog = getInterviewProgress(updated);
  updated.profileCompletionPercentage = prog.percentage;

  return updated;
}

// Friendly, warm, non-robotic questions for each step
export const INTERVIEW_QUESTIONS: Record<
  SupportedLanguage,
  Record<
    'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete',
    {
      question: (name: string, prevAnswer?: string) => string;
      quickOptions: string[];
    }
  >
> = {
  hi: {
    education: {
      question: (name) =>
        `नमस्ते ${name} जी! मैं आपका आजीविका मित्र हूँ। PM-AJAY योजना से आपको सही ट्रेनिंग और ₹50,000 की अनुदान सहायता दिलाने के लिए, मैं आपसे कुछ आसान बातें जानूँगा। सबसे पहले कृपया बताएं कि आपकी पढ़ाई कहाँ तक हुई है?`,
      quickOptions: ['8वीं पास', '10वीं पास', '5वीं पास', '12वीं पास', 'औपचारिक शिक्षा नहीं'],
    },
    traditional: {
      question: (name, prev) =>
        `बहुत बढ़िया ${name} जी! ${prev ? `(शिक्षा: ${prev})` : ''} क्या आपके परिवार या समुदाय में कोई पारंपरिक काम या पुश्तैनी हुनर होता आया है? जैसे चमड़ा उद्योग, बुनकर/हथकरघा, बढ़ईगिरी, राजमिस्त्री, कृषि मजदूरी या सफाई कार्य?`,
      quickOptions: ['चमड़ा व जूता निर्माण', 'हथकरघा व बुनाई', 'बढ़ई / काष्ठ कला', 'कृषि मजदूरी', 'कोई पारंपरिक काम नहीं'],
    },
    current: {
      question: (name) =>
        `धन्यवाद ${name} जी! बहुत सुंदर जानकारी। अभी आप अपनी आजीविका चलाने के लिए क्या काम करते हैं, और लगभग कितना मासिक गुजारा हो पाता है?`,
      quickOptions: ['दैनिक मजदूरी करता हूँ', 'दुकान/वर्कशॉप पर सहायक हूँ', 'बेरोजगार हूँ, काम की तलाश है', 'छोटा-मोटा रिपेयर काम'],
    },
    interests: {
      question: (name) =>
        `बहुत खूब ${name} जी। आप भविष्य में कौन सा नया काम या ट्रेड सीखने के इच्छुक हैं? जैसे कि सोलर पंप/इलेक्ट्रिकल, दोपहिया मैकेनिक, आधुनिक जूता-चप्पल डिजाइन, या सिलाई-कढ़ाई?`,
      quickOptions: ['सोलर व बिजली मेंटेनेंस', 'दोपहिया वाहन मैकेनिक', 'आधुनिक चमड़ा उत्पाद', 'सिलाई व वस्त्र निर्माण'],
    },
    preference: {
      question: (name) =>
        `शानदार सोच ${name} जी! क्या आप ₹50,000 की सरकारी PM-AJAY अनुदान सहायता से अपनी खुद की दुकान/स्वरोजगार शुरू करना चाहते हैं, या किसी कंपनी में पक्की नौकरी पाना चाहते हैं?`,
      quickOptions: ['खुद की दुकान / स्वरोजगार', 'कंपनी में पक्की नौकरी', 'दोनों में से जो भी बेहतर हो'],
    },
    location: {
      question: (name) =>
        `अंतिम बात ${name} जी! आप किस जिले और राज्य में रहते हैं, और क्या आप ट्रेनिंग के लिए जिला मुख्यालय जा सकते हैं या अपने गाँव/ब्लॉक के पास ही ट्रेनिंग चाहते हैं?`,
      quickOptions: ['आजमगढ़, उत्तर प्रदेश (गाँव में)', 'वाराणसी (जिला मुख्यालय जा सकता हूँ)', 'बुलढाणा (ब्लॉक स्तर पर)', 'अन्य जिला'],
    },
    complete: {
      question: (name) =>
        `बधाई हो ${name} जी! आपके सभी जरूरी विवरण पूरे हो चुके हैं। आपकी शिक्षा, पारंपरिक हुनर और स्वरोजगार की पसंद के आधार पर हमने आपके लिए उपयुक्त NSQF कोर्स और ₹50,000 की PM-AJAY GIA अनुदान योजना चिन्हित कर ली है! नीचे दिए गए कोर्स देखें।`,
      quickOptions: ['NSQF कोर्स देखें', 'MIS पोर्टल में रिकॉर्ड सिंक करें', 'विवरण में कुछ बदलाव करें'],
    },
  },
  en: {
    education: {
      question: (name) =>
        `Namaste ${name} ji! I am Ajay-Mitra, your friendly livelihood guide. To ensure you receive the ideal NSQF certified training and the INR 50,000 PM-AJAY capital subsidy, let's go step-by-step. First, could you tell me your highest education level?`,
      quickOptions: ['8th Standard Pass', '10th Matric Pass', '5th Primary Pass', '12th Inter Pass', 'Informal Literacy'],
    },
    traditional: {
      question: (name, prev) =>
        `Thank you ${name} ji! ${prev ? `(Education recorded: ${prev})` : ''} Does your family or community have any traditional heritage craft or occupation? Such as leatherwork, handloom weaving, carpentry, masonry, farming, or sanitation?`,
      quickOptions: ['Leathercraft & Footwear', 'Handloom & Weaving', 'Carpentry & Woodwork', 'Agrarian Labor', 'No traditional craft'],
    },
    current: {
      question: (name) =>
        `Understood, ${name} ji! What livelihood or work activities are you currently engaged in day-to-day, and how is your current family income?`,
      quickOptions: ['Daily Wage Labor', 'Helper / Workshop Assistant', 'Currently Unemployed', 'Informal Small Repairs'],
    },
    interests: {
      question: (name) =>
        `Wonderful! What modern skill or trade are you most excited to learn? For example: Solar & Electrical, Two-Wheeler Mechanic, Modern Footwear, or Garment Tailoring?`,
      quickOptions: ['Solar & Electrical Maintenance', 'Automotive & Bike Repair', 'Modern Leather Goods', 'Garment Making & Tailoring'],
    },
    preference: {
      question: (name) =>
        `Great aspiration, ${name} ji! Under PM-AJAY, would you prefer starting your own independent micro-enterprise / shop with the INR 50,000 capital subsidy, or would you prefer a salaried wage job at a local company?`,
      quickOptions: ['Self-Employment / Own Shop', 'Salaried Factory / Company Job', 'Flexible / Either'],
    },
    location: {
      question: (name) =>
        `Last quick detail ${name} ji: Which district and state do you live in, and can you travel to the district center for training or do you need doorstep training within your village?`,
      quickOptions: ['Azamgarh, UP (Within Village)', 'Varanasi (Can travel to District HQ)', 'Local Block (< 15km)', 'Other District'],
    },
    complete: {
      question: (name) =>
        `Congratulations ${name} ji! All your essential details are now complete. Based on your background, we have matched tailored NSQF-certified courses and pre-qualified you for the INR 50,000 PM-AJAY capital grant! Here are your recommended pathways below:`,
      quickOptions: ['View NSQF Courses', 'Sync with PM-AJAY MIS Portal', 'Update My Details'],
    },
  },
  mr: {
    education: {
      question: (name) =>
        `नमस्कार ${name} जी! मी तुमचा आजीविका मित्र आहे. PM-AJAY योजनेतून तुम्हाला ₹50,000 चे सरकारी अनुदान आणि सर्वोत्तम NSQF कौशल्य मिळवून देण्यासाठी, मी तुम्हाला काही सोपे प्रश्न विचारीन. सर्वात आधी आपले शिक्षण कितपत झाले आहे ते सांगा?`,
      quickOptions: ['८ वी पास', '१० वी पास', '५ वी पास', '१२ वी पास', 'अनौपचारिक शिक्षण'],
    },
    traditional: {
      question: (name, prev) =>
        `खूप छान ${name} जी! तुमच्या कुटुंबात किंवा समाजात पूर्वीपासून चालत आलेला कोणताही पारंपरिक व्यवसाय आहे का? जसे चर्मोद्योग, विणकाम/हातमाग, सुतारकाम, गवंडीकाम किंवा शेतमजुरी?`,
      quickOptions: ['चर्मोद्योग व पादत्राणे', 'हातमाग व विणकाम', 'सुतारकाम / लाकडी काम', 'शेतमजुरी', 'पारंपरिक काम नाही'],
    },
    current: {
      question: (name) =>
        `धन्यवाद ${name} जी. सध्या तुम्ही उपजीविकेसाठी दररोज काय काम करता, आणि अंदाजे किती कमाई होते?`,
      quickOptions: ['दैनिक मजुरी करतो', 'दुकान/गॅरेजमध्ये मदतनीस', 'सध्या बेरोजगार आहे', 'छोट्या दुरुस्त्यांचे काम'],
    },
    interests: {
      question: (name) =>
        `खूप छान ${name} जी! भविष्यात तुम्हाला कोणते नवीन कौशल्य शिकायला आवडेल? जसे सोलर तंत्रज्ञान, दुचाकी मेकॅनिक, आधुनिक चर्मोद्योग, किंवा टेलरिंग?`,
      quickOptions: ['सोलर व इलेक्ट्रिकल', 'दुचाकी वाहन मेकॅनिक', 'आधुनिक चर्मोद्योग', 'सिलाई व फॅशन डिझाईन'],
    },
    preference: {
      question: (name) =>
        `उत्तम विचार! ₹50,000 च्या PM-AJAY अनुदानातून तुम्हाला स्वतःचे दुकान किंवा व्यवसाय सुरू करायचा आहे की पगारदार नोकरी करायची आहे?`,
      quickOptions: ['स्वतःचे दुकान / व्यवसाय', 'कंपनीमध्ये पक्की नोकरी', 'दोन्हीपैकी जे योग्य असेल'],
    },
    location: {
      question: (name) =>
        `शेवटची माहिती ${name} जी: तुम्ही कोणत्या जिल्ह्यात राहता, आणि प्रशिक्षणासाठी तालुक्यात जाऊ शकता की गावातच प्रशिक्षण हवे?`,
      quickOptions: ['बुलढाणा (गावातच हवे)', 'सोलापूर (जिल्हा ठिकाणी जाऊ शकतो)', 'तालुक्यात (< 15 किमी)', 'इतर जिल्हा'],
    },
    complete: {
      question: (name) =>
        `अभिनंदन ${name} जी! तुमची सर्व माहिती पूर्ण झाली आहे. तुमच्या पार्श्वभूमीनुसार आम्ही NSQF कोर्सेस आणि ₹50,000 च्या PM-AJAY अनुदानाची शिफारस तयार केली आहे! खालील कोर्सेस पहा.`,
      quickOptions: ['NSQF कोर्सेस पहा', 'MIS पोर्टलवर नोंदणी सिंक करा', 'माहिती बदला'],
    },
  },
  ta: {
    education: {
      question: (name) =>
        `வணக்கம் ${name}! நான் உங்கள் வாழ்வாதார வழிகாட்டி அஜய்-மித்ரா. PM-AJAY திட்டத்தின் கீழ் ரூ. 50,000 மானியம் மற்றும் திறன் பயிற்சிகளைப் பெற, உங்கள் விவரங்களை ஒன்றன்பின் ஒன்றாகக் கேட்பேன். முதலில், உங்கள் கல்வித் தகுதி என்ன?`,
      quickOptions: ['8-ஆம் வகுப்பு தேர்ச்சி', '10-ஆம் வகுப்பு தேர்ச்சி', '5-ஆம் வகுப்பு தேர்ச்சி', '12-ஆம் வகுப்பு', 'முறையான கல்வி இல்லை'],
    },
    traditional: {
      question: (name) =>
        `நன்றி ${name}! உங்கள் குடும்பத்தில் பாரம்பரியத் தொழில் ஏதேனும் உள்ளதா? உதாரணத்திற்கு தோல் தொழில், கைத்தறி நெசவு, மரவேலை, விவசாயக் கூலி?`,
      quickOptions: ['தோல் கைவினை & காலணி', 'கைத்தறி நெசவு', 'மரவேலை / தச்சு', 'விவசாயக் கூலி', 'பாரம்பரியத் தொழில் இல்லை'],
    },
    current: {
      question: (name) =>
        `புரிந்தது ${name}! தற்போது வாழ்வாதாரத்திற்காக என்ன வேலை செய்கிறீர்கள், மாத வருமானம் எவ்வளவு?`,
      quickOptions: ['தினக்கூலி வேலை', 'பட்டறையில் உதவியாளர்', 'வேலை தேடுகிறேன்', 'சிறு பழுது பார்க்கும் பணி'],
    },
    interests: {
      question: (name) =>
        `அருமை! நீங்கள் எந்தப் புதிய தொழில் அல்லது திறனைக் கற்க விரும்புகிறீர்கள்? (சோலார் & எலக்ட்ரிக்கல், பைக் மெக்கானிக், நவீன தோல் தொழில், தையல்)?`,
      quickOptions: ['சோலார் & மின் பராமரிப்பு', 'இருசக்கர வாகன மெக்கானிக்', 'நவீன தோல் பொருட்கள்', 'தையல் கலை'],
    },
    preference: {
      question: (name) =>
        `ரூ. 50,000 அரசு மானியத்துடன் சொந்த தொழில் தொடங்க விரும்புகிறீர்களா, அல்லது நிறுவனத்தில் வேலைக்குச் செல்ல விரும்புகிறீர்களா?`,
      quickOptions: ['சொந்த தொழில் / கடை', 'மாத சம்பள வேலை', 'எதுவாக இருந்தாலும் சரி'],
    },
    location: {
      question: (name) =>
        `இறுதியாக, நீங்கள் எந்த மாவட்டத்தில் வசிக்கிறீர்கள்? உங்கள் ஊருக்குள்ளேயே பயிற்சி தேவையா அல்லது மாவட்ட தலைமையகம் செல்ல முடியுமா?`,
      quickOptions: ['ஈரோடு (ஊருக்குள்)', 'மதுரை (மாவட்டம் செல்லலாம்)', 'வட்டார எல்லைக்குள்', 'வேறு மாவட்டம்'],
    },
    complete: {
      question: (name) =>
        `வாழ்த்துகள் ${name}! உங்கள் விவரங்கள் முழுமையாகப் பதிவு செய்யப்பட்டன. உங்களுக்கு உகந்த NSQF பயிற்சிகள் மற்றும் ரூ. 50,000 மானியத் திட்டம் தயாராக உள்ளது!`,
      quickOptions: ['பயிற்சிகளைக் காண்க', 'MIS போர்ட்டலில் சேமிக்க', 'விவரங்களை மாற்றுக'],
    },
  },
  te: {
    education: {
      question: (name) =>
        `నమస్కారం ${name} గారు! నేను మీ జీవనోపాధి మిత్రుడు అజయ్-మిత్ర. PM-AJAY పథకం కింద రూ. 50,000 గ్రాంట్ మరియు NSQF శిక్షణ కోసం, మీ వివరాలు తెలుసుకుందాం. ముందుగా మీ విద్యార్హత ఏమిటి?`,
      quickOptions: ['8వ తరగతి పాస్', '10వ తరగతి పాస్', '5వ తరగతి పాస్', 'ఇంటర్ పాస్', 'అనధికారిక చదువు'],
    },
    traditional: {
      question: (name) =>
        `ధన్యవాదాలు ${name} గారు! మీ కుటుంబంలో తోలు పని, చేనేత, వడ్రంగి లేదా వ్యవసాయం వంటి సాంప్రదాయ వృత్తి ఏమైనా ఉందా?`,
      quickOptions: ['తోలు & పాదరక్షల పని', 'చేనేత వస్త్రాలు', 'వడ్రంగి పని', 'వ్యవసాయ కూలీ', 'సాంప్రదాయ వృత్తి లేదు'],
    },
    current: {
      question: (name) =>
        `ప్రస్తుతం మీరు జీవనోపాధి కోసం ఏ పని చేస్తున్నారు? కుటుంబ ఆదాయం ఎంత?`,
      quickOptions: ['రోజువారీ కూలీ', 'వర్క్‌షాప్ సహాయకుడు', 'ఉద్యోగం వెతుకుతున్నాను', 'చిన్న మరమ్మతుల పని'],
    },
    interests: {
      question: (name) =>
        `భవిష్యత్తులో మీరు నేర్చుకోవాలనుకుంటున్న నైపుణ్యం ఏది? (సోలార్, ఎలక్ట్రికల్, బైక్ మెకానిక్, టైలరింగ్)?`,
      quickOptions: ['సోలార్ & ఎలక్ట్రికల్', 'ద్విచక్ర వాహన మెకానిక్', 'ఆధునిక తోలు ఉత్పత్తులు', 'టైలరింగ్'],
    },
    preference: {
      question: (name) =>
        `రూ. 50,000 ప్రభుత్వ రాయితీతో సొంత వ్యాపారం ప్రారంభించాలనుకుంటున్నారా లేదా కంపెనీలో ఉద్యోగం చేయాలనుకుంటున్నారా?`,
      quickOptions: ['సొంత వ్యాపారం / దుకాణం', 'కంపెనీలో జీతం ఉద్యోగం', 'ఏదైనా సరే'],
    },
    location: {
      question: (name) =>
        `మీ జిల్లా ఏది? మీ గ్రామంలోనే శిక్షణ కావాలా లేదా జిల్లా కేంద్రానికి వెళ్లగలరా?`,
      quickOptions: ['మహబూబ్‌నగర్ (గ్రామంలో)', 'వరంగల్ (జిల్లాకు వెళ్లగలను)', 'మండలంలో', 'ఇతర జిల్లా'],
    },
    complete: {
      question: (name) =>
        `అభినందనలు ${name} గారు! మీ పూర్తి వివరాలు నమోదయ్యాయి. మీకు సరిపోయే NSQF కోర్సులు మరియు రూ. 50,000 PM-AJAY గ్రాంట్ సిద్ధంగా ఉన్నాయి!`,
      quickOptions: ['కోర్సులు చూడండి', 'MIS పోర్టల్ సింక్ చేయండి', 'వివరాలు సవరించండి'],
    },
  },
  bn: {
    education: {
      question: (name) =>
        `নমস্কার ${name} বাবু! আমি অজয়-মিত্র। PM-AJAY প্রকল্পের আওতায় ₹৫০,০০০ সরকারি অনুদান ও সঠিক NSQF ট্রেনিং পাওয়ার জন্য আসুন ধীরে ধীরে কথা বলি। প্রথমে বলুন আপনার শিক্ষাগত যোগ্যতা কতদূর?`,
      quickOptions: ['৮ম শ্রেণী পাস', '১০ম মাধ্যমিক পাস', '৫ম শ্রেণী পাস', '১২ম পাস', 'আনুষ্ঠানিক শিক্ষা নেই'],
    },
    traditional: {
      question: (name) =>
        `ধন্যবাদ ${name} বাবু! আপনার পরিবারে চামড়ার কাজ, তাঁত বোনা, ছুতোরের কাজ বা কৃষিকাজের মতো কোনো ঐতিহ্যবাহী পেশা আছে কি?`,
      quickOptions: ['চামড়া ও জুতো শিল্প', 'তাঁত ও বয়ন', 'ছুতোরের কাজ', 'কৃষি মজুরি', 'কোনো পারিবারিক পেশা নেই'],
    },
    current: {
      question: (name) =>
        `বর্তমানে জীবিকার জন্য আপনি কী কাজ করেন এবং আনুমানিক মাসিক আয় কত?`,
      quickOptions: ['দিনমজুরের কাজ করি', 'দোকান/কারখানায় সহকারী', 'বর্তমানে বেকার', 'ছোটখাটো মেরামতি কাজ'],
    },
    interests: {
      question: (name) =>
        `আপনি কোন নতুন কাজ বা ট্রেড শিখতে আগ্রহী? যেমন সোলার ও বিদ্যুৎ রক্ষণাবেক্ষণ, বাইক মেকানিক, বা সেলাই কাজ?`,
      quickOptions: ['সোলার ও ইলেকট্রিক্যাল', 'বাইক মেকানিক', 'আধুনিক চামড়া পণ্য', 'সেলাই ও পোশাক তৈরি'],
    },
    preference: {
      question: (name) =>
        `₹৫০,০০০ সরকারি অনুদানে নিজের দোকান/ব্যবসা শুরু করতে চান, নাকি কোনো সংস্থায় চাকরির ইচ্ছা?`,
      quickOptions: ['নিজের দোকান / ব্যবসা', 'মাসিক বেতনের চাকরি', 'যেকোনোটি'],
    },
    location: {
      question: (name) =>
        `আপনি কোন জেলায় থাকেন? প্রশিক্ষণ গ্রামের কাছে চান নাকি জেলা সদরে যেতে পারবেন?`,
      quickOptions: ['বাঁকুড়া (গ্রামে)', 'বর্ধমান (জেলা সদরে যেতে পারব)', 'ব্লক স্তরে', 'অন্য জেলা'],
    },
    complete: {
      question: (name) =>
        `অভিনন্দন ${name} বাবু! আপনার সম্পূর্ণ প্রোফাইল প্রস্তুত। আপনার জন্য সেরা NSQF কোর্স এবং ₹৫০,০০০ অনুদান অনুমোদিত হয়েছে!`,
      quickOptions: ['কোর্সগুলি দেখুন', 'MIS পোর্টালে সিঙ্ক করুন', 'তথ্য আপডেট করুন'],
    },
  },
  pa: {
    education: {
      question: (name) =>
        `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name} ਜੀ! ਮੈਂ ਅਜੈ-ਮਿੱਤਰ ਹਾਂ। PM-AJAY ਅਧੀਨ ₹50,000 ਦੀ ਗ੍ਰਾਂਟ ਅਤੇ ਸਿਖਲਾਈ ਲਈ, ਆਓ ਕਦਮ-ਦਰ-ਕਦਮ ਗੱਲ ਕਰੀਏ। ਪਹਿਲਾਂ ਦੱਸੋ ਤੁਹਾਡੀ ਪੜ੍ਹਾਈ ਕਿੰਨੀ ਹੈ?`,
      quickOptions: ['8ਵੀਂ ਪਾਸ', '10ਵੀਂ ਪਾਸ', '5ਵੀਂ ਪਾਸ', '12ਵੀਂ ਪਾਸ', 'ਸਧਾਰਨ ਪੜ੍ਹਾਈ'],
    },
    traditional: {
      question: (name) =>
        `ਧੰਨਵਾਦ ${name} ਜੀ! ਕੀ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਵਿੱਚ ਚਮੜੇ ਦਾ ਕੰਮ, ਖੱਡੀ/ਬੁਣਾਈ, ਤਰਖਾਣ ਜਾਂ ਖੇਤੀ ਮਜ਼ਦੂਰੀ ਵਰਗਾ ਕੋਈ ਰਵਾਇਤੀ ਕੰਮ ਰਿਹਾ ਹੈ?`,
      quickOptions: ['ਚਮੜੇ ਤੇ ਜੁੱਤੀਆਂ ਦਾ ਕੰਮ', 'ਖੱਡੀ ਤੇ ਬੁਣਤੀ', 'ਤਰਖਾਣ ਦਾ ਕੰਮ', 'ਖੇਤ ਮਜ਼ਦੂਰੀ', 'ਕੋਈ ਰਵਾਇਤੀ ਕੰਮ ਨਹੀਂ'],
    },
    current: {
      question: (name) =>
        `ਹੁਣ ਤੁਸੀਂ ਗੁਜ਼ਾਰੇ ਲਈ ਕੀ ਕੰਮ ਕਰ ਰਹੇ ਹੋ ਅਤੇ ਮਹੀਨਾਵਾਰ ਕਿੰਨੀ ਕਮਾਈ ਹੁੰਦੀ ਹੈ?`,
      quickOptions: ['ਦਿਹਾੜੀ ਮਜ਼ਦੂਰੀ', 'ਵਰਕਸ਼ਾਪ ਵਿੱਚ ਸਹਾਇਕ', 'ਨੌਕਰੀ ਦੀ ਭਾਲ ਵਿੱਚ', 'ਛੋਟੀ-ਮੋਟੀ ਰਿਪੇਅਰ'],
    },
    interests: {
      question: (name) =>
        `ਤੁਸੀਂ ਭਵਿੱਖ ਵਿੱਚ ਕਿਹੜਾ ਕੰਮ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ? (ਜਿਵੇਂ ਸੋਲਰ ਤੇ ਬਿਜਲੀ, ਬਾਈਕ ਮਕੈਨਿਕ, ਜਾਂ ਸਿਲਾਈ ਕਢਾਈ)?`,
      quickOptions: ['ਸੋਲਰ ਤੇ ਇਲੈਕਟ੍ਰੀਕਲ', 'ਦੋ-ਪਹੀਆ ਵਾਹਨ ਮਕੈਨਿਕ', 'ਆਧੁਨਿਕ ਲੈਦਰ ਕ੍ਰਾਫਟ', 'ਸਿਲਾਈ ਕਢਾਈ'],
    },
    preference: {
      question: (name) =>
        `ਕੀ ਤੁਸੀਂ ₹50,000 ਦੀ ਗ੍ਰਾਂਟ ਨਾਲ ਆਪਣੀ ਦੁਕਾਨ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ ਜਾਂ ਕੰਪਨੀ ਵਿੱਚ ਨੌਕਰੀ?`,
      quickOptions: ['ਆਪਣੀ ਦੁਕਾਨ / ਸਵੈ-ਰੋਜ਼ਗਾਰ', 'ਕੰਪਨੀ ਵਿੱਚ ਨੌਕਰੀ', 'ਕੋਈ ਵੀ'],
    },
    location: {
      question: (name) =>
        `ਤੁਸੀਂ ਕਿਹੜੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ? ਕੀ ਪਿੰਡ ਵਿੱਚ ਸਿਖਲਾਈ ਚਾਹੀਦੀ ਹੈ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਕੇਂਦਰ ਜਾ ਸਕਦੇ ਹੋ?`,
      quickOptions: ['ਮਾਨਸਾ (ਪਿੰਡ ਵਿੱਚ)', 'ਜਲੰਧਰ (ਸ਼ਹਿਰ ਜਾ ਸਕਦਾ ਹਾਂ)', 'ਬਲਾਕ ਵਿੱਚ', 'ਹੋਰ ਜ਼ਿਲ੍ਹਾ'],
    },
    complete: {
      question: (name) =>
        `ਵਧਾਈਆਂ ${name} ਜੀ! ਤੁਹਾਡਾ ਪੂਰਾ ਵੇਰਵਾ ਦਰਜ ਹੋ ਗਿਆ ਹੈ। ਤੁਹਾਡੇ ਲਈ NSQF ਕੋਰਸ ਅਤੇ ₹50,000 ਦੀ ਗ੍ਰਾਂਟ ਮਨਜ਼ੂਰ ਹੋ ਗਈ ਹੈ!`,
      quickOptions: ['ਕੋਰਸ ਵੇਖੋ', 'MIS ਪੋਰਟਲ ਤੇ ਭੇਜੋ', 'ਵੇਰਵੇ ਬਦਲੋ'],
    },
  },
  gu: {
    education: {
      question: (name) =>
        `નમસ્તે ${name} ભાઈ! હું અજય-મિત્ર છું. PM-AJAY યોજના હેઠળ ₹50,000 ની ગ્રાન્ટ અને યોગ્ય તાલીમ મેળવવા માટે, પહેલા જણાવો કે તમારો અભ્યાસ કેટલો છે?`,
      quickOptions: ['૮ પાસ', '૧૦ પાસ', '૫ પાસ', '૧૨ પાસ', 'અનૌપચારિક શિક્ષણ'],
    },
    traditional: {
      question: (name) =>
        `આભાર ${name} ભાઈ! શું તમારા કુટુંબમાં ચર્મકામ, વણાટકામ, સુથારીકામ કે ખેતમજૂરી જેવો કોઈ પરંપરાગત વ્યવસાય રહ્યો છે?`,
      quickOptions: ['ચર્મકામ અને પગરખાં', 'વણાટકામ', 'સુથારીકામ', 'ખેતમજૂરી', 'પરંપરાગત વ્યવસાય નથી'],
    },
    current: {
      question: (name) =>
        `હાલમાં તમે આજીવિકા માટે શું કામ કરો છો અને અંદાજે માસિક આવક કેટલી થાય છે?`,
      quickOptions: ['રોજમદાર મજૂરી', 'દુકાન/ગેરેજમાં હેલ્પર', 'રોજગારની શોધમાં', 'નાના રિપેરિંગ કામ'],
    },
    interests: {
      question: (name) =>
        `તમે કયો નવો વ્યવસાય શીખવા માંગો છો? (જેમ કે સોલર-ઇલેક્ટ્રિકલ, બાઇક મિકેનિક, ટેલરિંગ)?`,
      quickOptions: ['સોલર અને વાયરિંગ', 'ટુ-વ્હીલર મિકેનિક', 'આધુનિક ચર્મકામ', 'સિવણકામ'],
    },
    preference: {
      question: (name) =>
        `₹50,000 ની સરકારી સહાયથી પોતાની દુકાન/સ્વરોજગાર શરૂ કરવો છે કે કંપનીમાં નોકરી?`,
      quickOptions: ['પોતાની દુકાન / સ્વરોજગાર', 'કંપનીમાં નોકરી', 'બંનેમાંથી કોઈ પણ'],
    },
    location: {
      question: (name) =>
        `તમે કયા જિલ્લામાં રહો છો? ગામમાં જ તાલીમ જોઈએ છે કે જિલ્લા કેન્દ્ર જઈ શકો છો?`,
      quickOptions: ['સુરેન્દ્રનગર (ગામમાં)', 'રાજકોટ (શહેરમાં જઈ શકું)', 'તાલુકામાં', 'અન્ય જિલ્લો'],
    },
    complete: {
      question: (name) =>
        `અભિનંદન ${name} ભાઈ! તમારી બધી વિગતો પૂર્ણ થઈ ગઈ છે. તમારા માટે NSQF અભ્યાસક્રમો અને ₹50,000 સહાય તૈયાર છે!`,
      quickOptions: ['કોર્સ જુઓ', 'MIS પોર્ટલ સિન્ક કરો', 'વિગત સુધારો'],
    },
  },
  or: {
    education: {
      question: (name) =>
        `ନମସ୍କାର ${name} ଆଜ୍ଞା! ମୁଁ ଆପଣଙ୍କ ଜୀବିକା ମିତ୍ର ଅଜୟ-ମିତ୍ର। PM-AJAY ଅଧୀନରେ ₹୫୦,୦୦୦ ଅନୁଦାନ ଓ ତାଲିମ ପାଇଁ, ପ୍ରଥମେ କୁହନ୍ତୁ ଆପଣଙ୍କ ଶିକ୍ଷା କେତେଦୂର?`,
      quickOptions: ['୮ମ ପାସ', '୧୦ମ ମାଟ୍ରିକ ପାସ', '୫ମ ପାସ', '୧୨ଶ ପାସ', 'ଅଣ-ଆନୁଷ୍ଠାନିକ ଶିକ୍ଷା'],
    },
    traditional: {
      question: (name) =>
        `ଧନ୍ୟବାଦ ${name}! ଆପଣଙ୍କ ପରିବାରରେ ଚମଡା କାମ, ବୁଣାକାର, କାଠ କାମ ବା କୃଷି ମଜୁରି ପରି ପାରମ୍ପରିକ କାମ ଅଛି କି?`,
      quickOptions: ['ଚମଡ଼ା ଓ ଜୋତା କାରିଗରି', 'ଲୁଗା ବୁଣା', 'ବଢ଼େଇ କାମ', 'କୃଷି ଶ୍ରମିକ', 'କୌଣସି ପାରମ୍ପରିକ କାମ ନାହିଁ'],
    },
    current: {
      question: (name) =>
        `ବର୍ତ୍ତମାନ ଆପଣ ଚଳିବା ପାଇଁ କଣ କାମ କରୁଛନ୍ତି ଓ ମାସିକ ଆୟ କେତେ?`,
      quickOptions: ['ଦିନ ମଜୁରି', 'ଦୋକାନରେ ସହାୟକ', 'ବର୍ତ୍ତମାନ ବେକାର', 'ଛୋଟ ମରାମତି କାମ'],
    },
    interests: {
      question: (name) =>
        `ଭବିଷ୍ୟତରେ କେଉଁ ନୂତନ କାମ ଶିଖିବାକୁ ଆଗ୍ରହୀ? (ସୋଲାର, ବିଜୁଳି କାମ, ବାଇକ୍ ମେକାନିକ, ସିଲେଇ)?`,
      quickOptions: ['ସୋଲାର ଓ ଇଲେକ୍ଟ୍ରିକାଲ', 'ବାଇକ୍ ମେକାନିକ', 'ଆଧୁନିକ ଚମଡ଼ା ସାମଗ୍ରୀ', 'ସିଲେଇ କାର୍ଯ୍ୟ'],
    },
    preference: {
      question: (name) =>
        `₹୫୦,୦୦୦ ଅନୁଦାନରେ ନିଜର ଦୋକାନ/ସ୍ୱରୋଜଗାର କରିବେ ନା କମ୍ପାନୀରେ ଚାକିରି କରିବେ?`,
      quickOptions: ['ନିଜ ଦୋକାନ / ସ୍ୱରୋଜଗାର', 'କମ୍ପାନୀ ଚାକିରି', 'ଯେକୌଣସି'],
    },
    location: {
      question: (name) =>
        `ଆପଣ କେଉଁ ଜିଲ୍ଲାରେ ରୁହନ୍ତି? ଗାଁ ପାଖରେ ତାଲିମ ଚାହାନ୍ତି ନା ଜିଲ୍ଲା ସଦରକୁ ଯାଇପାରିବେ?`,
      quickOptions: ['ମୟୂରଭଞ୍ଜ (ଗାଁରେ)', 'କଟକ (ସହର ଯାଇପାରିବି)', 'ବ୍ଲକ ସ୍ତରରେ', 'ଅନ୍ୟ ଜିଲ୍ଲା'],
    },
    complete: {
      question: (name) =>
        `ଅଭିନନ୍ଦନ ${name}! ଆପଣଙ୍କର ସମସ୍ତ ତଥ୍ୟ ସଂଗ୍ରହ ହୋଇଛି। ଆପଣଙ୍କ ପାଇଁ NSQF କୋର୍ସ ଏବଂ ₹୫୦,୦୦୦ ଅନୁଦାନ ପ୍ରସ୍ତୁତ!`,
      quickOptions: ['କୋର୍ସ ଦେଖନ୍ତୁ', 'MIS ପୋର୍ଟାଲ ସିଙ୍କ କରନ୍ତୁ', 'ତଥ୍ୟ ସଂଶୋଧନ କରନ୍ତୁ'],
    },
  },
  kn: {
    education: {
      question: (name) =>
        `ನಮಸ್ಕಾರ ${name} ಅವರೇ! ನಾನು ನಿಮ್ಮ ಅಜಯ್-ಮಿತ್ರ. PM-AJAY ಅಡಿಯಲ್ಲಿ ₹50,000 ಅನುದಾನ ಮತ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿಗಾಗಿ, ಮೊದಲಿಗೆ ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸ ಎಷ್ಟು ಎಂದು ತಿಳಿಸಿ?`,
      quickOptions: ['8ನೇ ತರಗತಿ ಪಾಸ್', '10ನೇ ತರಗತಿ ಪಾಸ್', '5ನೇ ತರಗತಿ ಪಾಸ್', '12ನೇ ತರಗತಿ', 'ಅನೌಪಚಾರಿಕ ಶಿಕ್ಷಣ'],
    },
    traditional: {
      question: (name) =>
        `ಧನ್ಯವಾದಗಳು ${name}! ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಚರ್ಮದ ಕೆಲಸ, ನೇಯ್ಗೆ, ಬಡಗಿ ಕೆಲಸ ಅಥವಾ ಕೃಷಿ ಕಾರ್ಮಿಕರಂತಹ ಯಾವುದೇ ಸಾಂಪ್ರದಾಯಿಕ ವೃತ್ತಿ ಇದೆಯೇ?`,
      quickOptions: ['ಚರ್ಮ ಮತ್ತು ಪಾದರಕ್ಷೆ ಕೆಲಸ', 'ನೇಯ್ಗೆ ಕಲೆ', 'ಬಡಗಿ ಕೆಲಸ', 'ಕೃಷಿ ಕೂಲಿ', 'ಯಾವುದೇ ಸಾಂಪ್ರದಾಯಿಕ ಕೆಲಸವಿಲ್ಲ'],
    },
    current: {
      question: (name) =>
        `ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ಅಂದಾಜು ಮಾಸಿಕ ಆದಾಯ ಎಷ್ಟು?`,
      quickOptions: ['ದೈನಂದಿನ ಕೂಲಿ', 'ಕಾರ್ಯಾಗಾರದಲ್ಲಿ ಸಹಾಯಕ', 'ಉದ್ಯೋಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ', 'ಸಣ್ಣ ರಿಪೇರಿ ಕೆಲಸ'],
    },
    interests: {
      question: (name) =>
        `ಮುಂದೆ ನೀವು ಯಾವ ಕೌಶಲ್ಯವನ್ನು ಕಲಿಯಲು ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ? (ಸೋಲಾರ್, ಎಲೆಕ್ಟ್ರಿಕಲ್, ಬೈಕ್ ಮೆಕ್ಯಾನಿಕ್, ಟೈಲರಿಂಗ್)?`,
      quickOptions: ['ಸೋಲಾರ್ ಮತ್ತು ವಿದ್ಯುತ್ ನಿರ್ವಹಣೆ', 'ದ್ವಿಚಕ್ರ ವಾಹನ ಮೆಕ್ಯಾನಿಕ್', 'ಆಧುನಿಕ ಚರ್ಮ ಉತ್ಪನ್ನಗಳು', 'ಟೈಲರಿಂಗ್'],
    },
    preference: {
      question: (name) =>
        `₹50,000 ಸರಕಾರಿ ಅನುದಾನದಿಂದ ಸ್ವಂತ ವ್ಯಾಪಾರ / ಅಂಗಡಿ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ಕಂಪನಿಯಲ್ಲಿ ಉದ್ಯೋಗವೇ?`,
      quickOptions: ['ಸ್ವಂತ ಅಂಗಡಿ / ಉದ್ಯಮ', 'ಕಂಪನಿ ಉದ್ಯೋಗ', 'ಯಾವುದಾದರೂ ಪರವಾಗಿಲ್ಲ'],
    },
    location: {
      question: (name) =>
        `ನೀವು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ? ತರಬೇತಿ ಹಳ್ಳಿಯಲ್ಲೇ ಬೇಕೇ ಅಥವಾ ಜಿಲ್ಲಾ ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಬಹುದೇ?`,
      quickOptions: ['ಕಲಬುರಗಿ (ಹಳ್ಳಿಯಲ್ಲಿ)', 'ಬೆಳಗಾವಿ (ಜಿಲ್ಲಾ ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಬಲ್ಲೆ)', 'ತಾಲೂಕು ಮಟ್ಟದಲ್ಲಿ', 'ಇತರ ಜಿಲ್ಲೆ'],
    },
    complete: {
      question: (name) =>
        `ಅಭಿನಂದನೆಗಳು ${name}! ನಿಮ್ಮ ಎಲ್ಲಾ ವಿವರಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ. ನಿಮಗಾಗಿ ಸೂಕ್ತವಾದ NSQF ಕೋರ್ಸ್‌ಗಳು ಮತ್ತು ₹50,000 PM-AJAY ಅನುದಾನ ಸಿದ್ಧವಾಗಿದೆ!`,
      quickOptions: ['ಕೋರ್ಸ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ', 'MIS ಪೋರ್ಟಲ್‌ಗೆ ಸಿಂಕ್ ಮಾಡಿ', 'ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ'],
    },
  },
};

export const STEP_ORDER: Array<'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location'> = [
  'education',
  'traditional',
  'current',
  'interests',
  'preference',
  'location',
];

export function getNextStepKey(
  currentKey: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete'
): 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete' {
  const idx = STEP_ORDER.indexOf(currentKey as any);
  if (idx === -1 || idx === STEP_ORDER.length - 1) {
    return 'complete';
  }
  return STEP_ORDER[idx + 1];
}

export function generateProgressiveReply(
  userText: string,
  lang: SupportedLanguage,
  justAnsweredStep: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete',
  nextStep: 'education' | 'traditional' | 'current' | 'interests' | 'preference' | 'location' | 'complete',
  updatedProfile: BeneficiaryProfile
): string {
  const name = updatedProfile.name || 'प्रवीण';
  const langKey = INTERVIEW_QUESTIONS[lang] ? lang : 'en';

  if (nextStep === 'complete') {
    return (
      INTERVIEW_QUESTIONS[langKey]?.complete?.question(name) ||
      INTERVIEW_QUESTIONS.en.complete.question(name)
    );
  }

  let ack = '';
  if (langKey === 'hi') {
    if (justAnsweredStep === 'education') {
      ack = `बहुत बढ़िया ${name} जी! आपकी शिक्षा (${updatedProfile.educationLevel || '8वीं पास'}) दर्ज कर ली गई है। `;
    } else if (justAnsweredStep === 'traditional') {
      ack = `धन्यवाद ${name} जी! पारंपरिक कौशल (${updatedProfile.traditionalOccupation || 'पारंपरिक हुनर'}) का विवरण नोट हो गया। `;
    } else if (justAnsweredStep === 'current') {
      ack = `बहुत खूब ${name} जी, वर्तमान कार्य की जानकारी मिल गई। `;
    } else if (justAnsweredStep === 'interests') {
      ack = `शानदार पसंद ${name} जी! `;
    } else if (justAnsweredStep === 'preference') {
      ack = `उत्तम लक्ष्य ${name} जी! `;
    } else if (justAnsweredStep === 'location') {
      ack = `बहुत अच्छा ${name} जी! `;
    }
  } else if (langKey === 'mr') {
    if (justAnsweredStep === 'education') {
      ack = `खूप छान ${name} जी! तुमचे शिक्षण (${updatedProfile.educationLevel || 'नोंदणीकृत'}) नोंदवले आहे. `;
    } else if (justAnsweredStep === 'traditional') {
      ack = `धन्यवाद ${name} जी, कौटुंबिक कौशल्याची नोंद झाली. `;
    } else if (justAnsweredStep === 'current') {
      ack = `समजले ${name} जी. `;
    } else {
      ack = `उत्तम विचार ${name} जी! `;
    }
  } else if (langKey === 'ta') {
    if (justAnsweredStep === 'education') {
      ack = `அருமை ${name}! உங்கள் கல்வித் தகுதி (${updatedProfile.educationLevel || 'பதிவு'}) பதிவு செய்யப்பட்டது. `;
    } else {
      ack = `நன்றி ${name}! `;
    }
  } else {
    if (justAnsweredStep === 'education') {
      ack = `Excellent, ${name} ji! Your education (${updatedProfile.educationLevel || 'recorded'}) is noted. `;
    } else if (justAnsweredStep === 'traditional') {
      ack = `Thank you ${name} ji! Your background (${updatedProfile.traditionalOccupation || 'recorded'}) is noted. `;
    } else if (justAnsweredStep === 'current') {
      ack = `Understood, ${name} ji. `;
    } else if (justAnsweredStep === 'interests') {
      ack = `Great choice! `;
    } else if (justAnsweredStep === 'preference') {
      ack = `Wonderful goal! `;
    } else {
      ack = `Thank you ${name} ji! `;
    }
  }

  const nextQuestionObj =
    INTERVIEW_QUESTIONS[langKey]?.[nextStep] || INTERVIEW_QUESTIONS.en[nextStep];
  const nextQuestionText = nextQuestionObj
    ? nextQuestionObj.question(name, userText)
    : INTERVIEW_QUESTIONS.en[nextStep].question(name, userText);

  return `${ack}${nextQuestionText}`;
}

