#!/bin/bash
# ============================================================================
# PERIKSA DEPLOY BACKEND — klik dua kali, lalu kirim tangkapan layarnya
# ----------------------------------------------------------------------------
# `clasp push` berhasil tapi `clasp deploy` gagal, dan pesan galatnya tertelan
# ke dalam berkas catatan. Berkas ini menjalankan langkah yang sama satu per
# satu di depan mata, supaya pesannya terlihat.
#
# AMAN: hanya membaca keadaan dan mencoba menerbitkan ulang isi yang sudah
# ada di Apps Script. Tidak mengubah kode apa pun.
# ============================================================================

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
LIVE="$REPO/apps-script/live"
LOG="$HOME/Library/Logs/torgas-auto-deploy.log"

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin:$PATH"

tutup() { echo ""; read -n1 -p "  Tekan tombol apa saja untuk menutup..."; echo ""; exit 0; }
judul() { echo ""; echo "  ── $1 ──────────────────────────────────"; }

echo ""
echo "  ┌──────────────────────────────────────────────┐"
echo "  │   PEMERIKSAAN DEPLOY BACKEND                 │"
echo "  └──────────────────────────────────────────────┘"

judul "1. Di mana clasp berada"
which clasp || echo "  ✗ clasp TIDAK ditemukan pada PATH ini"
clasp --version 2>&1 | head -1

judul "2. PATH yang dipakai pemantau latar belakang"
# Ini PATH terbatas yang dipakai launchd — kalau clasp tidak ada di sini,
# pemantau tidak akan pernah bisa menjalankannya meski di Terminal bisa.
env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin" \
  bash -c 'command -v clasp' \
  && echo "  ✓ pemantau bisa menemukan clasp" \
  || echo "  ✗ pemantau TIDAK bisa menemukan clasp — ini penyebabnya"

judul "3. Akun yang sedang masuk"
[ -f "$HOME/.clasprc.json" ] && echo "  ✓ ada kredensial (~/.clasprc.json)" || echo "  ✗ belum login"

judul "4. Daftar penerbitan pada skrip ini"
cd "$LIVE" 2>/dev/null || { echo "  ✗ folder apps-script/live tidak ada"; tutup; }
clasp deployments 2>&1 | head -20

judul "5. ID penerbitan yang dituju"
DEP_ID=$(cat "$REPO/apps-script/.deployment-id" 2>/dev/null)
echo "  $DEP_ID"
if clasp deployments 2>/dev/null | grep -q "$DEP_ID"; then
  echo "  ✓ ID ini ADA di daftar di atas"
else
  echo "  ✗ ID ini TIDAK ada di daftar — kemungkinan besar inilah sebabnya"
fi

judul "6. Coba push (kode ke editor)"
clasp push -f 2>&1 | tail -6

judul "7. Coba deploy — INI YANG SELAMA INI GAGAL"
if [ -n "$DEP_ID" ]; then
  clasp deploy -i "$DEP_ID" -d "uji manual $(date '+%d %b %H:%M')" 2>&1 | tail -12
else
  echo "  ✗ ID penerbitan kosong"
fi

judul "8. Sepuluh baris terakhir catatan kerja"
tail -10 "$LOG" 2>/dev/null || echo "  (catatan belum ada)"

echo ""
echo "  ════════════════════════════════════════════════"
echo "  Kirim tangkapan layar SELURUH jendela ini ke Claude."
echo "  Bagian 2, 5, dan 7 yang paling menentukan."
tutup
