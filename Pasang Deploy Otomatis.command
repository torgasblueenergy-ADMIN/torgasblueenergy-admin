#!/bin/bash
# ============================================================================
# PASANG DEPLOY OTOMATIS — klik dua kali berkas ini SEKALI saja
# ----------------------------------------------------------------------------
# Setelah dipasang, Mac Anda memeriksa folder ini setiap 30 detik. Begitu ada
# perubahan, ia commit dan kirim ke GitHub sendiri, lalu situs ikut terbarui.
#
# Anda cukup membuka Claude. Tidak perlu VS Code, tidak perlu mengetik apa pun.
# ============================================================================

REPO="/Users/macsupply/DESAIN_BARU_TORGAS 2"
PLIST="$HOME/Library/LaunchAgents/com.torgas.autodeploy.plist"
LOG="$HOME/Library/Logs/torgas-auto-deploy.log"

echo ""
echo "  ┌────────────────────────────────────────────┐"
echo "  │   TORGAS BLUE ENERGY — DEPLOY OTOMATIS     │"
echo "  └────────────────────────────────────────────┘"
echo ""

cd "$REPO" || { echo "  ✗ Folder tidak ditemukan: $REPO"; echo ""; read -n1 -p "  Tekan tombol apa saja untuk menutup..."; exit 1; }

# ── 1. Pastikan git bisa masuk ke GitHub tanpa bertanya ─────────────────────
echo "  → Memeriksa izin masuk GitHub..."
if ! GIT_TERMINAL_PROMPT=0 git ls-remote origin -h refs/heads/main >/dev/null 2>&1; then
  echo ""
  echo "  ✗ Git belum bisa masuk ke GitHub tanpa diminta kata sandi."
  echo "    Jalankan sekali di Terminal:  gh auth login"
  echo "    lalu klik dua kali berkas ini lagi."
  echo ""
  read -n1 -p "  Tekan tombol apa saja untuk menutup..."
  exit 1
fi
echo "    ✓ Bisa masuk"

# ── 2. Siapkan berkas pekerja ───────────────────────────────────────────────
chmod +x "$REPO/tools/auto-deploy.sh" 2>/dev/null
echo "  → Berkas pekerja siap"

# ── 3. Daftarkan ke launchd ─────────────────────────────────────────────────
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"

cat > "$PLIST" <<PLISTEOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.torgas.autodeploy</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$REPO/tools/auto-deploy.sh</string>
    </array>

    <key>StartInterval</key>
    <integer>30</integer>

    <key>RunAtLoad</key>
    <true/>

    <key>StandardErrorPath</key>
    <string>$LOG</string>
</dict>
</plist>
PLISTEOF

launchctl unload "$PLIST" 2>/dev/null
launchctl load "$PLIST" 2>/dev/null

if launchctl list | grep -q com.torgas.autodeploy; then
  echo "  → Pemantau aktif"
  echo ""
  echo "  ✓ SELESAI"
  echo ""
  echo "  Mulai sekarang setiap perubahan di folder ini otomatis"
  echo "  terkirim ke GitHub dalam 30 detik, dan situs ikut terbarui."
  echo ""
  echo "  Melihat catatan kerjanya:"
  echo "     $LOG"
  echo ""
  echo "  Menunda sementara — buat berkas kosong bernama .deploy-pause"
  echo "  Mematikan  — klik dua kali \"Matikan Deploy Otomatis.command\""
else
  echo ""
  echo "  ✗ Pemantau gagal aktif. Kirim tangkapan layar ini ke Claude."
fi

echo ""
read -n1 -p "  Tekan tombol apa saja untuk menutup..."
echo ""
