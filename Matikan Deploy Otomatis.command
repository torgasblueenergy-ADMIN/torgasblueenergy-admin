#!/bin/bash
# ============================================================================
# MATIKAN DEPLOY OTOMATIS — klik dua kali untuk menghentikan pemantau
# ----------------------------------------------------------------------------
# Setelah ini, perubahan tidak lagi terkirim sendiri. Situs tetap seperti
# terakhir kali dideploy — tidak ada yang hilang.
#
# Menyalakan lagi: klik dua kali "Pasang Deploy Otomatis.command"
# ============================================================================

PLIST="$HOME/Library/LaunchAgents/com.torgas.autodeploy.plist"

echo ""
echo "  Menghentikan deploy otomatis..."
echo ""

launchctl unload "$PLIST" 2>/dev/null
rm -f "$PLIST"

if launchctl list | grep -q com.torgas.autodeploy; then
  echo "  ✗ Masih berjalan. Kirim tangkapan layar ini ke Claude."
else
  echo "  ✓ Sudah berhenti."
  echo ""
  echo "  Setelah ini perubahan hanya terkirim kalau Anda sendiri"
  echo "  menjalankan: git push origin main"
fi

echo ""
read -n1 -p "  Tekan tombol apa saja untuk menutup..."
echo ""
