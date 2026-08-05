#!/bin/bash
# ============================================================================
# TARIK BACKEND TORGAS — klik dua kali, lalu tempel Script ID
# ----------------------------------------------------------------------------
# Kenapa harus tempel ID, tidak dipilih dari daftar?
#
# Skrip backend Torgas MENEMPEL pada Spreadsheet (container-bound). Daftar
# `clasp list` hanya menampilkan proyek yang berdiri sendiri, jadi skrip
# seperti ini tidak akan pernah muncul di sana. Itulah sebabnya percobaan
# pertama menarik proyek yang salah.
#
# Berkas ini juga MEMERIKSA hasil tarikannya: kalau ID Spreadsheet di dalam
# skrip tidak cocok dengan milik Torgas, hasilnya dibuang dan tidak ada yang
# dikirim ke mana pun.
# ============================================================================

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
TUJUAN="$REPO/apps-script/live"
SHEET_ID="18seiQwjbwOiXWbqtwYS4zIogftVo_Yd3u-DbDb46jbQ"

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin:$PATH"

tutup() { echo ""; read -n1 -p "  Tekan tombol apa saja untuk menutup..."; echo ""; exit "${1:-0}"; }

echo ""
echo "  ┌──────────────────────────────────────────────┐"
echo "  │   TARIK BACKEND TORGAS DARI APPS SCRIPT      │"
echo "  └──────────────────────────────────────────────┘"
echo ""

command -v clasp >/dev/null 2>&1 || { echo "  ✗ clasp belum terpasang. Klik dua kali \"Pasang Sinkron Apps Script.command\" dulu."; tutup 1; }

echo "  CARA MENDAPATKAN SCRIPT ID:"
echo ""
echo "   1. Spreadsheet Torgas akan dibuka"
echo "   2. Menu  Extensions → Apps Script"
echo "   3. Di Apps Script, klik ikon roda gigi ⚙ (Project Settings)"
echo "   4. Salin baris  \"Script ID\"  — panjang, mirip 1Y5jH4e-Y4-uFJBy…"
echo ""
read -n1 -p "  Tekan tombol apa saja untuk membuka Spreadsheet..."
open "https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
echo ""
echo ""
read -p "  Tempel Script ID di sini lalu Enter: " SCRIPT_ID
SCRIPT_ID=$(echo "$SCRIPT_ID" | tr -d '[:space:]')
echo ""

[ -z "$SCRIPT_ID" ] && { echo "  ✗ Kosong."; tutup 1; }

# ── Tarik ke folder sementara dulu, jangan langsung ke tempat asli ──────────
SEMENTARA=$(mktemp -d)
cat > "$SEMENTARA/.clasp.json" <<EOF
{"scriptId":"$SCRIPT_ID","rootDir":"$SEMENTARA"}
EOF

echo "  → Menarik isi skrip..."
if ! (cd "$SEMENTARA" && clasp pull >/dev/null 2>&1); then
  echo ""
  echo "  ✗ Gagal menarik. Kemungkinan penyebabnya:"
  echo "     • Script ID keliru tersalin"
  echo "     • Skripnya milik akun Galuh, bukan akun Anda"
  echo "       → minta Galuh membagikan aksesnya, atau memindahkan kepemilikan"
  rm -rf "$SEMENTARA"; tutup 1
fi

# ── Periksa: benarkah ini backend Torgas? ───────────────────────────────────
if ! grep -rqs "$SHEET_ID" "$SEMENTARA"; then
  echo ""
  echo "  ✗ INI BUKAN BACKEND TORGAS."
  echo ""
  echo "    Skrip yang tertarik tidak menyebut ID Spreadsheet Torgas sama sekali."
  echo "    Hasilnya dibuang — tidak ada yang tersentuh."
  echo "    Periksa lagi Script ID-nya, lalu ulangi."
  rm -rf "$SEMENTARA"; tutup 1
fi

# ── Lolos pemeriksaan — pindahkan ke tempatnya ──────────────────────────────
rm -rf "$TUJUAN"; mkdir -p "$TUJUAN"
cp -R "$SEMENTARA"/. "$TUJUAN"/
cat > "$TUJUAN/.clasp.json" <<EOF
{"scriptId":"$SCRIPT_ID","rootDir":"$TUJUAN"}
EOF
rm -rf "$SEMENTARA"

jml=$(ls -1 "$TUJUAN" | grep -c -E '\.(gs|js|json|html)$')

echo "    ✓ Cocok — ini backend Torgas"
echo "    ✓ $jml berkas tertarik ke apps-script/live/"
echo ""
echo "  ✓ SELESAI"
echo ""
echo "  Sekarang Claude bisa menyunting backend, dan perubahannya"
echo "  terkirim sendiri ke Google dalam 30 detik."
tutup 0
