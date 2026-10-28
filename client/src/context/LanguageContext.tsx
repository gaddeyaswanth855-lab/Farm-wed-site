import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  online: string;
  offline: string;
  dashboard: string;
  plots: string;
  cropPlanner: string;
  pestDoctor: string;
  soilDoctor: string;
  mandiPrices: string;
  govtSchemes: string;
  postHarvest: string;
  kisanBandhu: string;
  distressHotline: string;
  emergencyLifeline: string;
  selectLanguage: string;
  activePlots: string;
  totalAcreage: string;
  rainfedRatio: string;
  soilHealth: string;
  diagnoseNow: string;
  planSeason: string;
  calculateFertilizer: string;
  checkMandi: string;
  kisanCallCenter: string;
  teleManas: string;
}

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: "KisanSeva AI",
    tagline: "Empowering Smallholder Farmers with Climate-Resilient Intelligence",
    online: "Connected",
    offline: "Offline Mode",
    dashboard: "Dashboard",
    plots: "My Plots & Soil",
    cropPlanner: "Crop Planner",
    pestDoctor: "Pest Doctor",
    soilDoctor: "Soil Doctor",
    mandiPrices: "Mandi Intelligence",
    govtSchemes: "Govt Schemes & Credit",
    postHarvest: "Post-Harvest Shield",
    kisanBandhu: "Kisan Bandhu AI",
    distressHotline: "Emergency Hotline",
    emergencyLifeline: "Farmer Crisis Lifeline",
    selectLanguage: "Language",
    activePlots: "Active Land Plots",
    totalAcreage: "Total Cultivated Acres",
    rainfedRatio: "Monsoon Dependency",
    soilHealth: "Soil Vitality Score",
    diagnoseNow: "Diagnose Pest Attack",
    planSeason: "Plan Next Season",
    calculateFertilizer: "Calculate Fertilizer Bags",
    checkMandi: "Check Live APMC Rates",
    kisanCallCenter: "Kisan Call Centre: 1800-180-1551",
    teleManas: "Tele-MANAS: 14416 (24/7 Free Support)"
  },
  hi: {
    appName: "किसानसेवा AI",
    tagline: "छोटे किसानों के लिए जलवायु-अनुकूल और आत्मनिर्भर कृषि मंच",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन मोड",
    dashboard: "डैशबोर्ड",
    plots: "मेरे खेत व मिट्टी",
    cropPlanner: "फसल नियोजक",
    pestDoctor: "कीट डॉक्टर",
    soilDoctor: "मृदा उर्वरता व खाद",
    mandiPrices: "मंडी भाव व आर्बिट्राज",
    govtSchemes: "सरकारी योजनाएं व ऋण",
    postHarvest: "फसल संरक्षण व भंडारण",
    kisanBandhu: "किसान बंधु AI",
    distressHotline: "आपातकालीन हेल्पलाइन",
    emergencyLifeline: "किसान संकट सहायता रेखा",
    selectLanguage: "भाषा",
    activePlots: "कुल सक्रिय खेत",
    totalAcreage: "कुल कृषि रकबा (एकड़)",
    rainfedRatio: "मानसून निर्भरता",
    soilHealth: "मृदा स्वास्थ्य स्कोर",
    diagnoseNow: "रोग व कीट निदान करें",
    planSeason: "आगामी फसल की योजना बनाएं",
    calculateFertilizer: "यूरिया/डीएपी बोरियों की गणना",
    checkMandi: "ताजा मंडी भाव देखें",
    kisanCallCenter: "किसान कॉल सेंटर: 1800-180-1551",
    teleManas: "टेली-मानस: 14416 (निःशुल्क 24/7)"
  },
  mr: {
    appName: "किसानसेवा AI",
    tagline: "अल्पभूधारक शेतकऱ्यांसाठी हवामान-अनुकूल व शाश्वत कृषी सल्लागार",
    online: "ऑनलाइन",
    offline: "ऑफलाइन मोड",
    dashboard: "डॅशबोर्ड",
    plots: "माझी शेतजमीन व माती",
    cropPlanner: "पीक नियोजन",
    pestDoctor: "कीड व रोग निदान",
    soilDoctor: "माती डॉक्टर व खत व्यवस्थापन",
    mandiPrices: "बाजार भाव (मंडी)",
    govtSchemes: "शासकीय योजना व कर्ज",
    postHarvest: "साठवणूक व काढणी",
    kisanBandhu: "किसान मित्र AI",
    distressHotline: "आपत्कालीन मदत",
    emergencyLifeline: "शेतकरी जीवनरेखा",
    selectLanguage: "भाषा",
    activePlots: "सक्रिय शेततुकडे",
    totalAcreage: "एकूण क्षेत्र (एकर)",
    rainfedRatio: "पावसावरील अवलंबित्व",
    soilHealth: "जमीन सुपीकता निर्देशांक",
    diagnoseNow: "पिकांवरील किडीचे निदान करा",
    planSeason: "हंगामी पीक आराखडा तयार करा",
    calculateFertilizer: "खतांच्या पोत्यांचे गणित",
    checkMandi: "थेट बाजारभाव तपासा",
    kisanCallCenter: "किसान कॉल सेंटर: 1800-180-1551",
    teleManas: "टेली-मानस: 14416 (२४ तास मोफत)"
  },
  te: {
    appName: "కిసాన్‌సేవా AI",
    tagline: "చిన్నకారు రైతులకు వాతావరణ ఆధారిత స్మార్ట్ వ్యవసాయ సలహాదారు",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్ మోడ్",
    dashboard: "డాష్‌బోర్డ్",
    plots: "నా పొలాలు & నేల",
    cropPlanner: "పంట ప్రణాళిక",
    pestDoctor: "తెగులు డాక్టర్",
    soilDoctor: "నేల పరీక్ష & ఎరువులు",
    mandiPrices: "మార్కెట్ ధరలు",
    govtSchemes: "ప్రభుత్వ పథకాలు & రుణాలు",
    postHarvest: "పంట నిల్వ & రక్షణ",
    kisanBandhu: "కిసాన్ బంధు AI",
    distressHotline: "అత్యవసర హెల్ప్‌లైన్",
    emergencyLifeline: "రైతు సంక్షోభ సహాయం",
    selectLanguage: "భాష",
    activePlots: "పొలాల సంఖ్య",
    totalAcreage: "మొత్తం విస్తీర్ణం (ఎకరాలు)",
    rainfedRatio: "వర్షాధార శాతం",
    soilHealth: "నేల సారవంతం స్కోరు",
    diagnoseNow: "తెగుళ్లను నిర్ధారించండి",
    planSeason: "పంట ప్రణాళిక వేయండి",
    calculateFertilizer: "ఎరువుల సంచుల లెక్కింపు",
    checkMandi: "తాజా మార్కెట్ ధరలు",
    kisanCallCenter: "కిసాన్ కాల్ సెంటర్: 1800-180-1551",
    teleManas: "టెలి-మానస్: 14416 (24 గంటలు ఉచితం)"
  },
  ta: {
    appName: "கிசான்சேவா AI",
    tagline: "சிறு விவசாயிகளுக்கான காலநிலை தாங்கும் விவசாய வழிகாட்டி",
    online: "இணையத்தில்",
    offline: "ஆஃப்லைன்",
    dashboard: "டாஷ்போர்டு",
    plots: "என் நிலங்கள் & மண்",
    cropPlanner: "பயிர் திட்டமிடுபவர்",
    pestDoctor: "பூச்சி மருத்துவர்",
    soilDoctor: "மண் வளம் & உரம்",
    mandiPrices: "சந்தை விலைகள்",
    govtSchemes: "அரசு மானியங்கள் & கடன்",
    postHarvest: "அறுவடை பின் பாதுகாப்பு",
    kisanBandhu: "கிசான் பந்து AI",
    distressHotline: "அவசர உதவி எண்",
    emergencyLifeline: "விவசாயிகள் அவசர உதவி",
    selectLanguage: "மொழி",
    activePlots: "செயலில் உள்ள நிலங்கள்",
    totalAcreage: "மொத்த பரப்பளவு (ஏக்கர்)",
    rainfedRatio: "மழை சார்ந்துள்ள விகிதம்",
    soilHealth: "மண் ஆரோக்கிய குறியீடு",
    diagnoseNow: "பூச்சியைக் கண்டறிக",
    planSeason: "பருவத்தை திட்டமிடுங்கள்",
    calculateFertilizer: "உர மூட்டைகளை கணக்கிடுங்கள்",
    checkMandi: "சந்தை நிலவரம் காண்க",
    kisanCallCenter: "கிசான் கால் சென்டர்: 1800-180-1551",
    teleManas: "டெலி-மானாஸ்: 14416 (இலவசம்)"
  },
  kn: {
    appName: "ಕಿಸಾನ್‌ಸೇವಾ AI",
    tagline: "ಸಣ್ಣ ರೈತರಿಗೆ ಹವಾಮಾನ ಸ್ಥಿತಿಸ್ಥಾಪಕ ಕೃಷಿ ಸಲಹಾ ವೇದಿಕೆ",
    online: "ಆನ್‌ಲೈನ್‌",
    offline: "ಆಫ್‌ಲೈನ್‌ ಮೋಡ್‌",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    plots: "ನನ್ನ ಜಮೀನು & ಮಣ್ಣು",
    cropPlanner: "ಬೆಳೆ ಯೋಜಕ",
    pestDoctor: "ಕೀಟ & ರೋಗ ಡಾಕ್ಟರ್",
    soilDoctor: "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ & ಗೊಬ್ಬರ",
    mandiPrices: "ಮಾರುಕಟ್ಟೆ ದರಗಳು",
    govtSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆ & ಸಾಲ",
    postHarvest: "ಸುಗ್ಗಿಯ ನಂತರದ ರಕ್ಷಣೆ",
    kisanBandhu: "ಕಿಸಾನ್ ಬಂಧು AI",
    distressHotline: "ತುರ್ತು ಸಹಾಯವಾಣಿ",
    emergencyLifeline: "ರೈತರ ಆಪತ್ಬಾಂಧವ",
    selectLanguage: "ಭಾಷೆ",
    activePlots: "ಸಕ್ರಿಯ ಜಮೀನುಗಳು",
    totalAcreage: "ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)",
    rainfedRatio: "ಮಳೆಯ ಮೇಲಿನ ಅವಲಂಬನೆ",
    soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್",
    diagnoseNow: "ಕೀಟ ಬಾಧೆಯನ್ನು ಗುರುತಿಸಿ",
    planSeason: "ಮುಂದಿನ ಹಂಗಾಮಿನ ಯೋಜನೆ",
    calculateFertilizer: "ರಸಗೊಬ್ಬರ ಚೀಲಗಳ ಲೆಕ್ಕ",
    checkMandi: "ಮಂಡಿ ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    kisanCallCenter: "ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್: 1800-180-1551",
    teleManas: "ಟೆಲಿ-ಮಾನಸ್: 14416 (24/7 ಉಚಿತ)"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kisanseva_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kisanseva_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
