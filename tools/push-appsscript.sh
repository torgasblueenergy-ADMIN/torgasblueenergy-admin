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

# ── Pengaman: pastikan ini benar-benar backend Torgas ───────────────────────
# ⚠️ RIWAYAT 5 Agu 2026: clasp pernah menarik proyek Apps Script yang SALAH
# (milik Anda, tapi bukan backend ini). Kalau tidak ketahuan, skrip di bawah
# akan menimpa proyek tak berdosa itu dengan kode Torgas. Karena `clasp list`
# tidak menampilkan skrip yang menempel pada Spreadsheet, salah pilih itu
# gampang terjadi — jadi sekarang diperiksa dulu sebelum apa pun dikirim.
PENANDA=$(cat "$REPO/apps-script/.expected-spreadsheet-id" 2>/dev/null)
if [ -n "$PENANDA" ]; then
  if ! grep -rqs "$PENANDA" "$LIVE"; then
    catat "BERHENTI: isi apps-script/live bukan backend Torgas (ID Spreadsheet tidak cocok). Tidak ada yang dikirim."
    exit 1
  fi
fi

cd "$LIVE" || exit 1

# ── Kirim kode ──────────────────────────────────────────────────────────────
if ! clasp push -f >>"$LOG" 2>&1; then
  catat "GAGAL push — kode TIDAK berubah di Google"
  exit 1
fi
catat "Kode terkirim ke Apps Script"

# ── Tahan penerbitan bila diminta ───────────────────────────────────────────
# Menambah layanan Google baru (Calendar, Drive, Gmail…) mengubah daftar izin
# yang diminta script. Web app ini berjalan sebagai pemilik, dan Apps Script
# menolak MENJALANKAN APA PUN selama masih ada izin yang belum disetujui —
# bukan hanya bagian barunya. Kalau langsung diterbitkan, formulir pendaftaran
# dan tombol persetujuan email ikut mati sampai pemilik menyetujui izinnya.
#
# Karena itu: kodenya boleh naik ke editor, tapi penerbitannya ditahan sampai
# pemilik menjalankan fungsi uji sekali dan menyetujui izin barunya.
# Hapus berkas apps-script/.deploy-hold untuk melanjutkan.
if [ -f "$REPO/apps-script/.deploy-hold" ]; then
  catat "Kode terkirim ke editor, TAPI penerbitan ditahan (.deploy-hold ada)"
  exit 0
fi

# ══════════════════════════════════════════════════════════════════════════
# PERBARUI PENERBITAN
# ══════════════════════════════════════════════════════════════════════════
# clasp push hanya mengubah kode di editor. Website memanggil sebuah
# "deployment" berversi, jadi penerbitannya harus ditunjuk ulang ke kode baru —
# kalau tidak, perubahan tidak terasa sama sekali dari sisi pengguna.
#
# ⚠️ RIWAYAT BUG — 5 Agu 2026, JANGAN DIULANG
# Versi pertama berkas ini keluar dengan `exit 1` bila deploy gagal. Akibatnya
# auto-deploy.sh tidak pernah menyimpan sidik jari folder, siklus 30 detik
# berikutnya menganggap backend berubah lagi, lalu mencoba deploy lagi — terus
# begitu tanpa henti. Setiap percobaan MEMBUAT VERSI BARU di Apps Script, dan
# kuota harian pembuatan versi habis dalam hitungan jam:
#     "Resource has been exhausted (e.g. check quota)"
#
# Tiga pengaman sekarang:
#   1. Berkas ini SELALU keluar dengan 0 setelah push berhasil, supaya sidik
#      jari tersimpan dan tidak ada pengulangan tanpa henti.
#   2. Jeda 15 menit antar percobaan deploy.
#   3. Berhenti mencoba setelah 3 kegagalan berturut-turut, dan menandai bahwa
#      penerbitan harus dilakukan manual.
DEP_ID=$(cat "$REPO/apps-script/.deployment-id" 2>/dev/null)
JEDA="$REPO/apps-script/.deploy-cooldown"
GAGAL="$REPO/apps-script/.deploy-fails"

if [ -z "$DEP_ID" ]; then
  catat "PERINGATAN: ID penerbitan tidak diketahui — kode terkirim tapi BELUM aktif"
  exit 0
fi

# Sudah menyerah? Jangan sentuh kuota lagi sampai orang turun tangan.
if [ -f "$REPO/apps-script/.deploy-manual-needed" ]; then
  catat "Kode terkirim ke editor. Penerbitan menunggu tindakan manual — lihat apps-script/.deploy-manual-needed"
  exit 0
fi

# Jeda antar percobaan
if [ -f "$JEDA" ] && [ -z "$(find "$JEDA" -mmin +15 2>/dev/null)" ]; then
  catat "Kode terkirim ke editor. Penerbitan menunggu jeda (percobaan berikutnya ≥15 menit lagi)"
  exit 0
fi
touch "$JEDA"

if clasp deploy -i "$DEP_ID" -d "Otomatis $(date '+%d %b %H:%M')" >>"$LOG" 2>&1; then
  catat "Penerbitan diperbarui — backend baru sudah aktif"
  rm -f "$GAGAL" "$JEDA"
  exit 0
fi

n=$(( $(cat "$GAGAL" 2>/dev/null || echo 0) + 1 ))
echo "$n" > "$GAGAL"
catat "GAGAL memperbarui penerbitan (percobaan ke-$n) — kode ada di editor tapi BELUM aktif"

if [ "$n" -ge 3 ]; then
  cat > "$REPO/apps-script/.deploy-manual-needed" <<EOF
Penerbitan otomatis DIHENTIKAN setelah $n kegagalan berturut-turut.
Terakhir dicoba: $(date '+%d %b %Y %H:%M')

Penyebab tersering: kuota Apps Script untuk membuat versi baru habis
("Resource has been exhausted"). Kuota ini pulih sendiri setelah sekitar
24 jam.

Kode BARU sudah ada di editor Apps Script — yang belum hanya penerbitannya.

Terbitkan manual:
  Apps Script → Deploy → Manage deployments → pilih penerbitan aktif
  → ikon pensil ✏️ → Version: New version → Deploy

Setelah berhasil, hapus berkas ini supaya penerbitan otomatis jalan lagi.
EOF
  catat "BERHENTI mencoba. Penerbitan otomatis dimatikan sampai apps-script/.deploy-manual-needed dihapus."
fi

# Selalu keluar 0 — push sudah berhasil, jangan sampai siklus berikutnya
# mengulang seluruh proses dan menghabiskan kuota lagi.
exit 0
