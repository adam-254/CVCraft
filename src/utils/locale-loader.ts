// Dynamic locale loader using import() for Vite compatibility
// The locale files are CommonJS modules with module.exports
export async function loadLocaleModule(locale: string): Promise<{ messages: any }> {
  // Use dynamic import with ?commonjs to handle CommonJS modules
  const modules: Record<string, () => Promise<any>> = {
    'af-ZA': () => import('../../locales/af-ZA.js'),
    'am-ET': () => import('../../locales/am-ET.js'),
    'ar-SA': () => import('../../locales/ar-SA.js'),
    'az-AZ': () => import('../../locales/az-AZ.js'),
    'bg-BG': () => import('../../locales/bg-BG.js'),
    'bn-BD': () => import('../../locales/bn-BD.js'),
    'ca-ES': () => import('../../locales/ca-ES.js'),
    'cs-CZ': () => import('../../locales/cs-CZ.js'),
    'da-DK': () => import('../../locales/da-DK.js'),
    'de-DE': () => import('../../locales/de-DE.js'),
    'el-GR': () => import('../../locales/el-GR.js'),
    'en-US': () => import('../../locales/en-US.js'),
    'es-ES': () => import('../../locales/es-ES.js'),
    'fa-IR': () => import('../../locales/fa-IR.js'),
    'fi-FI': () => import('../../locales/fi-FI.js'),
    'fr-FR': () => import('../../locales/fr-FR.js'),
    'he-IL': () => import('../../locales/he-IL.js'),
    'hi-IN': () => import('../../locales/hi-IN.js'),
    'hu-HU': () => import('../../locales/hu-HU.js'),
    'id-ID': () => import('../../locales/id-ID.js'),
    'it-IT': () => import('../../locales/it-IT.js'),
    'ja-JP': () => import('../../locales/ja-JP.js'),
    'km-KH': () => import('../../locales/km-KH.js'),
    'kn-IN': () => import('../../locales/kn-IN.js'),
    'ko-KR': () => import('../../locales/ko-KR.js'),
    'lt-LT': () => import('../../locales/lt-LT.js'),
    'lv-LV': () => import('../../locales/lv-LV.js'),
    'ml-IN': () => import('../../locales/ml-IN.js'),
    'mr-IN': () => import('../../locales/mr-IN.js'),
    'ms-MY': () => import('../../locales/ms-MY.js'),
    'ne-NP': () => import('../../locales/ne-NP.js'),
    'nl-NL': () => import('../../locales/nl-NL.js'),
    'no-NO': () => import('../../locales/no-NO.js'),
    'or-IN': () => import('../../locales/or-IN.js'),
    'pl-PL': () => import('../../locales/pl-PL.js'),
    'pt-BR': () => import('../../locales/pt-BR.js'),
    'pt-PT': () => import('../../locales/pt-PT.js'),
    'ro-RO': () => import('../../locales/ro-RO.js'),
    'ru-RU': () => import('../../locales/ru-RU.js'),
    'sk-SK': () => import('../../locales/sk-SK.js'),
    'sq-AL': () => import('../../locales/sq-AL.js'),
    'sr-SP': () => import('../../locales/sr-SP.js'),
    'sv-SE': () => import('../../locales/sv-SE.js'),
    'ta-IN': () => import('../../locales/ta-IN.js'),
    'te-IN': () => import('../../locales/te-IN.js'),
    'th-TH': () => import('../../locales/th-TH.js'),
    'tr-TR': () => import('../../locales/tr-TR.js'),
    'uk-UA': () => import('../../locales/uk-UA.js'),
    'uz-UZ': () => import('../../locales/uz-UZ.js'),
    'vi-VN': () => import('../../locales/vi-VN.js'),
    'zh-CN': () => import('../../locales/zh-CN.js'),
    'zh-TW': () => import('../../locales/zh-TW.js'),
    'zu-ZA': () => import('../../locales/zu-ZA.js'),
  };

  const loader = modules[locale];
  if (!loader) {
    throw new Error(`Locale ${locale} not found`);
  }

  const module = await loader();
  // Handle both default export and direct module.exports
  return module.default || module;
}
