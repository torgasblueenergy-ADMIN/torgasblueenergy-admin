#!/bin/bash
# ============================================================================
# TORGAS BLUE ENERGY — KIRIM BACKEND KE GOOGLE
# ----------------------------------------------------------------------------
# Mengirim isi apps-script/live/ ke Apps Script, lalu memperbarui penerbitan
# yang sedang dipakai website — sehingga URL /exec tetap sama.
#
# Dipanggil otomatis oleh tools/auto-deploy.sh saat berkas backend berubah.
# ============================================================================

set -uo pipefail

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
LIVE="$REPO/apps-script/live"
LOG="$HOME/Library/Logs/torgas-auto-deploy.log"

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"

catat() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [backend] $*" >> "$LOG"; }

[ -d "$LIVE" ] || { catat "DILEWATI: apps-script/live belum ada"; exit 0; }
command -v clasp >/dev/null 2>&1 || { catat "GAGAL: clasp tidak terpasang"; exit 1; }

cd "$LIVE" || exit 1

# ── Kirim kode ──────────────────────────────────────────────────────────────
if ! clasp push -f >>"$LOG" 2>&1; then
  catat "GAGAL push — kode TIDAK berubah di Google"
  exit 1
fi
catat "Kode terkirim ke Apps Script"

# ── Perbarui penerbitan ─────────────────────────────────────────────────────
# clasp push hanya mengubah kode di editor. Website memanggil sebuah
# "deployment" berversi, jadi penerbitannya harus ditunjuk ulang ke kode baru —
# kalau tidak, perubahan tidak terasa sama sekali dari sisi pengguna.
DEP_ID=$(cat "$REPO/apps-script/.deployment-id" 2>/dev/null)

if [ -z "$DEP_ID" ]; then
  catat "PERINGATAN: ID penerbitan tidak diketahui — kode terkirim tapi BELUM aktif"
  exit 0
fi

if clasp deploy -i "$DEP_ID" -d "Otomatis $(date '+%d %b %H:%M')" >>"$LOG" 2>&1; then
  catat "Penerbitan diperbarui — backend baru sudah aktif"
else
  catat "GAGAL memperbarui penerbitan — kode terkirim tapi BELUM aktif"
  exit 1
fi
