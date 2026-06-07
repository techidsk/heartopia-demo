import { defaultLocale, type Locale } from "./config";

export type UiMessages = {
  common: {
    skipToContent: string;
    search: string;
  };
  navigation: {
    primaryLabel: string;
    languageLabel: string;
    menu: string;
    close: string;
  };
  footer: {
    updated: string;
  };
  translation: {
    fallbackTitle: string;
    fallbackBody: string;
    openEnglish: string;
  };
};

const uiMessages = {
  en: {
    common: {
      skipToContent: "Skip to content",
      search: "Search"
    },
    navigation: {
      primaryLabel: "Primary navigation",
      languageLabel: "Language",
      menu: "Menu",
      close: "Close"
    },
    footer: {
      updated: "Independent fan guide. Last updated {updatedLabel}."
    },
    translation: { fallbackTitle: "Translation pending", fallbackBody: "This localized page is prepared but still uses the English source until the translation is reviewed.", openEnglish: "Open English version" }
  },
  de: {
    common: { skipToContent: "Zum Inhalt springen", search: "Suche" },
    navigation: { primaryLabel: "Hauptnavigation", languageLabel: "Sprache", menu: "Menü", close: "Schließen" },
    footer: { updated: "Unabhängiger Fan-Guide. Zuletzt aktualisiert am {updatedLabel}." },
    translation: { fallbackTitle: "Übersetzung ausstehend", fallbackBody: "Diese lokalisierte Seite ist vorbereitet, verwendet aber noch die englische Quelle, bis die Übersetzung geprüft ist.", openEnglish: "Englische Version öffnen" }
  },
  es: {
    common: { skipToContent: "Saltar al contenido", search: "Buscar" },
    navigation: { primaryLabel: "Navegación principal", languageLabel: "Idioma", menu: "Menú", close: "Cerrar" },
    footer: { updated: "Guía independiente de fans. Última actualización: {updatedLabel}." },
    translation: { fallbackTitle: "Traducción pendiente", fallbackBody: "Esta página localizada está preparada, pero todavía usa la fuente en inglés hasta que se revise la traducción.", openEnglish: "Abrir versión en inglés" }
  },
  fr: {
    common: { skipToContent: "Aller au contenu", search: "Recherche" },
    navigation: { primaryLabel: "Navigation principale", languageLabel: "Langue", menu: "Menu", close: "Fermer" },
    footer: { updated: "Guide de fans indépendant. Dernière mise à jour : {updatedLabel}." },
    translation: { fallbackTitle: "Traduction en attente", fallbackBody: "Cette page localisée est prête, mais utilise encore la source anglaise jusqu'à validation de la traduction.", openEnglish: "Ouvrir la version anglaise" }
  },
  pt: {
    common: { skipToContent: "Ir para o conteúdo", search: "Pesquisar" },
    navigation: { primaryLabel: "Navegação principal", languageLabel: "Idioma", menu: "Menu", close: "Fechar" },
    footer: { updated: "Guia independente de fãs. Última atualização: {updatedLabel}." },
    translation: { fallbackTitle: "Tradução pendente", fallbackBody: "Esta página localizada está preparada, mas ainda usa a fonte em inglês até a tradução ser revisada.", openEnglish: "Abrir versão em inglês" }
  },
  id: {
    common: { skipToContent: "Lewati ke konten", search: "Cari" },
    navigation: { primaryLabel: "Navigasi utama", languageLabel: "Bahasa", menu: "Menu", close: "Tutup" },
    footer: { updated: "Panduan penggemar independen. Terakhir diperbarui {updatedLabel}." },
    translation: { fallbackTitle: "Terjemahan tertunda", fallbackBody: "Halaman lokal ini sudah disiapkan, tetapi masih memakai sumber bahasa Inggris sampai terjemahannya ditinjau.", openEnglish: "Buka versi Inggris" }
  },
  ru: {
    common: { skipToContent: "Перейти к содержимому", search: "Поиск" },
    navigation: { primaryLabel: "Основная навигация", languageLabel: "Язык", menu: "Меню", close: "Закрыть" },
    footer: { updated: "Независимый фанатский гид. Последнее обновление: {updatedLabel}." },
    translation: { fallbackTitle: "Перевод ожидается", fallbackBody: "Эта локализованная страница подготовлена, но пока использует английский источник до проверки перевода.", openEnglish: "Открыть английскую версию" }
  },
  th: {
    common: { skipToContent: "ข้ามไปยังเนื้อหา", search: "ค้นหา" },
    navigation: { primaryLabel: "การนำทางหลัก", languageLabel: "ภาษา", menu: "เมนู", close: "ปิด" },
    footer: { updated: "คู่มือแฟนอิสระ อัปเดตล่าสุด {updatedLabel}" },
    translation: { fallbackTitle: "รอการแปล", fallbackBody: "หน้านี้เตรียมเส้นทางภาษาไว้แล้ว แต่ยังใช้ต้นฉบับภาษาอังกฤษจนกว่าการแปลจะตรวจทานเสร็จ", openEnglish: "เปิดเวอร์ชันอังกฤษ" }
  },
  ja: {
    common: { skipToContent: "コンテンツへスキップ", search: "検索" },
    navigation: { primaryLabel: "メインナビゲーション", languageLabel: "言語", menu: "メニュー", close: "閉じる" },
    footer: { updated: "独立系ファンガイド。最終更新: {updatedLabel}。" },
    translation: { fallbackTitle: "翻訳準備中", fallbackBody: "このローカライズページは準備済みですが、翻訳レビューが終わるまで英語ソースを使用します。", openEnglish: "英語版を開く" }
  },
  ko: {
    common: { skipToContent: "본문으로 건너뛰기", search: "검색" },
    navigation: { primaryLabel: "기본 탐색", languageLabel: "언어", menu: "메뉴", close: "닫기" },
    footer: { updated: "독립 팬 가이드. 마지막 업데이트: {updatedLabel}." },
    translation: { fallbackTitle: "번역 준비 중", fallbackBody: "이 현지화 페이지는 준비되었지만 번역 검토가 끝날 때까지 영어 원문을 사용합니다.", openEnglish: "영어 버전 열기" }
  },
  "zh-Hant": {
    common: { skipToContent: "跳到內容", search: "搜尋" },
    navigation: { primaryLabel: "主要導覽", languageLabel: "語言", menu: "選單", close: "關閉" },
    footer: { updated: "獨立粉絲攻略。最後更新：{updatedLabel}。" },
    translation: { fallbackTitle: "翻譯待補", fallbackBody: "此本地化頁面已建立，但在翻譯審核完成前仍使用英文來源內容。", openEnglish: "開啟英文版本" }
  },
  "zh-Hans": {
    common: { skipToContent: "跳到内容", search: "搜索" },
    navigation: { primaryLabel: "主要导航", languageLabel: "语言", menu: "菜单", close: "关闭" },
    footer: { updated: "独立粉丝攻略。最后更新：{updatedLabel}。" },
    translation: { fallbackTitle: "翻译待补", fallbackBody: "此本地化页面已建立，但在翻译审核完成前仍使用英文来源内容。", openEnglish: "打开英文版本" }
  }
} satisfies Partial<Record<Locale, UiMessages>>;

export function getUiMessages(locale: Locale = defaultLocale) {
  return uiMessages[locale] || uiMessages[defaultLocale] || uiMessages.en;
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));
}
