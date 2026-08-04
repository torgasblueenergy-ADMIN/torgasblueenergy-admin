/**
 * ================================================================
 * TORGAS BLUE ENERGY — Penerima Form & Alur Persetujuan
 * ================================================================
 *
 * APA YANG DILAKUKAN BERKAS INI
 * -----------------------------
 *  1. Menerima kiriman formulir dari website → simpan ke Google Sheet
 *  2. Menyimpan CV pelamar ke folder Google Drive
 *  3. Mengirim email ke penyetuju berisi tombol ✅ Setujui / ❌ Tolak
 *  4. Saat tombol diklik → status di Sheet berubah otomatis
 *  5. Menyediakan daftar pengajuan untuk tabel di Student Portal
 *
 * ================================================================
 * MENGISI SCRIPT PROPERTIES — WAJIB, HANYA SEKALI
 * ================================================================
 * Nilai-nilai di bawah SENGAJA tidak ditulis dalam kode, karena
 * repositori GitHub-nya publik.
 *
 *   Apps Script → ⚙️ Project Settings → Script Properties → Add
 *
 *     Property           Value
 *     ----------------   ------------------------------------------
 *     SPREADSHEET_ID     dari URL Sheet: /spreadsheets/d/<ID>/edit
 *     CV_FOLDER_ID       dari URL folder: /drive/folders/<ID>
 *     APPROVER_EMAILS    email penyetuju, pisahkan dengan koma
 *                        contoh: pak.tora@x.com, kepalalab@x.com
 *     WEBAPP_URL         URL /exec hasil deploy (untuk tautan email)
 *
 * ⚠️ JANGAN menuliskan nilai aslinya di berkas ini, termasuk di
 *    dalam komentar.
 *
 * ================================================================
 * CARA DEPLOY
 * ================================================================
 *  Deploy → New deployment → Web app
 *    Execute as     : Me
 *    Who has access : Anyone      ← WAJIB, bukan "Anyone with Google account"
 *
 * ⚠️ Setiap kali kode ini diubah, HARUS deploy ulang:
 *    Manage deployments → Edit ✏️ → Version: New version → Deploy
 *    Menyimpan berkas saja TIDAK cukup.
 */

/* ================================================================
   PENGATURAN PRIVASI TABEL PORTAL
   ----------------------------------------------------------------
   Menentukan kolom apa saja yang boleh dikirim ke website.

   ⚠️ Endpoint ini dapat diakses siapa pun yang membaca kode situs,
      karena gerbang Student Portal hanya berjalan di browser.
      Apa pun yang didaftarkan di sini menjadi INFORMASI PUBLIK.

   Saat ini disetel menampilkan seluruh kolom sesuai permintaan.
   Untuk memperketat, ganti nilainya menjadi:

     var PUBLIC_FIELDS = ['id', 'Waktu', 'action', 'status'];

   Cukup satu baris — tidak perlu mengubah kode lain.
================================================================ */
var PUBLIC_FIELDS = null;   // null = kirim semua kolom

/** Tab mana saja yang muncul di tabel Student Portal. */
var PORTAL_SHEETS = ['Pengajuan', 'Portal - Booking', 'Portal - Progres', 'Portal - Mentoring'];

/* Satu action = satu nama tab. Nama di kanan HARUS sama persis dengan
   tab yang sudah ada di Spreadsheet, kalau tidak skrip membuat tab baru
   dan data tersebar di dua tempat tanpa disadari. */
var SHEET_BY_ACTION = {
  labbook:            'Lab Booking',
  internship:         'Magang',
  part_time_app:      'Part Time',
  portal_procurement: 'Pengajuan',
  portal_booking:     'Portal - Booking',
  portal_progress:    'Portal - Progres',
  portal_mentoring:   'Portal - Mentoring'
};

/** Awalan ID pengajuan per jenis kegiatan. */
var ID_PREFIX = {
  portal_mentoring:   'BIM',
  portal_progress:    'PRO',
  portal_procurement: 'RAB',
  portal_booking:     'BOK',
  labbook:            'LAB',
  internship:         'MAG',
  part_time_app:      'PTM'
};

function getConfig() {
  var p = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: p.getProperty('SPREADSHEET_ID'),
    cvFolderId:    p.getProperty('CV_FOLDER_ID'),
    approvers:     (p.getProperty('APPROVER_EMAILS') || '').split(',')
                     .map(function (s) { return s.trim(); })
                     .filter(function (s) { return s; }),
    webappUrl:     p.getProperty('WEBAPP_URL') || ''
  };
}

function jsonReply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function htmlReply(title, message, color) {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:system-ui,sans-serif;max-width:520px;margin:80px auto;text-align:center;padding:0 20px">' +
    '<div style="font-size:56px;margin-bottom:16px">' + (color === 'green' ? '✅' : color === 'red' ? '❌' : 'ℹ️') + '</div>' +
    '<h1 style="color:#041b2e;font-size:24px;margin:0 0 12px">' + title + '</h1>' +
    '<p style="color:#52616b;line-height:1.6;margin:0">' + message + '</p>' +
    '<p style="color:#8c9ba5;font-size:13px;margin-top:32px">Torgas Blue Energy</p>' +
    '</div>'
  );
}

/** ID pendek yang mudah dibaca, contoh: BIM-U7RH6 */
function buatId(action) {
  var huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // tanpa I, O, 0, 1 agar tidak tertukar
  var acak = '';
  for (var i = 0; i < 5; i++) acak += huruf.charAt(Math.floor(Math.random() * huruf.length));
  return (ID_PREFIX[action] || 'TBE') + '-' + acak;
}

/* ================================================================
   MENERIMA KIRIMAN FORMULIR
================================================================ */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ status: 'error', message: 'Permintaan kosong — tidak ada data yang diterima.' });
    }

    // Website mengirim Content-Type text/plain agar tidak memicu preflight
    // OPTIONS, yang tidak bisa dijawab Apps Script. Isinya tetap JSON.
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonReply({ status: 'error', message: 'Format data tidak dikenali.' });
    }

    var action = data.action;
    if (!action) return jsonReply({ status: 'error', message: 'Jenis formulir tidak disebutkan.' });

    var cfg = getConfig();
    if (!cfg.spreadsheetId) {
      return jsonReply({ status: 'error', message: 'Script Property SPREADSHEET_ID belum diisi. Hubungi admin.' });
    }

    /* ── Simpan CV ke Drive ──
       Yang masuk ke Sheet hanya TAUTANNYA, bukan isi base64-nya. Kalau
       base64 ikut ditulis, satu sel bisa berisi ratusan ribu karakter
       dan Sheet menjadi tidak terpakai. */
    var cvLink = '';
    if (data.cvBase64 && data.cvFileName && cfg.cvFolderId) {
      try {
        var folder = DriveApp.getFolderById(cfg.cvFolderId);
        var nama = (data.fullName || 'pelamar').replace(/[^\w\s-]/g, '').trim();
        var cap = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd-HHmmss');
        var ext = data.cvFileName.indexOf('.') > -1
          ? data.cvFileName.substring(data.cvFileName.lastIndexOf('.')) : '';
        var blob = Utilities.newBlob(
          Utilities.base64Decode(data.cvBase64),
          data.cvMimeType || 'application/octet-stream',
          nama + '_' + cap + ext
        );
        cvLink = folder.createFile(blob).getUrl();
      } catch (errCv) {
        // Kegagalan simpan CV tidak boleh membatalkan pendaftaran
        cvLink = 'GAGAL SIMPAN: ' + errCv.message;
      }
    }
    delete data.cvBase64;
    delete data.cvMimeType;
    data.cvLink = cvLink;

    // Identitas & status awal
    data.id = buatId(action);
    data.status = 'PENDING';
    data.token = Utilities.getUuid();   // rahasia, agar tautan setujui tidak bisa ditebak

    var sheetName = SHEET_BY_ACTION[action] || action;
    var ss = SpreadsheetApp.openById(cfg.spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      var kolom = ['Waktu'].concat(Object.keys(data).filter(function (k) { return k !== 'action'; }));
      sheet.appendRow(kolom);
      sheet.getRange(1, 1, 1, sheet.getLastColumn())
           .setFontWeight('bold').setBackground('#041b2e').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function (h) {
      if (h === 'Waktu') return new Date();
      return data[h] !== undefined ? data[h] : '';
    });
    Object.keys(data).forEach(function (k) {
      if (k !== 'action' && headers.indexOf(k) === -1) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue(k)
             .setFontWeight('bold').setBackground('#041b2e').setFontColor('#ffffff');
        row.push(data[k]);
      }
    });
    sheet.appendRow(row);

    kirimEmailPersetujuan(cfg, action, sheetName, data);

    return jsonReply({
      status: 'success',
      message: 'Data berhasil disimpan.',
      id: data.id,
      sheet: sheetName
    });

  } catch (err) {
    return jsonReply({ status: 'error', message: 'Kesalahan server: ' + err.message });
  }
}

/* ================================================================
   EMAIL PERSETUJUAN
================================================================ */
function kirimEmailPersetujuan(cfg, action, sheetName, data) {
  if (!cfg.approvers.length || !cfg.webappUrl) return;   // belum dikonfigurasi

  var dasar = cfg.webappUrl + '?id=' + encodeURIComponent(data.id) +
              '&sheet=' + encodeURIComponent(sheetName) +
              '&token=' + encodeURIComponent(data.token) + '&aksi=';

  var baris = Object.keys(data)
    .filter(function (k) { return ['token', 'action', 'status'].indexOf(k) === -1 && data[k]; })
    .map(function (k) {
      return '<tr><td style="padding:6px 12px;color:#8c9ba5;font-size:13px;vertical-align:top">' + k +
             '</td><td style="padding:6px 12px;color:#041b2e;font-size:14px">' + data[k] + '</td></tr>';
    }).join('');

  var html =
    '<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">' +
    '<h2 style="color:#041b2e;margin-bottom:4px">Pengajuan baru menunggu persetujuan</h2>' +
    '<p style="color:#52616b;margin-top:0">' + sheetName + ' &middot; <b>' + data.id + '</b></p>' +
    '<table style="width:100%;border-collapse:collapse;background:#f2f7fb;border-radius:12px;margin:20px 0">' +
    baris + '</table>' +
    '<div style="text-align:center;margin:28px 0">' +
    '<a href="' + dasar + 'setujui" style="display:inline-block;background:#2ecc71;color:#fff;font-weight:700;' +
    'padding:14px 32px;border-radius:50px;text-decoration:none;margin:0 6px">✅ Setujui</a>' +
    '<a href="' + dasar + 'tolak" style="display:inline-block;background:#e74c3c;color:#fff;font-weight:700;' +
    'padding:14px 32px;border-radius:50px;text-decoration:none;margin:0 6px">❌ Tolak</a>' +
    '</div>' +
    '<p style="color:#8c9ba5;font-size:12px;text-align:center">Cukup satu orang yang menekan tombol. ' +
    'Status akan langsung diperbarui di Spreadsheet dan di Student Portal.</p>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: cfg.approvers.join(','),
      subject: '[Torgas] Persetujuan ' + sheetName + ' — ' + data.id,
      htmlBody: html
    });
  } catch (err) {
    // Email gagal tidak boleh membatalkan penyimpanan data
    console.error('Gagal kirim email: ' + err.message);
  }
}

/* ================================================================
   doGet — daftar pengajuan & tombol setujui/tolak
================================================================ */
function doGet(e) {
  var cfg = getConfig();
  var p = (e && e.parameter) || {};

  // ── Tombol dari email ──
  if (p.aksi && p.id && p.token) {
    if (!cfg.spreadsheetId) return htmlReply('Belum dikonfigurasi', 'SPREADSHEET_ID belum diisi.', 'red');

    var ss = SpreadsheetApp.openById(cfg.spreadsheetId);
    var sheet = ss.getSheetByName(p.sheet);
    if (!sheet) return htmlReply('Tidak ditemukan', 'Lembar "' + p.sheet + '" tidak ada.', 'red');

    var nilai = sheet.getDataRange().getValues();
    var head = nilai[0];
    var kolId = head.indexOf('id'), kolTok = head.indexOf('token'), kolSts = head.indexOf('status');
    if (kolId < 0 || kolTok < 0 || kolSts < 0) {
      return htmlReply('Struktur tidak sesuai', 'Kolom id / token / status tidak ditemukan.', 'red');
    }

    for (var i = 1; i < nilai.length; i++) {
      if (String(nilai[i][kolId]) === p.id) {
        // Token mencegah orang menebak tautan dan menyetujui sembarangan
        if (String(nilai[i][kolTok]) !== p.token) {
          return htmlReply('Tautan tidak sah', 'Token tidak cocok. Gunakan tautan dari email asli.', 'red');
        }
        var lama = String(nilai[i][kolSts]);
        if (lama !== 'PENDING') {
          return htmlReply('Sudah diproses', 'Pengajuan <b>' + p.id + '</b> sudah berstatus <b>' + lama + '</b>.', 'blue');
        }
        var baru = p.aksi === 'setujui' ? 'APPROVED' : 'REJECTED';
        sheet.getRange(i + 1, kolSts + 1).setValue(baru);
        return htmlReply(
          baru === 'APPROVED' ? 'Pengajuan disetujui' : 'Pengajuan ditolak',
          'Status <b>' + p.id + '</b> kini <b>' + baru + '</b> dan sudah tampil di Student Portal.',
          baru === 'APPROVED' ? 'green' : 'red'
        );
      }
    }
    return htmlReply('Tidak ditemukan', 'Pengajuan dengan ID ' + p.id + ' tidak ada.', 'red');
  }

  // ── Daftar pengajuan untuk tabel Student Portal ──
  if (p.list === '1') {
    if (!cfg.spreadsheetId) return jsonReply({ status: 'error', message: 'Belum dikonfigurasi.' });
    var buku = SpreadsheetApp.openById(cfg.spreadsheetId);
    var hasil = [];

    PORTAL_SHEETS.forEach(function (nama) {
      var sh = buku.getSheetByName(nama);
      if (!sh || sh.getLastRow() < 2) return;
      var v = sh.getDataRange().getValues();
      var h = v[0];
      for (var i = 1; i < v.length; i++) {
        var obj = { sheet: nama };
        h.forEach(function (kol, j) {
          if (kol === 'token') return;                    // token TIDAK PERNAH dikirim keluar
          if (PUBLIC_FIELDS && PUBLIC_FIELDS.indexOf(kol) === -1) return;
          obj[kol] = v[i][j] instanceof Date
            ? Utilities.formatDate(v[i][j], 'Asia/Jakarta', "yyyy-MM-dd'T'HH:mm:ss")
            : v[i][j];
        });
        hasil.push(obj);
      }
    });

    // Terbaru di atas
    hasil.sort(function (a, b) { return String(b.Waktu || '').localeCompare(String(a.Waktu || '')); });
    return jsonReply({ status: 'success', count: hasil.length, data: hasil });
  }

  return jsonReply({
    status: 'success',
    message: 'Torgas Blue Energy API aktif.',
    actions: Object.keys(SHEET_BY_ACTION)
  });
}
