import { NSQFCourse } from '../types/pmajay';

export const NSQF_COURSES: NSQFCourse[] = [
  {
    id: 'nsqf-solar-01',
    title: 'Solar PV Installer (Suryamitra)',
    titleRegional: {
      hi: 'सोलर पीवी इंस्टॉलर (सूर्यमित्र)',
      mr: 'सौर ऊर्जा संयंत्र तंत्रज्ञ (सूर्यमित्र)',
      ta: 'சூரிய சக்தி நிறுவுநர் (சூர்யமித்ரா)',
      te: 'సౌర విద్యుత్ సాంకేతిక నిపుణుడు (సూర్యమిత్ర)',
      bn: 'সৌর প্যানেল ইনস্টলার (সূর্যমিত্র)',
      pa: 'ਸੋਲਰ ਪੀਵੀ ਇੰਸਟਾਲਰ (ਸੂਰਿਆਮਿੱਤਰ)',
      gu: 'સોલર પીવી ઇન્સ્ટોલર (સૂર્યમિત્ર)',
      or: 'ସୌର ଶକ୍ତି ସ୍ଥାପନ ଟେକ୍ନିସିଆନ',
      kn: 'ಸೌರ ಶಕ್ತಿ ಅಳವಡಿಕೆ ತಜ್ಞ',
      en: 'Solar PV Installer (Suryamitra)'
    },
    sector: 'Skill Council for Green Jobs (SCGJ)',
    nsqfLevel: 4,
    qpCode: 'SGJ/Q0101',
    durationHours: 300,
    minEducation: '8th Pass with vocational interest or 10th Pass',
    matchScore: 94,
    matchReasons: [
      'Huge PM Surya Ghar subsidy demand in rural/peri-urban farm clusters',
      'Provides high self-employment earnings as local certified solar technician',
      'PM-AJAY GIA provides complete toolkit (inverter tester, safety harness, crimper)'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 18,000 - 28,000 / month',
    trainingCenters: [
      { name: 'PMKK District Skill Hub', location: 'Azamgarh / Varanasi Road', distanceKm: 8, seatsAvailable: 18 },
      { name: 'National Institute of Solar Energy Accredited Center', location: 'Buldhana Town', distanceKm: 12, seatsAvailable: 22 },
      { name: 'MoSJE Rural Technology Center', location: 'Erode Industrial Zone', distanceKm: 15, seatsAvailable: 14 }
    ],
    pmAjayGiaToolkitSupplied: 'Multimeter, Solar Crimping Tool, DC Voltage Clamp, Safety Belt, Hand Drill Kit (Worth INR 12,500)',
    placementGuarantee: '85% tie-up with Discom Rooftop Vendors & Rural Solar Cooperatives',
    careerPathway: 'Solar Rooftop Entrepreneur / Authorized Village Energy Technician'
  },
  {
    id: 'nsqf-electric-02',
    title: 'Domestic Electrical Appliance Care Technician',
    titleRegional: {
      hi: 'घरेलू विद्युत उपकरण सेवा तकनीशियन',
      mr: 'घरगुती विद्युत उपकरण दुरुस्ती तंत्रज्ञ',
      ta: 'வீட்டு மின்சாதன பழுதுபார்க்கும் தொழில்நுட்பவியலாளர்',
      te: 'గృహ విద్యుత్ ఉపకరణాల సాంకేతిక నిపుణుడు',
      bn: 'গৃহস্থালী বৈদ্যুতিক সরঞ্জাম মেরামত টেকনিশিয়ান',
      pa: 'ਘਰੇਲੂ ਬਿਜਲੀ ਉਪਕਰਣ ਮੁਰੰਮਤ ਤਕਨੀਸ਼ੀਅਨ',
      gu: 'ઘરેલુ ઇલેક્ટ્રિકલ ઉપકરણ રિપેરિંગ ટેકનિશિયન',
      or: 'ଘରୋଇ ବୈଦ୍ୟୁତିକ ଉପକରଣ ମରାମତି କାରିଗର',
      kn: 'ಮನೆಬಳಕೆಯ ವಿದ್ಯುತ್ ಉಪಕರಣ ದುರಸ್ತಿ ತಜ್ಞ',
      en: 'Domestic Electrical Appliance Care Technician'
    },
    sector: 'Electronics Sector Skills Council of India (ESSCI)',
    nsqfLevel: 4,
    qpCode: 'ELE/Q3104',
    durationHours: 360,
    minEducation: '8th Pass',
    matchScore: 91,
    matchReasons: [
      'Allows starting a local repair shop or doorstep repair service within 5-10 km radius',
      'Matches candidates with physical mobility limitations who prefer home-block operations',
      'Fully covers fan, mixer, motor pump, wiring, and induction cooktop maintenance'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 16,000 - 25,000 / month',
    trainingCenters: [
      { name: 'District ITI & PM-AJAY GIA Wing', location: 'Block Headquarters', distanceKm: 6, seatsAvailable: 25 },
      { name: 'Rural Self Employment Training Institute (RSETI)', location: 'District Collectorate Road', distanceKm: 14, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: 'Digital Insulation Tester, Soldering Station, Heavy-duty Wire Stripper, Component Box (Worth INR 10,000)',
    placementGuarantee: 'Self-employment kit + tie-up with local urban-rural service networks',
    careerPathway: 'Independent Electrical Service Center Owner / Village Vidyut Sahayak'
  },
  {
    id: 'nsqf-leather-03',
    title: 'Leather Footwear & Goods Craftsman (Modernized)',
    titleRegional: {
      hi: 'आधुनिक चमड़ा जूता व उत्पाद निर्माण कारीगर',
      mr: 'आधुनिक चर्मोद्योग व पादत्राणे कारागीर',
      ta: 'நவீன தோல் பாதணி மற்றும் பொருட்கள் தயாரிப்பாளர்',
      te: 'ఆధునిక తోలు పాదరక్షల తయారీ నిపుణుడు',
      bn: 'আধুনিক চামড়ার জুতো ও পণ্য প্রস্তুতকারক',
      pa: 'ਆਧੁਨਿਕ ਚਮੜੇ ਦੇ ਜੁੱਤੇ ਅਤੇ ਸਾਮਾਨ ਕਾਰੀਗਰ',
      gu: 'આધુનિક ચામડાના ફૂટવેર અને સામાન કારીગર',
      or: 'ଆଧୁନିକ ଚମଡ଼ା ଜୋତା ଓ ଉତ୍ପାଦନ କାରିଗର',
      kn: 'ಆಧುನಿಕ ಚರ್ಮದ ಪಾದರಕ್ಷೆ ತಯಾರಕ',
      en: 'Leather Footwear & Goods Craftsman (Modernized)'
    },
    sector: 'Leather Sector Skill Council (LSSC)',
    nsqfLevel: 4,
    qpCode: 'LSS/Q2301',
    durationHours: 320,
    minEducation: '5th Pass / Literate with Traditional Hereditary Background',
    matchScore: 96,
    matchReasons: [
      'Directly upgrades hereditary/traditional caste skills with computer-aided cutting and durable soles',
      'Unlocks PM-AJAY GIA ₹50,000 grant for motorized sewing and skiving machine procurement',
      'Eliminates exploitative middleman commission through direct market links to ODOP & Khadi'
    ],
    suitabilityType: 'Traditional Skill Modernization',
    avgMonthlyEarnings: 'INR 20,000 - 32,000 / month',
    trainingCenters: [
      { name: 'FDDI Training Extension Unit', location: 'Leather Cluster Road', distanceKm: 11, seatsAvailable: 30 },
      { name: 'Dr. Ambedkar SC Artisan Development Center', location: 'Township Center', distanceKm: 9, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: 'Motorized Edge Trimmer, Heavy Leather Stitcher, Pattern Blocks, Safety Respiratory Mask (Worth INR 15,000)',
    placementGuarantee: '90% institutional procurement via PM-AJAY SHG marketing federations',
    careerPathway: 'Custom Footwear Brand Owner / Micro Leather Goods Manufacturer'
  },
  {
    id: 'nsqf-auto-04',
    title: 'Two-Wheeler Service & EV Scooter Technician',
    titleRegional: {
      hi: 'दोपहिया एवं इलेक्ट्रिक स्कूटर सेवा तकनीशियन',
      mr: 'दुचाकी आणि ई-स्कूटर दुरुस्ती तंत्रज्ञ',
      ta: 'இருசக்கர மற்றும் மின்சார ஸ்கூட்டர் தொழில்நுட்பவியலாளர்',
      te: 'ద్విచక్ర మరియు ఈవీ స్కూటర్ సర్వీస్ టెక్నీషియన్',
      bn: 'দ্বিচক্র ও ই-স্কুটার সার্ভিস টেকনিশিয়ান',
      pa: 'ਦੋਪਹੀਆ ਅਤੇ ਈ-ਸਕੂਟਰ ਸਰਵਿਸ ਤਕਨੀਸ਼ੀਅਨ',
      gu: 'ટુ-વ્હીલર અને ઇ-સ્કૂટર સર્વિસ ટેકનિશિયન',
      or: 'ଦୁଇଚକିଆ ଓ ଇଭି ସ୍କୁଟର ସର୍ଭିସିଂ ଟେକ୍ନିସିଆନ',
      kn: 'ದ್ವಿಚಕ್ರ ಮತ್ತು ಇವಿ ಸ್ಕೂಟರ್ ರಿಪೇರಿ ತಜ್ಞ',
      en: 'Two-Wheeler Service & EV Scooter Technician'
    },
    sector: 'Automotive Skills Development Council (ASDC)',
    nsqfLevel: 4,
    qpCode: 'ASC/Q1411',
    durationHours: 400,
    minEducation: '8th Pass',
    matchScore: 93,
    matchReasons: [
      'Evergreen demand in every rural weekly bazaar (haat) and highway node',
      'Covers both traditional carbureted bikes and modern brushless DC (BLDC) motor EV scooters',
      'High daily cash inflow for beneficiary families'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 22,000 - 35,000 / month',
    trainingCenters: [
      { name: 'Automotive Skill Foundation Center', location: 'National Highway Bypass', distanceKm: 10, seatsAvailable: 16 },
      { name: 'Government Polytechnic Skill Wing', location: 'District North', distanceKm: 17, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: 'Air Compressor 1HP, Torque Wrench Set, Battery Diagnostic Analyzer, Pneumatic Impact Kit (Worth INR 14,000)',
    placementGuarantee: 'Dealership authorized service partner or roadside garage seed grant',
    careerPathway: 'Independent Multi-Brand Two-Wheeler / EV Workshop Owner'
  },
  {
    id: 'nsqf-handloom-05',
    title: 'Jacquard & Handloom Master Weaver (Design Upgraded)',
    titleRegional: {
      hi: 'जैककार्ड व हथकरघा मास्टर बुनकर (उन्नत डिजाइन)',
      mr: 'जॅकॉर्ड व हातमाग विणकर कारागीर',
      ta: 'ஜாக்கார்ட் மற்றும் கைத்தறி முதன்மை நெசவாளர்',
      te: 'జాక్వార్డ్ మరియు చేనేత మాస్టర్ వీవర్',
      bn: 'জ্যাকোয়ার্ড ও তাঁত মাস্টার তাঁতি (উন্নত নকশা)',
      pa: 'ਜੈਕਵਾਰਡ ਅਤੇ ਹੈਂਡਲੂਮ ਮਾਸਟਰ ਜੁਲਾਹਾ',
      gu: 'જેકાર્ડ અને હેન્ડલૂમ માસ્ટર વણકર',
      or: 'ଜ୍ୟାକାର୍ଡ ଓ ହସ୍ତତନ୍ତ ମାଷ୍ଟର ବୁଣାକାର',
      kn: 'ಜಾಕ್ವಾರ್ಡ್ ಮತ್ತು ಕೈಮಗ್ಗ ನೇಕಾರ ತಜ್ಞ',
      en: 'Jacquard & Handloom Master Weaver (Design Upgraded)'
    },
    sector: 'Handicrafts and Carpet Sector Skill Council (HCSSC)',
    nsqfLevel: 4,
    qpCode: 'HCS/Q7301',
    durationHours: 320,
    minEducation: '5th Pass / Hereditary Artisan',
    matchScore: 95,
    matchReasons: [
      'Preserves and scales traditional generational weaving skill of marginalized weaver households',
      'Adds Jacquard card-punching and modern CAD motif capabilities',
      'Enables direct sales through TRIFED, GeM portal, and state handicrafts apex bodies'
    ],
    suitabilityType: 'Traditional Skill Modernization',
    avgMonthlyEarnings: 'INR 18,000 - 30,000 / month',
    trainingCenters: [
      { name: 'Weavers Service Center (Ministry of Textiles / MoSJE)', location: 'Handloom Colony', distanceKm: 7, seatsAvailable: 25 },
      { name: 'SC Artisan Cluster Development Society', location: 'Rural Craft Park', distanceKm: 12, seatsAvailable: 15 }
    ],
    pmAjayGiaToolkitSupplied: 'Improved Frame Loom Accessories, Warping Drum, Electronic Yarn Balance, Natural Dye Vat (Worth INR 13,000)',
    placementGuarantee: 'Buyback agreement with District Handloom Cooperative Society',
    careerPathway: 'Master Weaver & Rural Handloom Micro-Enterprise Leader'
  },
  {
    id: 'nsqf-apparel-06',
    title: 'Self-Employed Tailor & Garment Boutique Entrepreneur',
    titleRegional: {
      hi: 'स्वरोजगार दर्जी एवं गारमेंट बुटीक उद्यमी',
      mr: 'स्वयंरोजगार शिंपी व बुटीक उद्योजक',
      ta: 'சுயதொழில் தையலர் மற்றும் ஆடை தயாரிப்பு தொழில்முனைவோர்',
      te: 'స్వయం ఉపాధి టైలర్ మరియు గార్మెంట్ బోటిక్ వ్యవస్థాపకుడు',
      bn: 'স্বনির্ভর দর্জি ও বুটিক উদ্যোক্তা',
      pa: 'ਸਵੈ-ਰੁਜ਼ਗਾਰ ਦਰਜ਼ੀ ਅਤੇ ਗਾਰਮੈਂਟ ਬੁਟੀਕ ਉੱਦਮੀ',
      gu: 'સ્વ-રોજગાર ટેલર અને ગારમેન્ટ બુટિક ઉદ્યોગસાહસિક',
      or: 'ସ୍ୱୟଂ ନିୟୋଜିତ ଟେଲର ଓ ପୋଷାକ ନିର୍ମାତା',
      kn: 'ಸ್ವಯಂ ಉದ್ಯೋಗಿ ದರ್ಜಿ ಮತ್ತು ಬೊಟಿಕ್ ಉದ್ಯಮಿ',
      en: 'Self-Employed Tailor & Garment Boutique Entrepreneur'
    },
    sector: 'Apparel, Made-Ups & Home Furnishing Sector Skill Council (AMHSSC)',
    nsqfLevel: 4,
    qpCode: 'AMH/Q1947',
    durationHours: 340,
    minEducation: 'Primary / 8th Pass',
    matchScore: 92,
    matchReasons: [
      'Perfect for SC women and home-based workers with localized mobility constraints',
      'Covers school uniform stitching, designer blouses, and regional garment fabrication',
      'Eligible for PM-AJAY GIA ₹50,000 grant for industrial motor-driven sewing machinery'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 15,000 - 26,000 / month',
    trainingCenters: [
      { name: 'National Skill Training Institute for Women (Extension)', location: 'Tehsil Complex', distanceKm: 5, seatsAvailable: 35 },
      { name: 'Jan Shikshan Sansthan (JSS)', location: 'Near Bus Stand', distanceKm: 8, seatsAvailable: 28 }
    ],
    pmAjayGiaToolkitSupplied: 'High-speed Industrial Direct-Drive Lockstitch Machine, Overlock Stitcher, Steam Iron (Worth INR 18,000)',
    placementGuarantee: 'Institutional tie-up with local government schools for uniform bulk contracts',
    careerPathway: 'Custom Boutique Proprietor / Micro Garment Manufacturing Unit'
  },
  {
    id: 'nsqf-agri-07',
    title: 'Organic Grower & Vermicompost Bio-Fertilizer Producer',
    titleRegional: {
      hi: 'जैविक कृषक एवं वर्मीकम्पोस्ट जैव-उर्वरक उत्पादक',
      mr: 'सेंद्रिय शेतकरी व गांडूळ खत उत्पादक',
      ta: 'இயற்கை உழவர் மற்றும் மண்புழு உர உற்பத்தியாளர்',
      te: 'సేంద్రీయ రైతు మరియు వర్మీకంపోస్ట్ బయో ఎరువుల ఉత్పత్తిదారు',
      bn: 'জৈব চাষী ও কেঁচো সার প্রস্তুতকারক',
      pa: 'ਜੈਵਿਕ ਕਿਸਾਨ ਅਤੇ ਗੰਡੋਆ ਖਾਦ ਉਤਪਾਦਕ',
      gu: 'ઓર્ગેનિક ખેડૂત અને વર્મીકમ્પોસ્ટ બાયો-ખાતર ઉત્પાદક',
      or: 'ଜୈବିକ କୃଷକ ଓ ଭର୍ମିକମ୍ପୋଷ୍ଟ ଉତ୍ପାଦନକାରୀ',
      kn: 'ಸಾವಯವ ಕೃಷಿಕ ಮತ್ತು ಎರೆಹುಳು ಗೊಬ್ಬರ ತಯಾರಕ',
      en: 'Organic Grower & Vermicompost Bio-Fertilizer Producer'
    },
    sector: 'Agriculture Skill Council of India (ASCI)',
    nsqfLevel: 4,
    qpCode: 'AGR/Q1201',
    durationHours: 240,
    minEducation: '5th Pass / Literate',
    matchScore: 89,
    matchReasons: [
      'Converts agrarian wage laborers and small landholders into bio-input producers',
      'Zero migration requirement: operated directly on homestead backyard or village common land',
      'PM-AJAY GIA ₹50,000 grant fully funds 4 HDPE vermi-beds, shredder, and starter culture'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 17,000 - 27,000 / month',
    trainingCenters: [
      { name: 'Krishi Vigyan Kendra (KVK)', location: 'District Agricultural Farm', distanceKm: 13, seatsAvailable: 24 },
      { name: 'NABARD Rural Skill Hub', location: 'Block Agronomy Center', distanceKm: 9, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: 'HDPE Vermi-beds (4 units), Soil Testing pH Meter, Manual Biomass Chopper, Bag Sealer (Worth INR 12,000)',
    placementGuarantee: 'Offtake tie-up with local Horticulture Dept & FPOs under PKVY scheme',
    careerPathway: 'Certified Bio-Input Producer & Agro-Retailer'
  },
  {
    id: 'nsqf-carpentry-08',
    title: 'Modular Furniture Carpenter & Wood Craftsman',
    titleRegional: {
      hi: 'मॉड्यूलर फर्नीचर बढ़ई एवं काष्ठ शिल्पकार',
      mr: 'मॉड्युलर फर्निचर सुतार व लाकडी वस्तू कारागीर',
      ta: 'மாடுலர் பர்னிச்சர் தச்சர் மற்றும் மர வேலைப்பாடு கலைஞர்',
      te: 'మాడ్యులర్ ఫర్నిచర్ వడ్రంగి మరియు చెక్క కళాకారుడు',
      bn: 'মডুলার আসবাব ছুতার ও কাঠের কারিগর',
      pa: 'ਮਾਡਿਊਲਰ ਫਰਨੀਚਰ ਤਰਖਾਣ ਅਤੇ ਲੱਕੜੀ ਕਾਰੀਗਰ',
      gu: 'મોડ્યુલર ફર્નિચર સુથાર અને લાકડાના કારીગર',
      or: 'ମଡ୍ୟୁଲାର ଫର୍ନିଚର ବଢ଼େଇ ଓ କାଠ କାରିଗର',
      kn: 'ಮಾಡ್ಯುಲರ್ ಪೀಠೋಪಕರಣ ಬಡಗಿ',
      en: 'Modular Furniture Carpenter & Wood Craftsman'
    },
    sector: 'Furniture & Fittings Skill Council (FFSC)',
    nsqfLevel: 4,
    qpCode: 'FFS/Q0103',
    durationHours: 350,
    minEducation: '8th Pass',
    matchScore: 90,
    matchReasons: [
      'Huge transition in rural homes towards modular plywood, mica, and aluminium fittings',
      'Upgrades traditional village carpentry to precision power-tool operation',
      'GIA funding supports portable table saw, circular saw, router, and pneumatic nail gun'
    ],
    suitabilityType: 'Traditional Skill Modernization',
    avgMonthlyEarnings: 'INR 20,000 - 32,000 / month',
    trainingCenters: [
      { name: 'Skill India Advanced Woodworking Center', location: 'Industrial Estate Phase II', distanceKm: 16, seatsAvailable: 15 },
      { name: 'Rural Artisan Polytechnic', location: 'Tehsil Link Road', distanceKm: 8, seatsAvailable: 18 }
    ],
    pmAjayGiaToolkitSupplied: 'Plunge Router, Circular Saw 7-inch, Laser Distance Measurer, Heavy Clamps (Worth INR 14,000)',
    placementGuarantee: 'Tie-up with regional interior contractors & independent shop orders',
    careerPathway: 'Independent Modular Woodcraft Contractor / Furniture Showroom Partner'
  },
  {
    id: 'nsqf-drone-09',
    title: 'Agriculture Drone Operator & Spraying Pilot',
    titleRegional: {
      hi: 'कृषि ड्रोन संचालक एवं कीटनाशक छिड़काव पायलट',
      mr: 'शेती ड्रोन चालक व फवारणी पायलट',
      ta: 'வேளாண் ட்ரோன் இயக்கும் பைலட் மற்றும் தெளிப்பான் தொழில்நுட்பவியலாளர்',
      te: 'వ్యవసాయ డ్రోన్ ఆపరేటర్ మరియు స్ప్రేయింగ్ పైలట్',
      bn: 'কৃষি ড্রোন অপারেটর ও স্প্রেয়িং পাইলট',
      pa: 'ਖੇਤੀਬਾੜੀ ਡਰੋਨ ਆਪਰੇਟਰ ਅਤੇ ਸਪਰੇਅ ਪਾਇਲਟ',
      gu: 'કૃષિ ડ્રોન ઓપરેટર અને છંટકાવ પાયલોટ',
      or: 'କୃଷି ଡ୍ରୋନ୍ ଚାଳକ ଓ ସ୍ପ୍ରେୟିଂ ପାଇଲଟ୍',
      kn: 'ಕೃಷಿ ಡ್ರೋನ್ ಚಾಲಕ',
      en: 'Agriculture Drone Operator & Spraying Pilot'
    },
    sector: 'Aerospace and Aviation Sector Skill Council (AASSC)',
    nsqfLevel: 4,
    qpCode: 'AAS/Q2101',
    durationHours: 200,
    minEducation: '10th Pass',
    matchScore: 93,
    matchReasons: [
      'Aspirational modern tech trade for SC youth with high local prestige and digital exposure',
      'Charges INR 400 - 600 per acre for rapid nano-urea and pesticide spraying service',
      'Supported under Namo Drone Didi & PM-AJAY custom hiring center subsidies'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 25,000 - 45,000 / month',
    trainingCenters: [
      { name: 'DGCA Certified Remote Pilot Training School', location: 'Aviation Training Field', distanceKm: 22, seatsAvailable: 12 },
      { name: 'District Drone Innovation Hub', location: 'District Smart Center', distanceKm: 18, seatsAvailable: 10 }
    ],
    pmAjayGiaToolkitSupplied: 'DGCA Remote Pilot License Assistance, Ground Control Tablet, Battery Quick-Charger Hub (Worth INR 20,000)',
    placementGuarantee: 'Direct enrollment in FPO Custom Hiring Centers across district blocks',
    careerPathway: 'Rural Drone Service Provider (Kisan Drone Entrepreneur)'
  },
  {
    id: 'nsqf-mobile-10',
    title: 'Smartphone Hardware & Micro-Soldering Technician',
    titleRegional: {
      hi: 'स्मार्टफोन हार्डवेयर एवं माइक्रो-सोल्डरिंग तकनीशियन',
      mr: 'स्मार्टफोन हार्डवेअर व मायक्रो-सोल्डरिंग तंत्रज्ञ',
      ta: 'ஸ்மார்ட்போன் வன்பொருள் மற்றும் மைக்ரோ சாலிடரிங் தொழில்நுட்பவியலாளர்',
      te: 'స్మార్ట్‌ఫోన్ హార్డ్‌వేర్ మరియు మైక్రో-సోల్డరింగ్ టెక్నీషియన్',
      bn: 'স্মার্টফোন হার্ডওয়্যার ও মাইক্রো-সোল্ডারিং টেকনিশিয়ান',
      pa: 'ਸਮਾਰਟਫੋਨ ਹਾਰਡਵੇਅਰ ਅਤੇ ਮਾਈਕ੍ਰੋ-ਸੋਲਡਰਿੰਗ ਤਕਨੀਸ਼ੀਅਨ',
      gu: 'સ્માર્ટફોન હાર્ડવેર અને માઇક્રો-સોલ્ડરિંગ ટેકનિશિયન',
      or: 'ସ୍ମାର୍ଟଫୋନ୍ ହାର୍ଡୱେର୍ ଓ ମାଇକ୍ରୋ-ସୋଲଡରିଂ କାରିଗର',
      kn: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಹಾರ್ಡ್‌ವೇರ್ ರಿಪೇರಿ ತಜ್ಞ',
      en: 'Smartphone Hardware & Micro-Soldering Technician'
    },
    sector: 'Telecom Sector Skill Council (TSSC)',
    nsqfLevel: 4,
    qpCode: 'TEL/Q2201',
    durationHours: 360,
    minEducation: '8th / 10th Pass',
    matchScore: 92,
    matchReasons: [
      'High footfall retail service viable even in small village chowks and railway junctions',
      'Low physical strain; ideal for youth or persons with lower body mobility constraints',
      'Fast turnaround repairs (screen glass OCA lamination, charging IC, battery replacement)'
    ],
    suitabilityType: 'Self-Employment Ideal',
    avgMonthlyEarnings: 'INR 20,000 - 35,000 / month',
    trainingCenters: [
      { name: 'PM-AJAY Dedicated IT & Telecom Center', location: 'Main Market Square', distanceKm: 5, seatsAvailable: 20 },
      { name: 'District Skill Development Office (DSDO)', location: 'Collectorate Compound', distanceKm: 11, seatsAvailable: 25 }
    ],
    pmAjayGiaToolkitSupplied: 'SMD Hot Air Rework Station, Digital Stereo Microscope, DC Regulated Power Supply (Worth INR 16,000)',
    placementGuarantee: 'Direct franchise link with spare parts suppliers + PM-AJAY capital subsidy',
    careerPathway: 'Independent Mobile & IT Device Service Point Proprietor'
  }
];
