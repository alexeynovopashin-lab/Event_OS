// JPEG для аватарки (CORE-02): проверка и вырезание метаданных БЕЗ перекодирования.
// Только разбор байтов — одинаково работает в функции Яндекса и в Cloudflare Worker, без библиотек картинок.
//
// Вырезается: APP1–APP15 (0xE1–0xEF: EXIF, геометка, XMP, цветовой профиль ICC в APP2…) и COM (0xFE).
// Остаётся: APP0 (JFIF) и всё, что нужно для показа. Пиксели не трогаются, файл не пережимается.
// Следствие, о котором надо знать: вместе с EXIF уходит и профиль ICC (APP2); для обычной sRGB-картинки
// это незаметно, для Display P3 цвета на сервере выглядят чуть бледнее. Решение Алексея 23.11: «только вырезать».

export const MAX_BYTES = 1024 * 1024; // 1 МБ
export const MIN_SIDE = 256;
export const MAX_SIDE = 1024;

const isSof = (m) => m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc;
const isStripped = (m) => (m >= 0xe1 && m <= 0xef) || m === 0xfe;

// Возвращает { ok:true, width, height, clean } или { ok:false, status, error }.
export function processJpeg(bytes) {
  const n = bytes.length;
  if (n > MAX_BYTES) return { ok: false, status: 413, error: "too_large" };
  if (n < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return { ok: false, status: 415, error: "not_jpeg" };

  const bad = { ok: false, status: 422, error: "bad_jpeg" };
  const kept = [bytes.subarray(0, 2)];
  let i = 2;
  let width = 0;
  let height = 0;
  let scanFrom = -1;

  while (i < n) {
    while (i < n && bytes[i] === 0xff && bytes[i + 1] === 0xff) i++; // добивка 0xFF перед маркером
    if (bytes[i] !== 0xff || i + 1 >= n) return bad;
    const marker = bytes[i + 1];
    if (marker === 0x00 || marker === 0xd8 || marker === 0xd9) return bad; // EOI/SOI до начала скана
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { // маркеры без длины
      kept.push(bytes.subarray(i, i + 2));
      i += 2;
      continue;
    }
    if (i + 4 > n) return bad;
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    const end = i + 2 + len;
    if (len < 2 || end > n) return bad;

    if (isSof(marker)) {
      if (len < 8 || width) return bad; // второй SOF — не наш случай
      height = (bytes[i + 5] << 8) | bytes[i + 6];
      width = (bytes[i + 7] << 8) | bytes[i + 8];
    }
    if (marker === 0xda) { // начало скана: дальше сжатые данные, копируем до конца как есть
      if (!width) return bad;
      scanFrom = i;
      break;
    }
    if (!isStripped(marker)) kept.push(bytes.subarray(i, end));
    i = end;
  }

  if (scanFrom < 0) return bad;
  if (bytes[n - 2] !== 0xff || bytes[n - 1] !== 0xd9) return bad; // нет конца файла — обрезан
  kept.push(bytes.subarray(scanFrom));

  if (width !== height || width < MIN_SIDE || width > MAX_SIDE) return { ok: false, status: 422, error: "bad_size" };

  const clean = new Uint8Array(kept.reduce((s, c) => s + c.length, 0));
  let o = 0;
  for (const c of kept) { clean.set(c, o); o += c.length; }
  return { ok: true, width, height, clean };
}
