#!/bin/bash
# ============================================================================
# PASANG SINKRON APPS SCRIPT — klik dua kali SEKALI saja
# ----------------------------------------------------------------------------
# Memasang "clasp", alat resmi Google untuk Apps Script, lalu menarik skrip
# backend Anda ke dalam folder ini.
#
# Setelah terpasang, Claude bisa menyunting backend seperti berkas biasa,
# dan perubahannya terkirim sendiri ke Google — tanpa salin-tempel lagi.
# ============================================================================

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
TUJUAN="$REPO/apps-script/live"

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin:$PATH"

echo ""
echo "  ┌──────────────────────────────────────────────┐"
echo "  │   TORGAS — SINKRON APPS SCRIPT               │"
echo "  └──────────────────────────────────────────────┘"
echo ""

tutup() { echo ""; read -n1 -p "  Tekan tombol apa saja untuk menutup..."; echo ""; exit "${1:-0}"; }

cd "$REPO" || { echo "  ✗ Folder tidak ditemukan"; tutup 1; }

# ── 1. Node & npm ───────────────────────────────────────────────────────────
if ! command -v npm >/dev/null 2>&1; then
  echo "  ✗ npm tidak ditemukan. Pasang Node.js dulu dari https://nodejs.org"
  tutup 1
fi
echo "  → Node $(node -v) terdeteksi"

# ── 2. Pasang clasp ─────────────────────────────────────────────────────────
if command -v clasp >/dev/null 2>&1; then
  echo "  → clasp sudah terpasang ($(clasp --version 2>/dev/null))"
else
  echo "  → Memasang clasp... (butuh 1-2 menit)"
  if ! npm install -g @google/clasp@2.4.2 >/dev/null 2>&1; then
    echo "  ✗ Gagal memasang. Coba jalankan di Terminal:"
    echo "      sudo npm install -g @google/clasp@2.4.2"
    tutup 1
  fi
  echo "    ✓ Terpasang"
fi

# ── 3. Izinkan Apps Script API ──────────────────────────────────────────────
echo ""
echo "  ┌─ LANGKAH YANG PERLU ANDA LAKUKAN ────────────────────┐"
echo "  │  Halaman pengaturan Google akan terbuka.             │"
echo "  │  Nyalakan  \"Google Apps Script API\"  → ON            │"
echo "  │  Lalu kembali ke jendela ini.                        │"
echo "  └──────────────────────────────────────────────────────┘"
echo ""
read -n1 -p "  Tekan tombol apa saja untuk membuka halamannya..."
open "https://script.google.com/home/usersettings"
echo ""
echo ""
read -n1 -p "  Sudah dinyalakan? Tekan tombol apa saja untuk lanjut..."
echo ""

# ── 4. Masuk ke akun Google ─────────────────────────────────────────────────
if [ -f "$HOME/.clasprc.json" ]; then
  echo ""
  echo "  → Sudah pernah masuk ke akun Google"
else
  echo ""
  echo "  → Membuka jendela izin Google. Pilih akun pemilik Spreadsheet."
  echo ""
  clasp login || { echo "  ✗ Gagal masuk"; tutup 1; }
fi

# ── 5. Pilih proyek skrip ───────────────────────────────────────────────────
echo ""
echo "  → Mengambil daftar proyek Apps Script Anda..."
echo ""

DAFTAR=$(clasp list 2>/dev/null | grep "script.google.com/d/")
if [ -z "$DAFTAR" ]; then
  echo "  ✗ Tidak ada proyek yang terbaca. Pastikan Apps Script API sudah ON,"
  echo "    lalu klik dua kali berkas ini lagi."
  tutup 1
fi

echo "  Proyek yang ditemukan:"
echo ""
i=0
while IFS= read -r baris; do
  i=$((i+1))
  nama=$(echo "$baris" | sed 's| – https.*||' | sed 's|^[[:space:]]*||')
  id=$(echo "$baris" | grep -o 'script.google.com/d/[^/]*' | sed 's|script.google.com/d/||')
  NAMA[$i]="$nama"; ID[$i]="$id"
  printf "    [%d]  %s\n" "$i" "$nama"
done <<< "$DAFTAR"

echo ""
echo "  Pilih yang berisi backend Torgas (yang menempel di Spreadsheet)."
echo ""
read -p "  Ketik nomornya lalu Enter: " pilih
echo ""

SCRIPT_ID="${ID[$pilih]}"
if [ -z "$SCRIPT_ID" ]; then
  echo "  ✗ Nomor tidak dikenali."
  tutup 1
fi
echo "  → Dipilih: ${NAMA[$pilih]}"

# ── 6. Tarik skripnya ───────────────────────────────────────────────────────
mkdir -p "$TUJUAN"
cd "$TUJUAN" || tutup 1

cat > .clasp.json <<EOF
{"scriptId":"$SCRIPT_ID","rootDir":"$TUJUAN"}
EOF

echo "  → Menarik isi skrip..."
if ! clasp pull >/dev/null 2>&1; then
  echo "  ✗ Gagal menarik. Kemungkinan akun yang dipilih tidak punya akses."
  tutup 1
fi

jml=$(ls -1 "$TUJUAN" | grep -c -E '\.(gs|js|json|html)$')
echo "    ✓ $jml berkas tertarik ke apps-script/live/"

# ── 7. Simpan ID penerbitan ─────────────────────────────────────────────────
DEP_ID=$(grep -o "macros/s/[A-Za-z0-9_-]*" "$REPO/src/config.js" | head -1 | sed 's|macros/s/||')
cd "$REPO"
chmod +x tools/push-appsscript.sh 2>/dev/null

if [ -n "$DEP_ID" ]; then
  echo "$DEP_ID" > apps-script/.deployment-id
  echo "  → ID penerbitan tercatat"
else
  echo "  ⚠ ID penerbitan tidak terbaca dari src/config.js — beri tahu Claude"
fi

echo ""
echo "  ✓ SELESAI"
echo ""
echo "  Backend Anda sekarang ada di:  apps-script/live/"
echo "  Claude bisa menyuntingnya langsung, dan perubahannya"
echo "  terkirim sendiri ke Google dalam 30 detik."
echo ""
echo "  Catatan: folder itu TIDAK ikut ke GitHub — di dalamnya ada"
echo "  SECRET_KEY dan ID Spreadsheet yang tidak boleh terbaca umum."
tutup 0
