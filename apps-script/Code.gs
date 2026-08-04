/**
 * ================================================================
 * TORGAS BLUE ENERGY — Penerima Form (Google Apps Script)
 * ================================================================
 *
 * MENGAPA FILE INI ADA
 * --------------------
 * Website dulu mengirim form dengan `mode: 'no-cors'`, yang membuat
 * respons server tidak bisa dibaca sama sekali. Akibatnya pengguna
 * SELALU melihat pesan "berhasil dikirim", termasuk saat data gagal
 * masuk. Perbaikan di sisi website hanya berfungsi kalau Apps Script
 * juga membalas JSON — itulah tugas file ini.
 *
 * CARA MEMASANG
 * -------------
 *  1. Buka Google Sheet tujuan → Extensions → Apps Script
 *  2. Timpa seluruh isi Code.gs dengan file ini
 *  3. Isi Script Properties — lihat bagian di bawah
 *  4. Deploy → New deployment → Web app
 *       Execute as        : Me
 *       Who has access    : Anyone            ← WAJIB, jangan "Anyone with Google account"
 *  5. Salin URL /exec hasil deploy ke WEBAPI_URL di src/config.js
 *
 * ⚠️ Setiap kali kode ini diubah, Anda HARUS deploy ulang
 *    (Manage deployments → Edit → Version: New version).
 *    Menyimpan file saja tidak cukup.
 *
 * ================================================================
 * MENGISI SCRIPT PROPERTIES — WAJIB, HANYA SEKALI
 * ================================================================
 * ID Spreadsheet dan Folder CV SENGAJA TIDAK ditulis di berkas ini,
 * karena repositori GitHub-nya bersifat publik. Kedua ID itu menunjuk
 * ke data pribadi pelamar (nama, NIM, IPK, nomor HP, dan berkas CV).
 * Bila Sheet atau folder tersebut disetel "Anyone with the link",
 * ID saja sudah cukup untuk membukanya.
 *
 * Cara mengisinya:
 *   Apps Script → ikon ⚙️ Project Settings (menu kiri)
 *              → gulir ke Script Properties
 *              → Add script property, isikan dua baris berikut:
 *
 *     Property          Value
 *     ---------------   --------------------------------------------
 *     SPREADSHEET_ID    ambil dari URL Spreadsheet:
 *                       docs.google.com/spreadsheets/d/<ID>/edit
 *     CV_FOLDER_ID      ambil dari URL folder Drive:
 *                       drive.google.com/drive/folders/<ID>
 *
 *   → Save script properties
 *
 * ⚠️ JANGAN menuliskan ID yang sebenarnya di berkas ini — termasuk di
 *    dalam komentar. Berkas ini ikut ter-commit ke repositori publik.
 *
 * Nilai ini tersimpan di dalam proyek Apps Script, tidak pernah
 * ikut ter-commit ke GitHub.
 * ================================================================
 */

/** Baca pengaturan dari Script Properties, bukan dari kode. */
function getConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: props.getProperty('SPREADSHEET_ID'),
    cvFolderId: props.getProperty('CV_FOLDER_ID')
  };
}

/* Satu action = satu nama tab di Spreadsheet.
   ⚠️ Nama tab di bawah SENGAJA disamakan dengan tab yang SUDAH ADA di
      "DATABASE TORGAS WEBSITE" (Lab Booking, Magang, Part Time, Pengajuan).
      Kalau namanya beda satu huruf saja, skrip akan MEMBUAT TAB BARU dan
      data jadi tersebar di dua tempat tanpa disadari.

   ⚠️ Kunci di kiri harus persis sama dengan nilai `action` yang dikirim
      website. Versi sebelumnya menulis `parttime` padahal website mengirim
      `part_time_app` — akibatnya pendaftaran part-time akan masuk ke tab
      bernama "part_time_app", bukan ke tab "Part Time" yang sudah ada. */
const SHEET_BY_ACTION = {
  labbook:            'Lab Booking',
  internship:         'Magang',
  part_time_app:      'Part Time',
  portal_procurement: 'Pengajuan',

  /* Tiga di bawah belum punya tab di Spreadsheet — akan dibuat otomatis
     saat pertama kali ada data masuk. Ganti namanya kalau tim sudah
     menyiapkan tab sendiri. */
  portal_booking:     'Portal - Booking',
  portal_progress:    'Portal - Progres',
  portal_mentoring:   'Portal - Mentoring'
};

/** Balasan JSON. Apps Script otomatis menyertakan CORS pada deploy "Anyone". */
function jsonReply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ status: 'error', message: 'Permintaan kosong — tidak ada data yang diterima.' });
    }

    // Website mengirim Content-Type text/plain agar tidak memicu preflight OPTIONS
    // (Apps Script tidak bisa menjawab OPTIONS). Isinya tetap JSON.
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonReply({ status: 'error', message: 'Format data tidak dikenali.' });
    }

    var action = data.action;
    if (!action) {
      return jsonReply({ status: 'error', message: 'Jenis formulir tidak disebutkan.' });
    }

    var cfg = getConfig();
    if (!cfg.spreadsheetId) {
      return jsonReply({
        status: 'error',
        message: 'Script Property SPREADSHEET_ID belum diisi. Hubungi admin.'
      });
    }

    /* ── SIMPAN CV KE GOOGLE DRIVE ──
       Website mengirim tiga field: cvFileName, cvMimeType, cvBase64.
       File disimpan ke CV_FOLDER_ID, lalu yang masuk ke Sheet hanyalah
       TAUTANNYA — bukan isi base64-nya (kalau tidak, satu sel bisa
       berisi ratusan ribu karakter dan Sheet jadi tidak terpakai). */
    var cvLink = '';
    if (data.cvBase64 && data.cvFileName && cfg.cvFolderId) {
      try {
        var folder = DriveApp.getFolderById(cfg.cvFolderId);
        var safeName = (data.fullName || 'pelamar').replace(/[^\w\s-]/g, '').trim();
        var stamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd-HHmmss');
        var ext = data.cvFileName.indexOf('.') > -1
          ? data.cvFileName.substring(data.cvFileName.lastIndexOf('.'))
          : '';

        var blob = Utilities.newBlob(
          Utilities.base64Decode(data.cvBase64),
          data.cvMimeType || 'application/octet-stream',
          safeName + '_' + stamp + ext
        );
        cvLink = folder.createFile(blob).getUrl();
      } catch (errCv) {
        // Kegagalan simpan CV tidak boleh membatalkan pendaftaran —
        // datanya tetap masuk, tapi kesalahannya dicatat di Sheet.
        cvLink = 'GAGAL SIMPAN: ' + errCv.message;
      }
    }

    // Base64 dibuang dari data sebelum ditulis ke Sheet, diganti tautan
    delete data.cvBase64;
    delete data.cvMimeType;
    data.cvLink = cvLink;

    var sheetName = SHEET_BY_ACTION[action] || action;
    var ss = SpreadsheetApp.openById(cfg.spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);

    // Sheet dibuat otomatis kalau belum ada, lengkap dengan baris header
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Waktu'].concat(Object.keys(data).filter(function (k) {
        return k !== 'action';
      })));
      sheet.getRange(1, 1, 1, sheet.getLastColumn())
           .setFontWeight('bold')
           .setBackground('#041b2e')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Susun baris mengikuti urutan header yang sudah ada, supaya kolom tidak bergeser
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function (h) {
      if (h === 'Waktu') return new Date();
      return data[h] !== undefined ? data[h] : '';
    });

    // Field baru yang belum punya kolom → tambahkan kolomnya
    Object.keys(data).forEach(function (k) {
      if (k !== 'action' && headers.indexOf(k) === -1) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue(k)
             .setFontWeight('bold').setBackground('#041b2e').setFontColor('#ffffff');
        row.push(data[k]);
      }
    });

    sheet.appendRow(row);

    return jsonReply({
      status: 'success',
      message: 'Data berhasil disimpan.',
      sheet: sheetName,
      row: sheet.getLastRow()
    });

  } catch (err) {
    // Error dikembalikan apa adanya supaya website bisa menampilkan sebab kegagalan
    return jsonReply({ status: 'error', message: 'Kesalahan server: ' + err.message });
  }
}

/** Untuk mengecek dari browser apakah deployment sudah hidup. */
function doGet() {
  return jsonReply({
    status: 'success',
    message: 'Torgas Blue Energy API aktif.',
    actions: Object.keys(SHEET_BY_ACTION)
  });
}
