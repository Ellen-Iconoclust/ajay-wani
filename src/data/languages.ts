import { LanguageOption } from '../types/pmajay';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dialects: ['Standard Hindi', 'Awadhi', 'Bhojpuri', 'Braj', 'Chhattisgarhi']
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    dialects: ['Standard Marathi', 'Varhadi / Vidarbha', 'Marathwada', 'Deshi']
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    dialects: ['Standard Tamil', 'Madurai', 'Kongu', 'Thanjavur']
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    dialects: ['Standard Telugu', 'Telangana Rural', 'Rayalaseema', 'Coastal Andhra']
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    dialects: ['Standard Bengali', 'Rarh', 'Varendra', 'Rajbanshi']
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    dialects: ['Majhi', 'Malwai', 'Doabi', 'Pwadhi']
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    dialects: ['Standard Gujarati', 'Kathiawari', 'Surati', 'Charotari']
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    dialects: ['Standard Odia', 'Sambalpuri / Western Odia', 'Ganjami', 'Baleswari']
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    dialects: ['Standard Kannada', 'North Karnataka (Dharwad)', 'Mysore Kannada', 'Kundagannada']
  },
  {
    code: 'en',
    name: 'English (Indian)',
    nativeName: 'English (IN)',
    dialects: ['Pan-India Standard', 'Hinglish / Vernacular']
  }
];

export const SAMPLE_BENEFICIARY_UTTERANCES: {
  lang: string;
  dialect: string;
  text: string;
  englishSummary: string;
}[] = [
  {
    lang: 'hi',
    dialect: 'Bhojpuri / Poorvanchal',
    text: 'हमार नाम रामेश्वर बा, आजमगढ़ जिला से हैं। खानदान में बाबाजी लोग चमड़ा के काम करत रहलन पर हम आठवीं पास बानी। अभी गांव के पास बिजली-पंखा मरम्मत का काम सीखीले, बाहर ना जा सकीब बूढ़ी माई बा। आपन दुकान शुरू करे खातिर 50 हजार के मदद मिल जाई त जिनगी सुधर जाई।',
    englishSummary: 'Rameshwar from Azamgarh; traditional leathercraft background; 8th pass; basic electrical appliance repair skills; cannot migrate due to elderly mother; seeks ₹50,000 GIA grant for local micro-enterprise.'
  },
  {
    lang: 'mr',
    dialect: 'Varhadi / Vidarbha',
    text: 'माझं नाव विलास सपकाळ, बुलढाणा जिल्ह्यातून. घरात पूर्वीपासून विणकामाचा व्यवसाय होता, दहावी नापास झालोय. गावात सौर ऊर्जा आणि सोलर पंप बसवण्याचे काम करायचे आहे, कारण शेतात खूप मागणी आहे. स्वतःचा व्यवसाय सुरू करायचा विचार आहे.',
    englishSummary: 'Vilas Sapkal from Buldhana; family handloom weaving background; 10th standard; interested in solar pump and PV technician; high local demand in farming fields; desires self-employment.'
  },
  {
    lang: 'ta',
    dialect: 'Kongu / Western Tamil Nadu',
    text: 'என் பெயர் சுப்பிரமணி, ஈரோடு மாவட்டம். தந்தை கைத்தறி நெசவு வேலை செய்கிறார். நான் பத்தாம் வகுப்பு வரை படித்துள்ளேன். இரண்டு சக்கர வாகனம் (பைக்) மெக்கானிக் வேலை செய்து வருகிறேன். சொந்தமாக உதிரிபாகங்கள் பழுதுபார்க்கும் பட்டறை அமைக்க விரும்புகிறேன்.',
    englishSummary: 'Subramani from Erode; handloom weaver family; 10th pass; currently 2-wheeler mechanic helper; seeks to set up own rural bike repair garage.'
  },
  {
    lang: 'te',
    dialect: 'Telangana Rural',
    text: 'నా పేరు నరేష్, మహబూబ్ నగర్ జిల్లా. మా తాతముత్తాతలు తోలు వస్తువులు చేసేవారు. నేను 10వ తరగతి చదివాను. ప్రస్తుతం వ్యవసాయ కూలీగా పని చేస్తున్నాను. గ్రామంలో ఉంటూ తేనెటీగల పెంపకం లేదా పాడి పరిశ్రమ స్వయం ఉపాధి ప్రారంభించాలనుకుంటున్నాను.',
    englishSummary: 'Naresh from Mahabubnagar; leather artisan heritage; 10th pass; currently agricultural wage laborer; desires local dairy / organic agriculture micro-enterprise.'
  },
  {
    lang: 'bn',
    dialect: 'Rarh / Bankura',
    text: 'আমার নাম সুশান্ত মন্ডল, বাঁকুড়া জেলা। আমাদের বংশ পরম্পরায় তাঁতের কাজ ছিল। আমি অষ্টম শ্রেণি উত্তীর্ণ। এখন কাঠের কাজ ও ফার্নিচার মেরামতির কাজ করি। নিজের একটি ছোট আধুনিক কাঠের ওয়ার্কশপ করতে চাই যাতে পিএম-অজয় অনুদান সাহায্য করে।',
    englishSummary: 'Sushanto Mondal from Bankura; traditional handloom lineage; 8th pass; currently carpentry assistant; seeking modern carpentry & woodwork unit under PM-AJAY GIA.'
  },
  {
    lang: 'pa',
    dialect: 'Malwai / Punjab',
    text: 'ਮੇਰਾ ਨਾਂ ਜਸਵੀਰ ਸਿੰਘ ਹੈ, ਮਾਨਸਾ ਜ਼ਿਲ੍ਹਾ। ਪਰਿਵਾਰ ਵਿੱਚ ਪਹਿਲਾਂ ਚਮੜੇ ਅਤੇ ਜੁੱਤੀਆਂ ਦਾ ਕੰਮ ਹੁੰਦਾ ਸੀ। ਮੈਂ ਦਸਵੀਂ ਪਾਸ ਹਾਂ। ਹੁਣ ਟਰੈਕਟਰ ਅਤੇ ਡੀਜ਼ਲ ਇੰਜਣ ਮੁਰੰਮਤ ਦਾ ਕੰਮ ਸਿੱਖ ਰਿਹਾ ਹਾਂ। ਆਪਣੇ ਪਿੰਡ ਵਿੱਚ ਮੋਬਾਈਲ ਵਰਕਸ਼ਾਪ ਖੋਲ੍ਹਣ ਲਈ ਗ੍ਰਾਂਟ ਚਾਹੀਦੀ ਹੈ।',
    englishSummary: 'Jasveer Singh from Mansa; traditional footwear legacy; 10th pass; learning tractor & diesel engine repair; aims for mobile agricultural machinery workshop.'
  }
];
