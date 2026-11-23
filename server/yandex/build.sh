#!/usr/bin/env bash
# Собирает ZIP для загрузки в консоль Yandex Cloud: server/yandex/dist/eventoscore.zip
# Внутри: index.js, adapter.mjs, store.mjs, token.mjs, core/, node_modules (ydb-sdk). Секретов в архиве нет.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$here/dist/build"
rm -rf "$here/dist" && mkdir -p "$out/core"
cp "$here/index.js" "$here/adapter.mjs" "$here/store.mjs" "$here/token.mjs" "$here/package.json" "$out/"
cp "$here"/../core/*.mjs "$out/core/"
rm -f "$out/core/memory_store.mjs"   # подложное хранилище в облако не нужно
(cd "$out" && npm install --omit=dev --no-audit --no-fund --silent)
# Облегчаем архив: карты исходников, описания типов, документация, тесты и ES-копии пакетов не нужны для запуска.
find "$out/node_modules" \( -name '*.map' -o -name '*.d.ts' -o -name '*.md' -o -name '*.ts' -not -name '*.d.ts' \) -type f -delete 2>/dev/null || true
find "$out/node_modules" -type d \( -name test -o -name tests -o -name docs -o -name esm -o -name esm5 -o -name esm2015 -o -name __tests__ \) -prune -exec rm -rf {} + 2>/dev/null || true
(cd "$out" && zip -qr "$here/dist/eventoscore.zip" . -x "package-lock.json")
echo "готово: $here/dist/eventoscore.zip ($(du -h "$here/dist/eventoscore.zip" | cut -f1))"
