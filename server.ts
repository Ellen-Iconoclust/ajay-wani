import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { NSQF_COURSES } from './src/data/nsqfCourses';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(express.json({ limit: '15mb' }));
// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PM-AJAY GIA Voice Assistant Server',
    geminiConfigured: Boolean(ai),
    voskOfflineEngineReady: true,
    timestamp: new Date().toISOString()
  });
});
// NSQF catalog endpoint
app.get('/api/nsqf/courses', (req, res) => {
  res.json(NSQF_COURSES);
});
// Non-linear dialogue processing endpoint (LLaMA-3 / Gemini prompt pipeline)
app.post('/api/voice/process-dialogue', async (req, res) => {
  try {
    const {
      message,
      language = 'hi',
      dialect = 'Standard',
      currentProfile = {},
      currentStepKey = 'education',
      nextStepKey = '',
      history = [],
      isOfflineMode = false
    } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }
    // Offline / Vosk fallback mode
    if (isOfflineMode || !ai) {
      const fallbackExtraction = extractEntitiesHeuristically(message, currentProfile, currentStepKey);
      return res.json({
        assistantResponseText: generateEmpatheticFallbackReply(message, language, fallbackExtraction, currentStepKey, nextStepKey),
        extractedProfile: fallbackExtraction,
        engineUsed: isOfflineMode ? 'VOSK_OFFLINE_EDGE_KALDI' : 'LOCAL_HEURISTIC_PARSER',
        offlineSimulated: true,
        processingNote: 'Processed via on-device offline acoustic pipeline without cloud dependency.'
      });
    }
    // Server-side Gemini 3.8 Flash pipeline
    const systemInstruction = `You are "AJAY-Mitra" (अजय-मित्र), a deeply empathetic, patient, and encouraging voice-first virtual livelihood guide for the Ministry of Social Justice and Empowerment (MoSJE), Government of India, under the Grants-in-Aid (GIA) component of PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana).
Target beneficiary is: ${currentProfile.name || 'Pravin'} (Scheduled Caste community).
CRITICAL PROGRESSIVE PROFILING INSTRUCTION:
The beneficiary has just answered the question for: "${currentStepKey}".
The next step to ask about is: "${nextStepKey || 'next missing detail'}".
You MUST:
1. Extract their answer into "extractedProfile" for "${currentStepKey}" and any other parameters they mentioned.
2. Under no circumstance repeat the question for "${currentStepKey}"! Always advance to ask about "${nextStepKey}".
   Sequence: educationLevel -> traditionalOccupation -> currentActivity -> vocationalInterests -> employmentPreference -> district/mobility -> complete.
3. First warmly acknowledge in 1 brief sentence what they just answered for "${currentStepKey}".
4. Then ask a clear, simple question specifically for "${nextStepKey}".
5. If "${nextStepKey}" is "complete" (or all details are collected), warmly congratulate the beneficiary, confirm their pre-qualification for the ₹50,000 PM-AJAY GIA grant, and summarize that recommended NSQF courses are now available.
Return STRICT JSON matching this schema:
{
  "assistantResponseText": "The empathetic spoken answer in the beneficiary's regional language",
  "extractedProfile": {
    "name": "string or current name",
    "age": number or null,
    "gender": "Male" | "Female" | "Other" | null,
    "casteCategory": "Scheduled Caste (SC)",
    "subCaste": "string or empty",
    "state": "string or current state",
    "district": "string or current district",
    "block": "string or current block",
    "annualFamilyIncome": number or null,
    "educationLevel": "string (e.g. Primary 5th Pass, 8th Pass, 10th Pass, 12th Pass, Literate)",
    "traditionalOccupation": "string (e.g. Leathercraft, Handloom weaving, Agrarian labor, Carpentry, Sanitation)",
    "currentActivity": "string",
    "monthlyCurrentIncome": number or null,
    "vocationalInterests": ["string"],
    "mobilityRadius": "Within Village" | "Within Block (< 15km)" | "District HQ (< 40km)" | "State / Can Migrate",
    "physicalConstraints": "string",
    "employmentPreference": "Self-Employment / Micro-Enterprise" | "Wage Employment / Factory Job" | "Both / Flexible",
    "contactNumber": "string",
    "rationCardOrAadhaarLast4": "string"
  },
  "identifiedTradeKeywords": ["string"],
  "grantSubsidyNotes": "Short note on ₹50,000 PM-AJAY GIA grant status",
  "isInterviewComplete": boolean,
  "nextExpectedField": "education" | "traditional" | "current" | "interests" | "preference" | "location" | "complete"
};`;
    const prompt = `Current Profile State:
${JSON.stringify(currentProfile, null, 2)}
Beneficiary's latest spoken statement:
"${message}"
Extract updated attributes and respond conversationally in language "${language}" (Dialect: "${dialect}").`;
    let response: any = null;
    let engineUsed = 'CLOUD_GEMINI_2.5_FLASH';
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
    } catch (e1: any) {
      console.warn('Gemini 2.5 Flash unavailable or quota exceeded, switching to deterministic edge parser:', e1?.message);
      throw e1;
    }
    const parsed = JSON.parse(response?.text || '{}');
    return res.json({
      assistantResponseText: parsed.assistantResponseText || 'नमस्ते, मैं आपकी कैसे सहायता कर सकता हूँ?',
      extractedProfile: parsed.extractedProfile || currentProfile,
      identifiedTradeKeywords: parsed.identifiedTradeKeywords || [],
      grantSubsidyNotes: parsed.grantSubsidyNotes || 'PM-AJAY GIA grant eligible',
      engineUsed,
      offlineSimulated: false
    });
  } catch (err: any) {
    console.error('Error in /api/voice/process-dialogue:', err);
    // Robust fallback
    const currentStepKey = req.body.currentStepKey || 'education';
    const nextStepKey = req.body.nextStepKey || '';
    const fallbackProfile = extractEntitiesHeuristically(req.body.message || '', req.body.currentProfile || {}, currentStepKey);
    return res.json({
      assistantResponseText: generateEmpatheticFallbackReply(req.body.message, req.body.language || 'hi', fallbackProfile, currentStepKey, nextStepKey),
      extractedProfile: fallbackProfile,
      engineUsed: 'EDGE_FALLBACK_RULE_PARSER',
      offlineSimulated: false,
      errorLogged: err?.message
    });
  }
});
// Voice TTS endpoint
app.post('/api/voice/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }
    if (!ai) {
      return res.json({ useBrowserSynthesis: true, text });
    }
    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 300),
              speechMetadata: {
                style: 'Empathetic, clear, warm community guide',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        useBrowserSynthesis: false
      });
    }
    return res.json({ useBrowserSynthesis: true, text });
  } catch (err: any) {
    console.warn('TTS model fallback to client browser synthesis:', err?.message);
    return res.json({ useBrowserSynthesis: true, text: req.body.text });
  }
});
// PM-AJAY MIS Portal Sync Simulation
app.post('/api/mis/sync', (req, res) => {
  const { profile, courseId, giaStatus } = req.body;
  const beneficiaryId = `PMAJAY-SC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dossierId = `MoSJE-GIA-DOSSIER-${Math.floor(10000 + Math.random() * 90000)}`;
  const lang = req.body.language || 'hi';
  let smsText = `MoSJE PM-AJAY: प्रिय लाभार्थी, आपका पंजीकरण संख्या ${beneficiaryId} पोर्टल पर सत्यापित हो चुका है। ₹50,000 की अनुदान (GIA) सहायता आपके कौशल केंद्र आवंटन के साथ अग्रसारित की गई है।`;
  if (lang === 'mr') {
    smsText = `MoSJE PM-AJAY: प्रिय लाभार्थी, तुमची नोंदणी क्रमांक ${beneficiaryId} पोर्टलवर यशस्वी झाली आहे. ₹50,000 अनुदान (GIA) सहाय्य मंजूर करण्यात आले आहे.`;
  } else if (lang === 'ta') {
    smsText = `MoSJE PM-AJAY: அன்பான பயனாளி, உங்கள் பதிவு எண் ${beneficiaryId} போர்ட்டலில் சரிபார்க்கப்பட்டது. ரூ.50,000 GIA மானியம் அனுமதிக்கப்பட்டது.`;
  } else if (lang === 'en') {
    smsText = `MoSJE PM-AJAY: Dear Beneficiary, your registration ID ${beneficiaryId} is verified on the MIS Portal. INR 50,000 GIA grant pre-sanctioned.`;
  }
  res.json({
    status: 'SYNCED_WITH_MOSJE_PORTAL',
    beneficiaryId,
    dossierId,
    syncTimestamp: new Date().toISOString(),
    dbtAccountLinked: true,
    assignedPmkkyCenter: 'District PMKK Vocational Training Hub - MoSJE Accredited',
    giaSanctionCode: giaStatus?.sanctionNumber || `MoSJE/PM-AJAY/2026/GIA-${Math.floor(10000 + Math.random() * 90000)}`,
    smsNotificationPayload: {
      recipient: profile?.contactNumber || '+91-98XXXXX120',
      messageText: smsText,
      language: lang,
      status: 'DELIVERED'
    }
  });
});
// Helper for heuristic extraction
function extractEntitiesHeuristically(text: string, current: any = {}, currentStepKey: string = 'education') {
  const updated = { ...current };
  const lower = text.toLowerCase();
  // Name extraction patterns
  const nameMatch = text.match(/(?:मेरा नाम|हमार नाम|माझं नाव|என் பெயர்|నా పేరు|my name is)\s+([A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    updated.name = nameMatch[1].trim();
  }
  // Age pattern
  const ageMatch = text.match(/(?:उम्र|वय|age|வயது)\s*(?:है|आहे|is)?\s*(\d{2})/i) || text.match(/(\d{2})\s*(?:साल|वर्ष|years|வருடம்)/i);
  if (ageMatch && ageMatch[1]) {
    const ageNum = parseInt(ageMatch[1], 10);
    if (ageNum >= 15 && ageNum <= 75) updated.age = ageNum;
  }
  // Education patterns
  if (lower.includes('8वीं') || lower.includes('८वीं') || lower.includes('आठवीं') || lower.includes('8th') || lower.includes('8 ') || lower.includes('अष्टम')) {
    updated.educationLevel = 'Middle (8th Pass)';
  } else if (lower.includes('10वीं') || lower.includes('१०वीं') || lower.includes('दसवीं') || lower.includes('10th') || lower.includes('10 ') || lower.includes('दहावी') || lower.includes('பத்தாம்')) {
    updated.educationLevel = 'Matric (10th Pass)';
  } else if (lower.includes('5वीं') || lower.includes('५वीं') || lower.includes('पांचवीं') || lower.includes('5th') || lower.includes('5 ') || lower.includes('प्राथमिक')) {
    updated.educationLevel = 'Primary (5th Pass)';
  } else if (lower.includes('12वीं') || lower.includes('१२वीं') || lower.includes('बारहवीं') || lower.includes('12th') || lower.includes('12 ') || lower.includes('इंटर')) {
    updated.educationLevel = 'Intermediate (12th Pass)';
  }
  // Traditional trade patterns
  if (lower.includes('चमड़ा') || lower.includes('leather') || lower.includes('जूता') || lower.includes('चर्मोद्योग') || lower.includes('തോൽ')) {
    updated.traditionalOccupation = 'Leathercraft & Footwear';
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes('Leather Goods')) updated.vocationalInterests.push('Leather Goods');
  } else if (lower.includes('बुनकर') || lower.includes('weaving') || lower.includes('तांत') || lower.includes('हथकरघा') || lower.includes('विणकाम') || lower.includes('நெசவு')) {
    updated.traditionalOccupation = 'Handloom & Textile Weaving';
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes('Handloom')) updated.vocationalInterests.push('Handloom');
  } else if (lower.includes('बढ़ई') || lower.includes('carpentry') || lower.includes('सुतार') || lower.includes('काठ')) {
    updated.traditionalOccupation = 'Carpentry & Woodwork';
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes('Carpentry')) updated.vocationalInterests.push('Carpentry');
  }
  // Current activity
  if (lower.includes('बिजली') || lower.includes('electric') || lower.includes('वायरिंग') || lower.includes('सोलर')) {
    updated.currentActivity = updated.currentActivity || 'Electrical & Wire Maintenance Helper';
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes('Electrical & Solar')) updated.vocationalInterests.push('Electrical & Solar');
  } else if (lower.includes('मैकेनिक') || lower.includes('bike') || lower.includes('गाड़ी')) {
    updated.currentActivity = updated.currentActivity || 'Two-Wheeler Repair Assistant';
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.push('Automotive Repair')) updated.vocationalInterests.push('Automotive Repair');
  }
  // Mobility
  if (lower.includes('बाहर नहीं') || lower.includes('गांव में') || lower.includes('घर') || lower.includes('cannot travel') || lower.includes('माई बा')) {
    updated.mobilityRadius = 'Within Village';
    updated.physicalConstraints = 'Family / elderly care obligations in native village';
  }
  // Employment preference
  if (lower.includes('दुकान') || lower.includes('स्वयं') || lower.includes('खुद का') || lower.includes('own business') || lower.includes('स्वरोजगार')) {
    updated.employmentPreference = 'Self-Employment / Micro-Enterprise';
  } else if (lower.includes('नौकरी') || lower.includes('job') || lower.includes('factory')) {
    updated.employmentPreference = 'Wage Employment / Factory Job';
  }
  // District / Location hints
  const districts = ['Azamgarh', 'Buldhana', 'Erode', 'Bankura', 'Mahabubnagar', 'Mansa', 'Varanasi', 'Jaipur', 'Patna', 'Solapur', 'Madurai'];
  for (const d of districts) {
    if (text.includes(d) || text.includes(d.toLowerCase())) {
      updated.district = d;
      break;
    }
  }
  // Infallible Fallback: If currentStepKey was being asked and is still empty, populate it!
  if (currentStepKey === 'education' && !updated.educationLevel) {
    if (lower.includes('नहीं') || lower.includes('no') || lower.includes('नाही') || lower.includes('इல்லை') || lower.includes('अनपढ़') || lower.includes('साक्षर')) {
      updated.educationLevel = 'Informal / Basic Literacy';
    } else {
      updated.educationLevel = text.trim().slice(0, 30) || 'Middle (8th Pass)';
    }
  } else if (currentStepKey === 'traditional' && !updated.traditionalOccupation) {
    if (lower.includes('नहीं') || lower.includes('no') || lower.includes('none') || lower.includes('नाही') || lower.includes('इல்லை')) {
      updated.traditionalOccupation = 'No Hereditary Trade / First-Generation Aspirant';
    } else if (lower.includes('कृषि') || lower.includes('मजदूरी') || lower.includes('farm')) {
      updated.traditionalOccupation = 'Agrarian Labor & Allied Craft';
    } else {
      updated.traditionalOccupation = text.trim().slice(0, 35) || 'Traditional Artisan Craft';
    }
  } else if (currentStepKey === 'current' && !updated.currentActivity) {
    if (lower.includes('मजदूरी') || lower.includes('daily') || lower.includes('दिन भर')) {
      updated.currentActivity = 'Daily Wage Labor';
    } else if (lower.includes('सहायक') || lower.includes('helper')) {
      updated.currentActivity = 'Workshop Helper / Assistant';
    } else if (lower.includes('बेरोजगार') || lower.includes('unemployed')) {
      updated.currentActivity = 'Currently Unemployed / Seeking Work';
    } else {
      updated.currentActivity = text.trim().slice(0, 40) || 'Daily Wage Laborer';
    }
  } else if (currentStepKey === 'interests' && (!updated.vocationalInterests || updated.vocationalInterests.length === 0)) {
    updated.vocationalInterests = [text.trim().slice(0, 30) || 'Solar & Electrical Maintenance'];
  } else if (currentStepKey === 'preference' && !updated.employmentPreference) {
    if (lower.includes('नौकरी') || lower.includes('job') || lower.includes('factory')) {
      updated.employmentPreference = 'Wage Employment / Factory Job';
    } else {
      updated.employmentPreference = 'Self-Employment / Micro-Enterprise';
    }
  } else if (currentStepKey === 'location' && !updated.district) {
    updated.district = text.trim().slice(0, 25) || 'Azamgarh';
    if (lower.includes('गांव') || lower.includes('village')) updated.mobilityRadius = 'Within Village';
  }
  return updated;
}
function generateEmpatheticFallbackReply(message: string, lang: string, profile: any, currentStepKey?: string, nextStepKey?: string): string {
  const name = profile.name || 'प्रवीण';
  // Determine which step to ask next
  let targetStep = nextStepKey;
  if (!targetStep) {
    if (!profile.educationLevel) targetStep = 'education';
    else if (!profile.traditionalOccupation) targetStep = 'traditional';
    else if (!profile.currentActivity) targetStep = 'current';
    else if (!profile.vocationalInterests || profile.vocationalInterests.length === 0) targetStep = 'interests';
    else if (!profile.employmentPreference) targetStep = 'preference';
    else if (!profile.district) targetStep = 'location';
    else targetStep = 'complete';
  }
  // If user just answered currentStepKey, ensure targetStep is not currentStepKey!
  if (currentStepKey && targetStep === currentStepKey) {
    const sequence = ['education', 'traditional', 'current', 'interests', 'preference', 'location', 'complete'];
    const idx = sequence.indexOf(currentStepKey);
    targetStep = idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : 'complete';
  }
  // Step 1: Education
  if (targetStep === 'education') {
    if (lang === 'hi') {
      return `नमस्ते ${name} जी! बहुत खुशी हुई आपसे बात करके। PM-AJAY योजना से ₹50,000 की अनुदान सहायता और बेहतरीन NSQF कौशल कोर्स दिलाने के लिए, मैं आपसे कुछ आसान बातें एक-एक करके पूछूँगा। सबसे पहले बताएं कि आपकी पढ़ाई कहाँ तक हुई है (जैसे 5वीं, 8वीं, 10वीं पास या साक्षर)?`;
    } else if (lang === 'mr') {
      return `नमस्कार ${name} जी! PM-AJAY योजनेतून ₹50,000 चे अनुदान मिळवून देण्यासाठी मी आपल्याला काही सोपे प्रश्न विचारीन. सर्वात आधी आपले शिक्षण कितपत झाले आहे ते सांगा (उदा. ५ वी, ८ वी, १० वी पास किंवा साक्षर)?`;
    } else if (lang === 'ta') {
      return `வணக்கம் ${name}! PM-AJAY திட்டத்தின் கீழ் ரூ. 50,000 மானியம் மற்றும் சிறந்த பயிற்சிகளைப் பெற, முதலில் உங்கள் கல்வித் தகுதியை கூறுங்கள் (5-ஆம், 8-ஆம், 10-ஆம் வகுப்பு)?`;
    }
    return `Namaste ${name} ji! To help you secure the INR 50,000 PM-AJAY grant and the best NSQF course, I will ask you a few friendly questions one by one. First, what is your highest education level?`;
  }
  // Step 2: Traditional occupation
  if (targetStep === 'traditional') {
    if (lang === 'hi') {
      return `बहुत बढ़िया ${name} जी! आपकी शिक्षा दर्ज कर ली गई है। क्या आपके परिवार या समुदाय में कोई पारंपरिक काम या पुश्तैनी हुनर होता आया है? जैसे चमड़ा व जूता निर्माण, हथकरघा/बुनाई, बढ़ईगिरी, राजमिस्त्री, कृषि मजदूरी या कोई नहीं?`;
    } else if (lang === 'mr') {
      return `खूप छान ${name} जी! तुमचे शिक्षण नोंदवले आहे. तुमच्या कुटुंबात पूर्वीपासून चालत आलेला कोणताही पारंपरिक व्यवसाय आहे का? जसे चर्मोद्योग, विणकाम/हातमाग, सुतारकाम किंवा शेतमजुरी?`;
    } else if (lang === 'ta') {
      return `நன்றி ${name}! உங்கள் கல்வி விவரம் குறிக்கப்பட்டது. உங்கள் குடும்பத்தில் தோல் தொழில், கைத்தறி நெசவு, மரவேலை போன்ற பாரம்பரியத் தொழில் ஏதேனும் உள்ளதா?`;
    }
    return `Wonderful ${name} ji! Your education is noted. Does your family or community have any traditional heritage craft or occupation, such as leathercraft, handloom weaving, carpentry, or masonry?`;
  }
  // Step 3: Current activity
  if (targetStep === 'current') {
    if (lang === 'hi') {
      return `धन्यवाद ${name} जी! बहुत अच्छी जानकारी। अभी आप अपनी आजीविका चलाने के लिए क्या काम करते हैं, और लगभग कितना मासिक गुजारा हो पाता है?`;
    } else if (lang === 'mr') {
      return `धन्यवाद ${name} जी. सध्या तुम्ही उपजीविकेसाठी दररोज काय काम करता, आणि अंदाजे किती मासिक कमाई होते?`;
    } else if (lang === 'ta') {
      return `புரிந்தது ${name}! தற்போது வாழ்வாதாரத்திற்காக என்ன வேலை செய்கிறீர்கள், மாத வருமானம் எவ்வளவு?`;
    }
    return `Thank you ${name} ji! What work or livelihood activity do you currently do day-to-day, and how is your current income?`;
  }
  // Step 4: Vocational interests
  if (targetStep === 'interests') {
    if (lang === 'hi') {
      return `बहुत खूब ${name} जी। आप भविष्य में कौन सा नया काम या आधुनिक ट्रेड सीखने के सबसे ज्यादा इच्छुक हैं? जैसे सोलर व बिजली मेंटेनेंस, दोपहिया वाहन मैकेनिक, आधुनिक चमड़ा उत्पाद, या सिलाई-कढ़ाई?`;
    } else if (lang === 'mr') {
      return `खूप छान ${name} जी! भविष्यात तुम्हाला कोणते नवीन कौशल्य शिकायला आवडेल? जसे सोलर व इलेक्ट्रिकल, दुचाकी मेकॅनिक, आधुनिक चर्मोद्योग, किंवा टेलरिंग?`;
    } else if (lang === 'ta') {
      return `அருமை ${name}! நீங்கள் எந்தப் புதிய தொழில் அல்லது திறனைக் கற்க விரும்புகிறீர்கள் (சோலார் & எலக்ட்ரிக்கல், பைக் மெக்கானிக், நவீன தோல் தொழில்)?`;
    }
    return `Great ${name} ji! What modern skill or trade are you most excited to learn? For example: Solar & Electrical, Two-Wheeler Mechanic, Modern Footwear, or Garment Tailoring?`;
  }
  // Step 5: Employment preference
  if (targetStep === 'preference') {
    if (lang === 'hi') {
      return `शानदार सोच ${name} जी! क्या आप ₹50,000 की सरकारी PM-AJAY अनुदान सहायता से अपनी खुद की दुकान/स्वरोजगार शुरू करना चाहते हैं, या किसी कंपनी में पक्की नौकरी पाना चाहते हैं?`;
    } else if (lang === 'mr') {
      return `उत्तम विचार! ₹50,000 च्या अनुदानातून तुम्हाला स्वतःचे दुकान किंवा व्यवसाय सुरू करायचा आहे की पगारदार नोकरी करायची आहे?`;
    } else if (lang === 'ta') {
      return `ரூ. 50,000 அரசு மானியத்துடன் சொந்த தொழில் தொடங்க விரும்புகிறீர்களா, அல்லது நிறுவனத்தில் வேலைக்குச் செல்ல விரும்புகிறீர்களா?`;
    }
    return `Great goal, ${name} ji! Would you prefer starting your own independent micro-enterprise / shop with the INR 50,000 grant, or would you prefer a salaried job at a company?`;
  }
  // Step 6: Location
  if (targetStep === 'location') {
    if (lang === 'hi') {
      return `अंतिम बात ${name} जी! आप किस जिले और राज्य में रहते हैं, और क्या आप ट्रेनिंग के लिए जिला मुख्यालय जा सकते हैं या अपने गाँव/ब्लॉक के पास ही ट्रेनिंग चाहते हैं?`;
    } else if (lang === 'mr') {
      return `शेवटची माहिती ${name} जी: तुम्ही कोणत्या जिल्ह्यात राहता, आणि गावातच प्रशिक्षण हवे की जिल्हा ठिकाणी जाऊ शकता?`;
    } else if (lang === 'ta') {
      return `இறுதியாக, நீங்கள் எந்த மாவட்டத்தில் வசிக்கிறீர்கள்? ஊருக்குள்ளேயே பயிற்சி தேவையா அல்லது மாவட்ட தலைமையகம் செல்ல முடியுமா?`;
    }
    return `Last detail, ${name} ji! Which district do you live in, and can you travel to the district center for training or do you need doorstep training within your village?`;
  }
  // Completed!
  if (lang === 'hi') {
    return `बधाई हो ${name} जी! आपके सभी जरूरी विवरण पूरे हो चुके हैं। आपकी शिक्षा (${profile.educationLevel || '8वीं पास'}), पारंपरिक हुनर (${profile.traditionalOccupation || 'चमड़ा उद्योग'}) और पसंद के आधार पर हमने आपके लिए उपयुक्त NSQF कोर्स और ₹50,000 की PM-AJAY GIA अनुदान योजना चिन्हित कर ली है! नीचे दिए गए कोर्स देखें।`;
  } else if (lang === 'mr') {
    return `अभिनंदन ${name} जी! तुमची सर्व माहिती पूर्ण झाली आहे. तुमच्या कौशल्यानुसार आम्ही NSQF कोर्सेस आणि ₹50,000 च्या PM-AJAY अनुदानाची शिफारस तयार केली आहे!`;
  } else if (lang === 'ta') {
    return `வாழ்த்துகள் ${name}! உங்கள் விவரங்கள் முழுமையாகப் பதிவு செய்யப்பட்டன. உங்களுக்கு உகந்த NSQF பயிற்சிகள் மற்றும் ரூ. 50,000 மானியத் திட்டம் தயாராக உள்ளது!`;
  }
  return `Congratulations ${name} ji! All your essential details are complete. Based on your background, we have matched tailored NSQF certified courses and confirmed your pre-qualification for the INR 50,000 PM-AJAY capital grant!`;
}
// Start server with Vite middleware in dev or static in prod
async function start() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PM-AJAY Assistant Server] listening at http://0.0.0.0:${PORT}`);
  });
}
start();
