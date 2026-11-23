#!/usr/bin/env bash
# Проверка сервера ядра по шагам 0–3 (core_server_howto, раздел 3): одна команда, зелёное/красное по каждой строке.
#
#   ./check.sh https://functions.yandexcloud.net/<id функции>          # адреса вида …/v1/health
#   MODE=op ./check.sh https://functions.yandexcloud.net/<id функции>  # запасной путь: …?op=health
#   ./check.sh http://127.0.0.1:8800                                   # локально: node ../dev.mjs 8800
#
# Нужны только bash, curl и стандартные утилиты. Номера — выдуманные. Пропуск живёт в переменной
# скрипта и не печатается. Все созданные устройства в конце стираются (DELETE /v1/me).
set -u
BASE="${1:?укажите адрес функции первым аргументом}"
MODE="${MODE:-path}"
HERE="$(cd "$(dirname "$0")" && pwd)"
FX="$HERE/../test/fixtures"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
GOOD=0; BAD=0

url() { if [ "$MODE" = op ]; then echo "${BASE%/}?op=$1"; else echo "${BASE%/}/v1/$1"; fi; }
# call МЕТОД маршрут [curl-аргументы…] → код ответа; тело в $TMP/body, заголовки в $TMP/head
call() {
  local m="$1" r="$2"; shift 2
  curl -s -m 30 -X "$m" -o "$TMP/body" -D "$TMP/head" -w '%{http_code}' "$@" "$(url "$r")"
}
ok() { GOOD=$((GOOD+1)); echo "  ✓ $1"; }
no() { BAD=$((BAD+1)); echo "  ✗ $1 (получено: $2)"; }
expect() { [ "$2" = "$3" ] && ok "$1" || no "$1" "$2, ожидалось $3"; }
field() { sed -n "s/.*\"$1\":\"\([^\"]*\)\".*/\1/p" "$TMP/body" | head -1; }
register() { # номер → пишет REGCODE, DEV и PASS (без подоболочки, чтобы переменные сохранились)
  REGCODE=$(call POST devices -H 'content-type: application/json' \
    -d "{\"app\":\"lightplan\",\"appId\":\"$1\",\"country\":\"RU\",\"appVersion\":\"check\"}")
  DEV=$(field deviceId); PASS=$(field pass)
}
auth() { echo "Authorization: Bearer $PASS"; }
sha() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }

echo "Шаг 0. Связь"
c=$(call GET health); expect "GET health → 200" "$c" 200
grep -q '"ok":true' "$TMP/body" && ok '"ok":true' || no '"ok":true' "$(cat "$TMP/body")"
echo "   ответ: $(cat "$TMP/body")"

echo "Шаг 1. Пропуск устройства"
register id79130000101; expect "регистрация → 201" "$REGCODE" 201
[ -n "$PASS" ] && ok "пропуск выдан" || no "пропуск выдан" "пусто"
GOODPASS="$PASS"; GOODDEV="$DEV"
c=$(call GET me/avatar -H "Authorization: Bearer ${GOODPASS}x"); expect "испорченный пропуск → 401" "$c" 401
c=$(call POST devices -H 'content-type: application/json' -d '{"appId":"id73822000001","country":"RU"}'); expect "городской номер → 400" "$c" 400
c=$(call GET me/avatar); expect "без пропуска → 401" "$c" 401

echo "Шаг 2. Аватарка"
c=$(call GET me/avatar -H "$(auth)"); expect "пока аватарки нет → 404" "$c" 404
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/jpeg' --data-binary "@$FX/square512_plain.jpg"); expect "загрузка 512×512 → 200" "$c" 200
c=$(call GET me/avatar -H "$(auth)" ); expect "GET аватарки → 200" "$c" 200
if [ "$c" = 200 ]; then
  curl -s -m 30 -o "$TMP/got.jpg" -H "$(auth)" "$(url me/avatar)"
  [ "$(sha "$TMP/got.jpg")" = "$(sha "$FX/square512_plain.jpg")" ] && ok "sha256 отданного файла = загруженного" || no "sha256 отданного файла" "разные"
fi
big="$TMP/big.jpg"; head -c 2097152 /dev/zero > "$big"
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/jpeg' --data-binary "@$big"); expect "2 МБ → 413" "$c" 413
printf '\211PNG\r\n\032\n0000' > "$TMP/x.png"
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/png' --data-binary "@$TMP/x.png"); expect "PNG → 415" "$c" 415
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/jpeg' --data-binary "@$FX/rect400x300.jpg"); expect "400×300 → 422" "$c" 422
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/jpeg' --data-binary "@$FX/square512_exif_gps.jpg"); expect "замена (JPEG с геометкой) → 200" "$c" 200
curl -s -m 30 -o "$TMP/geo.jpg" -H "$(auth)" "$(url me/avatar)"
if grep -qa 'Exif' "$TMP/geo.jpg" || grep -qa 'TestCamera' "$TMP/geo.jpg"; then no "метаданные вырезаны" "EXIF остался"; else ok "метаданные вырезаны (EXIF и геометки нет)"; fi
[ "$(sha "$TMP/geo.jpg")" = "$(sha "$FX/square512_plain.jpg")" ] && ok "после вырезания файл побайтно равен тому же снимку без метаданных (картинку не пережимали)" || no "вырезание без пережатия" "файлы различаются"
c=$(call POST avatars/lookup -H 'content-type: application/json' -d '{"id":"id79130000101"}'); expect "чужой поиск по ID до подтверждения номера → 404" "$c" 404
c=$(call DELETE me/avatar -H "$(auth)"); expect "DELETE аватарки → 204" "$c" 204
c=$(call GET me/avatar -H "$(auth)"); expect "после удаления → 404" "$c" 404

echo "Шаг 3. Смена номера и «Удалить мои данные»"
c=$(call PUT me/avatar -H "$(auth)" -H 'content-type: image/jpeg' --data-binary "@$FX/square512_plain.jpg"); expect "аватарка перед сменой номера → 200" "$c" 200
c=$(call PATCH devices/me -H "$(auth)" -H 'content-type: application/json' -d '{"appId":"id79130000102","previous":"id79130000101","at":"2026-11-23T12:00:00Z"}'); expect "смена номера → 200" "$c" 200
c=$(call GET me/avatar -H "$(auth)"); expect "аватарка переехала вместе с номером → 200" "$c" 200
c=$(call DELETE me -H "$(auth)"); expect "DELETE /v1/me → 204" "$c" 204
c=$(call GET me/avatar -H "$(auth)"); expect "после стирания пропуск не годится → 401" "$c" 401
c=$(call POST avatars/lookup -H 'content-type: application/json' -d '{"id":"id79130000102"}'); expect "и аватарки не найти → 404" "$c" 404
c=$(call DELETE me -H "$(auth)"); expect "повторное стирание → 204" "$c" 204

echo
echo "Итого: $GOOD зелёных, $BAD красных."
[ "$BAD" = 0 ]
