// Проверка ID человека: "id" + международные цифры номера (BRIDGE_LIGHT_PLAN.md §1, app/core/id.js).
// Номер здесь приходит уже готовым ID: нормализует его приложение (`TelFormat.appId` в Light Plan).
//
// Сервер проверяет только то, что можно проверить без таблиц стран:
//  - форма: id + 8…15 цифр, первая не 0 (E.164);
//  - для +7 — городской номер Москвы, Томска и т. п. не годится: после «7» должна идти 6, 7 или 9
//    (мобильные России — 9xx, Казахстана — 6xx/7xx). Это ВЫВОД сессии, не мерено по таблице операторов;
//    полная проверка «мобильный ли» — в приложении (Google libphonenumber).

const ID_RE = /^id([1-9]\d{7,14})$/;

export function parseAppId(value) {
  if (typeof value !== "string") return null;
  const m = ID_RE.exec(value);
  if (!m) return null;
  const digits = m[1];
  if (digits.startsWith("7") && !/^7[679]/.test(digits)) return null;
  return { id: value, digits };
}

// Страны дома ru: +7 и СНГ. Список взят из приложения (CoreLink.swift, CoreHome.ruCountries);
// там он помечен «вывод исполнителя, не слова Алексея» — держим в одном месте, чтобы поправить в один приём.
export const RU_COUNTRIES = ["RU", "KZ", "BY", "AM", "AZ", "KG", "MD", "TJ", "TM", "UZ"];

export function homeOfCountry(iso) {
  return RU_COUNTRIES.includes(String(iso).toUpperCase()) ? "ru" : "world";
}
