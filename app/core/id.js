// core/id.js — вычисление ID участника из мобильного номера
// (BRIDGE_LIGHT_PLAN.md §1). Чистая функция: тот же номер даёт тот же
// ID на любом устройстве, без сервера и без сговора сторон — воспроизводимость,
// не удостоверение (ID никогда не служит доказательством, см. §1).
//
// Нормализация самого номера (магистральный префикс, код страны) — отдельная,
// уже решённая задача (Light Plan, `telFull`); сюда не переносится, appId()
// принимает номер уже нормализованным.
//
// Только для ЛЮДЕЙ. Номер места (студии, зала, площадки) больше не считается из
// телефона: его выдаёт реестр мест (core/registry.js, 16_Place_Registry.md,
// решение Алексея 05.11.2026 «Ключ — место», BRIDGE_LIGHT_PLAN.md §13).

const PREFIXES = {
  person: "id",
};

export function appId(normalizedPhone, kind = "person") {
  if (kind === "place") {
    throw new Error(
      "Номер места не вычисляется из телефона: его выдаёт реестр мест (core/registry.js)."
    );
  }
  const prefix = PREFIXES[kind];
  if (!prefix) throw new Error(`Unknown ID kind: ${kind}`);
  if (!/^\d+$/.test(normalizedPhone)) throw new Error("Phone must be normalized: digits only, no +");
  return prefix + normalizedPhone;
}
