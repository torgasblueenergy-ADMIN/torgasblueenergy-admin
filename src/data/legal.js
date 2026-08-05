const LEGAL_INFO = {
  name: "TORGAS BLUE ENERGY",
  nib: "<KOSONG>",
  ahu: "<KOSONG>",
  status: "<KOSONG>",
  bases: "Jatinangor & Pangandaran, West Java",
  focus: "Marine Research, Marine Biomass Energy & Autonomous Monitoring Systems"
};

/* ================================================================
   HALAMAN LEGAL — KEBIJAKAN PRIVASI & KETENTUAN LAYANAN
   ----------------------------------------------------------------
   ⚠️ DRAFT. Disusun berdasarkan data yang benar-benar dikumpulkan
   website ini (form magang, part-time, booking lab, student portal)
   yang seluruhnya dikirim ke Google Apps Script → Google Sheets.
   Mohon ditinjau penasihat hukum sebelum dijadikan acuan resmi.

   ⚠️ CATATAN BAHASA — 5 Agustus 2026
   Naskah ini semula berbahasa Indonesia, diterjemahkan ke Inggris
   atas permintaan Mahdan agar seragam dengan sisa situs.

   Yang perlu ditanyakan ke penasihat hukum saat naskah ini ditinjau:
   pembacanya pengguna Indonesia, dan bila timbul perkara yang
   memeriksa adalah otoritas Indonesia. Banyak lembaga memilih
   menyimpan versi Indonesia sebagai naskah yang mengikat dan
   menjadikan versi Inggris sekadar terjemahan — perlu diputuskan
   mana yang berlaku bila kelak ada beda tafsir.

   Rujukan UU No. 27 Tahun 2022 sengaja tetap memakai nama resmi
   Indonesianya; nama undang-undang tidak diterjemahkan.
================================================================ */
const LEGAL_UPDATED = '5 August 2026';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains what data we collect through the Torgas Blue Energy website, what it is used for, and what rights you have over it.',
    sections: [
      {
        h: '1. Data We Collect',
        p: 'We only collect data you enter yourself into the forms on this site. We do not buy personal data, nor do we receive it from third parties.',
        list: [
          'Internship & Part-Time forms: full name, student ID, email, phone number, university, study programme, GPA, supervisor name, and proposed topic.',
          'Laboratory Booking form: name, institution, contact details, service type, and testing requirements.',
          'Student Portal: research progress notes, mentoring schedules, and equipment requests.',
          'We do NOT collect payment details, national identity numbers, or biometric data.'
        ]
      },
      {
        h: '2. How the Data Is Used',
        p: 'The data you submit is used solely for laboratory operations:',
        list: [
          'Screening and contacting internship and part-time applicants.',
          'Scheduling and preparing laboratory testing services.',
          'Tracking the progress of students under our supervision.',
          'Compiling internal statistics in aggregate form, without individual identities.'
        ]
      },
      {
        h: '3. Data Storage',
        p: 'Form submissions are sent through Google Apps Script and stored in Torgas Blue Energy’s Google Workspace (Google Sheets). Access is limited to the staff who need it. Google acts as a data processor and is bound by its own privacy policy.'
      },
      {
        h: '4. Sharing Data with Others',
        p: 'We do not sell, rent, or trade your personal data. Data is shared only when:',
        list: [
          'You have given written consent beforehand.',
          'A partner university requires it to administer your internship or practical work.',
          'It is required by law or by a formal request from an authorised institution.'
        ]
      },
      {
        h: '5. Retention Period',
        p: 'Data from applicants who are not accepted is deleted no later than 12 months after the selection process ends. Data on interns and laboratory service users is kept for as long as it is needed for research documentation and institutional reporting obligations.'
      },
      {
        h: '6. Your Rights',
        p: 'Under Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi — Indonesia’s Personal Data Protection Law — you have the right to:',
        list: [
          'Request a copy of the personal data we hold about you.',
          'Request correction of data that is inaccurate or incomplete.',
          'Request deletion of your data.',
          'Withdraw consent you previously gave.'
        ],
        after: 'Requests can be sent to torgasblueenergy@gmail.com and will be answered within 14 working days.'
      },
      {
        h: '7. Cookies, Statistics & Tracking',
        p: 'This site sets no tracking or advertising cookies, and does not follow your activity on other sites. Visits are measured using a cookieless analytics service that collects aggregate data only:',
        list: [
          'The number of visits and which pages were opened.',
          'The approximate country or city a visit came from.',
          'The type of device and browser used.',
          'The referring link that brought you here.'
        ],
        after: 'This data is aggregate — we CANNOT identify individual visitors. IP addresses are processed only momentarily to estimate location and are not stored. If your browser has "Do Not Track" enabled, no statistics are collected at all. Fonts are also loaded from Google Fonts, so your IP address may be recorded by Google as part of delivering them.'
      },
      {
        h: '8. Changes to This Policy',
        p: 'This policy may be updated from time to time. The date it was last revised is always shown at the top of this page.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    intro: 'By accessing the Torgas Blue Energy website and using the services offered on it, you are taken to have agreed to the terms below.',
    sections: [
      {
        h: '1. About Us',
        p: 'Torgas Blue Energy operates an integrated marine research laboratory in Jatinangor, Sumedang, West Java, with a coastal research station in Pangandaran. We work in autonomous marine monitoring technology and clean energy based on marine biomass.'
      },
      {
        h: '2. Use of the Site',
        p: 'You agree not to:',
        list: [
          'Submit false or misleading data, or impersonate anyone else on any form.',
          'Attempt to access the Student Portal or any other restricted area without permission.',
          'Disrupt, overload, or damage the site’s services and infrastructure.',
          'Extract site content automatically (scraping) without written permission.'
        ]
      },
      {
        h: '3. Laboratory Services',
        p: 'A booking submitted through this site is a request, not a binding contract. Every booking still depends on confirmation of equipment availability, scheduling, and agreed cost. Prices shown are indicative and may change according to the parameters tested and the number of samples.'
      },
      {
        h: '4. Test Results & Research Data',
        p: 'Laboratory results apply only to the samples submitted. Torgas Blue Energy is not responsible for errors arising from how the user collected, handled, or transported those samples. Publications that include our test results must carry appropriate attribution.'
      },
      {
        h: '5. Internships & Part-Time Work',
        p: 'Submitting a form does not guarantee acceptance. Selection weighs field relevance, supervisor capacity, and available places. Those accepted must follow laboratory safety procedures and keep unpublished research data confidential.'
      },
      {
        h: '6. Intellectual Property',
        p: 'All site content — text, logos, photographs, and research material — belongs to Torgas Blue Energy unless stated otherwise. Academic use is permitted with attribution. Commercial use requires written permission.'
      },
      {
        h: '7. Limitation of Liability',
        p: 'This site is provided as is. We work to keep its information accurate, but we do not guarantee it is free of errors or always available. Torgas Blue Energy is not liable for indirect losses arising from use of this site.'
      },
      {
        h: '8. Governing Law',
        p: 'These terms are governed by the laws of the Republic of Indonesia. Disputes will first be pursued through deliberation before any legal route is taken.'
      }
    ]
  }
};

export { LEGAL_INFO, LEGAL_UPDATED, LEGAL_CONTENT };
