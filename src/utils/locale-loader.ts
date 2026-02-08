// Dynamic locale loader using import() for Vite compatibility
// The locale files are ES modules (.mjs) with named exports
export async function loadLocaleModule(locale: string): Promise<{ messages: any }> {
  // Use dynamic import for ES module .mjs files
  const modules: Record<string, () => Promise<any>> = {
    'af-ZA': () => import('../../locales/af-ZA.mjs'),
    'am-ET': () => import('../../locales/am-ET.mjs'),
    'ar-SA': () => import('../../locales/ar-SA.mjs'),
    'az-AZ': () => import('../../locales/az-AZ.mjs'),
    'bg-BG': () => import('../../locales/bg-BG.mjs'),
    'bn-BD': () => import('../../locales/bn-BD.mjs'),
    'ca-ES': () => import('../../locales/ca-ES.mjs'),
    'cs-CZ': () => import('../../locales/cs-CZ.mjs'),
    'da-DK': () => import('../../locales/da-DK.mjs'),
    'de-DE': () => import('../../locales/de-DE.mjs'),
    'el-GR': () => import('../../locales/el-GR.mjs'),
    'en-US': () => import('../../locales/en-US.mjs'),
    'es-ES': () => import('../../locales/es-ES.mjs'),
    'fa-IR': () => import('../../locales/fa-IR.mjs'),
    'fi-FI': () => import('../../locales/fi-FI.mjs'),
    'fr-FR': () => import('../../locales/fr-FR.mjs'),
    'he-IL': () => import('../../locales/he-IL.mjs'),
    'hi-IN': () => import('../../locales/hi-IN.mjs'),
    'hu-HU': () => import('../../locales/hu-HU.mjs'),
    'id-ID': () => import('../../locales/id-ID.mjs'),
    'it-IT': () => import('../../locales/it-IT.mjs'),
    'ja-JP': () => import('../../locales/ja-JP.mjs'),
    'km-KH': () => import('../../locales/km-KH.mjs'),
    'kn-IN': () => import('../../locales/kn-IN.mjs'),
    'ko-KR': () => import('../../locales/ko-KR.mjs'),
    'lt-LT': () => import('../../locales/lt-LT.mjs'),
    'lv-LV': () => import('../../locales/lv-LV.mjs'),
    'ml-IN': () => import('../../locales/ml-IN.mjs'),
    'mr-IN': () => import('../../locales/mr-IN.mjs'),
    'ms-MY': () => import('../../locales/ms-MY.mjs'),
    'ne-NP': () => import('../../locales/ne-NP.mjs'),
    'nl-NL': () => import('../../locales/nl-NL.mjs'),
    'no-NO': () => import('../../locales/no-NO.mjs'),
    'or-IN': () => import('../../locales/or-IN.mjs'),
    'pl-PL': () => import('../../locales/pl-PL.mjs'),
    'pt-BR': () => import('../../locales/pt-BR.mjs'),
    'pt-PT': () => import('../../locales/pt-PT.mjs'),
    'ro-RO': () => import('../../locales/ro-RO.mjs'),
    'ru-RU': () => import('../../locales/ru-RU.mjs'),
    'sk-SK': () => import('../../locales/sk-SK.mjs'),
    'sq-AL': () => import('../../locales/sq-AL.mjs'),
    'sr-SP': () => import('../../locales/sr-SP.mjs'),
    'sv-SE': () => import('../../locales/sv-SE.mjs'),
    'ta-IN': () => import('../../locales/ta-IN.mjs'),
    'te-IN': () => import('../../locales/te-IN.mjs'),
    'th-TH': () => import('../../locales/th-TH.mjs'),
    'tr-TR': () => import('../../locales/tr-TR.mjs'),
    'uk-UA': () => import('../../locales/uk-UA.mjs'),
    'uz-UZ': () => import('../../locales/uz-UZ.mjs'),
    'vi-VN': () => import('../../locales/vi-VN.mjs'),
    'zh-CN': () => import('../../locales/zh-CN.mjs'),
    'zh-TW': () => import('../../locales/zh-TW.mjs'),
    'zu-ZA': () => import('../../locales/zu-ZA.mjs'),
  };

  const loader = modules[locale];
  if (!loader) {
    throw new Error(`Locale ${locale} not found`);
  }

  const module = await loader();
  // ES modules export as named export 'messages'
  return { messages: module.messages };
}
