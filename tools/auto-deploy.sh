#!/bin/bash
# ============================================================================
# TORGAS BLUE ENERGY — PEKERJA DEPLOY OTOMATIS
# ----------------------------------------------------------------------------
# Dijalankan berkala oleh launchd (lihat com.torgas.autodeploy.plist).
# Tugasnya sederhana: kalau ada perubahan di folder, commit lalu push.
# GitHub Actions yang mengurus sisanya (build + terbitkan situs).
#
# Berkas ini TIDAK untuk diklik langsung. Pakai "Pasang Deploy Otomatis.command".
# ============================================================================

set -uo pipefail

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
LOG="$HOME/Library/Logs/torgas-auto-deploy.log"
CABANG="main"

# launchd memberi PATH yang sangat minim — git & gh perlu ditunjuk sendiri.
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"

# Jangan pernah menunggu ketikan. Kalau kredensial bermasalah, gagal saja
# dan catat di log — bukan menggantung selamanya di latar belakang.
export GIT_TERMINAL_PROMPT=0

catat() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }

cd "$REPO" 2>/dev/null || { catat "GAGAL: folder tidak ditemukan — $REPO"; exit 1; }

# ── Rem tangan ──────────────────────────────────────────────────────────────
# Kalau berkas .deploy-pause ada, semua dilewati. Berguna saat sedang
# mengerjakan perubahan besar dan belum siap tampil di situs.
[ -f .deploy-pause ] && exit 0

# ── Backend Apps Script ─────────────────────────────────────────────────────
# apps-script/live/ sengaja tidak masuk Git (memuat SECRET_KEY), jadi git tidak
# bisa memberi tahu kalau isinya berubah. Perubahannya dikenali lewat sidik
# jari isi folder — kalau berbeda dari terakhir kali, kirim ke Google.
if [ -d apps-script/live ]; then
  sidik=$(find apps-script/live -type f \( -name '*.gs' -o -name '*.js' -o -name '*.json' -o -name '*.html' \) \
          -not -name '.clasp.json' -exec shasum {} \; 2>/dev/null | sort | shasum | cut -d' ' -f1)
  lama=$(cat apps-script/.live-hash 2>/dev/null)

  if [ -n "$sidik" ] && [ "$sidik" != "$lama" ]; then
    if bash tools/push-appsscript.sh; then
      echo "$sidik" > apps-script/.live-hash
    fi
  fi
fi

# ── Jangan ganggu pekerjaan git yang belum selesai ──────────────────────────
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || [ -f .git/MERGE_HEAD ]; then
  catat "DILEWATI: ada rebase/merge yang belum selesai"
  exit 0
fi

# ── Hanya bekerja di cabang utama ───────────────────────────────────────────
sekarang=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$sekarang" != "$CABANG" ]; then
  catat "DILEWATI: sedang di cabang '$sekarang', bukan '$CABANG'"
  exit 0
fi

# ── Bersihkan kunci yang macet ──────────────────────────────────────────────
# index.lock seharusnya hidup beberapa milidetik. Kalau umurnya lewat 5 menit,
# proses pembuatnya sudah mati dan berkasnya cuma menghalangi.
if [ -f .git/index.lock ]; then
  if [ -z "$(find .git/index.lock -mmin +5 2>/dev/null)" ]; then
    exit 0                      # masih baru — mungkin git lain sedang jalan
  fi
  rm -f .git/index.lock
  catat "Kunci index.lock yang macet dihapus"
fi

# ── Ada yang berubah? ───────────────────────────────────────────────────────
git add -A 2>/dev/null
if git diff --cached --quiet 2>/dev/null; then
  exit 0                        # tidak ada perubahan — diam saja
fi

berkas=$(git diff --cached --name-only | head -5 | tr '\n' ' ')
jumlah=$(git diff --cached --name-only | wc -l | tr -d ' ')

git commit -q -m "Pembaruan otomatis — $(date '+%d %b %Y %H:%M')" \
             -m "Berkas: $berkas" 2>>"$LOG"

if [ $? -ne 0 ]; then
  catat "GAGAL commit"
  exit 1
fi

catat "Commit: $jumlah berkas — $berkas"

# ── Kirim ke GitHub ─────────────────────────────────────────────────────────
if git push -q origin "$CABANG" 2>>"$LOG"; then
  catat "Push berhasil → GitHub Actions membangun situs"
  exit 0
fi

# Ditolak biasanya karena GitHub punya commit yang belum ada di sini
# (misalnya hasil menyunting berkas lewat situs GitHub). Samakan lalu ulangi.
catat "Push ditolak — mencoba menyamakan dengan GitHub"
if git pull --rebase --autostash -q origin "$CABANG" 2>>"$LOG" \
   && git push -q origin "$CABANG" 2>>"$LOG"; then
  catat "Push berhasil setelah disamakan"
else
  catat "GAGAL push — perlu diperiksa manual"
  exit 1
fi
