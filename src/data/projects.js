/* ================================================================
   DATA PROGRAM RISSET & PROYEK LAB TORGAS BLUE ENERGY
================================================================ */
const PROJECTS = [
  {
    id: 'biosentor-usv',
    title: 'Waste water monitoring',
    category: 'Marine Technology & Robotics',
    status: 'In-Field Testing',
    location: 'Pangandaran Station',
    desc: 'Waste water quality monitoring activities through the analysis of physical, chemical, and biological parameters, including heavy metal content such as mercury (Hg), lead (Pb), cadmium (Cd), chromium (Cr), and arsenic (As). These tests aim to detect pollution levels, ensure that wastewater meets environmental quality standards, and protect marine ecosystems from the impacts of pollution and heavy metal accumulation.',
    image: 'images/projects/image-1.jpg',
    tags: ['Autonomous USV', 'Real-Time Telemetry', 'Oceanography']
  },
  {
    id: 'biogas-biomassa',
    title: 'Carbon storage and radiocarbon dating',
    category: 'Renewable Clean Energy',
    status: 'Active Lab Experiment',
    location: 'Jatinangor Integrated Lab',
    desc: 'A research project is currently underway to study carbon storage and radiocarbon dating in various study areas, including Surabaya, Gresik, Pasuruan, Malang, and Pangandaran. This research aims to obtain information on the dynamics of carbon storage and the age of organic materials to serve as a basis for supporting environmental studies and the management of coastal and marine ecosystems.',
    // Sebelumnya 'images/Projects/...' (P besar). Aman di macOS, tapi 404 di
    // server Linux yang membedakan huruf besar-kecil. Jangan diubah lagi.
    image: 'images/projects/biomassa.jpg',
    tags: ['Bioenergy', 'Macroalgae Digestate', 'Clean Tech']
  },
  {
    id: 'blue-carbon',
    title: 'Bioinformatics',
    category: 'Climate & Marine Science',
    status: 'Ongoing Survey',
    location: 'West Java Coast',
    desc: 'Research that utilizes computational approaches to process, analyze, and interpret biological data, such as genomic, metagenomic, and DNA sequence data. In the marine field, this project supports the identification of biodiversity, the analysis of microbial communities, and the understanding of the genetic relationships among marine organisms to support research and the management of coastal and marine ecosystems',
    image: 'images/projects/Bioinformatics.jpg',
    tags: ['Blue Carbon', 'Mangrove Ecosystem', 'Climate Action']
  },
  {
    id: 'telemetry-array',
    title: 'Biochemistry ',
    category: 'IoT & Marine Data',
    status: 'Operational',
    location: 'Jatinangor & Pangandaran',
    desc: 'A research project focused on the analysis of biochemical compounds in marine organisms and the marine environment, such as proteins, lipids, carbohydrates, enzymes, and metabolites. This research aims to understand the biochemical processes underlying the biological functions of marine organisms, environmental quality, and the utilization of marine biological resources to support research and management of coastal and marine ecosystems.',
    image: 'images/projects/Biokimia.jpg',
    tags: ['IoT Sensor', 'Ocean Data', 'Wireless Mesh']
  },
  {
    id: 'coastal-health',
    title: 'Biosystem engineering',
    category: 'Ecosystem Conservation',
    status: 'Field Research',
    location: 'Pangandaran Waters',
    desc: 'TORGAS (Biosystem Engineering) is a device used to produce gas from natural materials through the biomass conversion process. This device supports research in the field of biosystem engineering by utilizing organic waste or biomass as a source of renewable energy, thereby contributing to the development of environmentally friendly and sustainable technologies.',
    image: 'images/projects/Biosystem-Engineering.jpg',
    tags: ['Biodiversity', 'Ecosystem Health', 'Marine Survey']
  },
  {
    id: 'desalination-micro',
    title: 'Ocean Blue Health Innovation',
    category: 'Sustainable Technology',
    status: 'Prototype Phase',
    location: 'Jatinangor Integrated Lab',
    desc: 'Ocean Blue Health Innovation is a research project focused on developing innovations based on marine resources to support human health and well-being. This research involves exploring the potential of marine life, bioactive compounds, and marine technologies that can be utilized in the fields of health, biotechnology, and sustainable marine resource management.',
    image: 'images/projects/Bluehealth.jpg',
    tags: ['Desalination', 'Clean Water', 'Solar Hybrid']
  },
  {
    id: 'marine-robotics',
    title: 'Microplastics',
    category: 'Autonomous Systems',
    status: 'In Development',
    location: 'Jatinangor & Pangandaran',
    desc: 'Microplastics is a research project focused on studying the presence, distribution, and impact of microplastics in aquatic environments, particularly marine ecosystems. This research involves identifying the types, characteristics, and potential for accumulation of microplastics in water, sediments, and marine biota in an effort to understand pollution levels and support sustainable marine environmental management.',
    image: 'images/projects/Microplastics.jpeg',
    tags: ['Autonomous Vessels', 'Robotic Sensors', 'Marine Automation']
  },

  /* ────────────────────────────────────────────────────────────────
     REVISI PAK TORA 4/8/2026 — poin #14: tambahkan proyek Salt (Garam)

     Judul risetnya dari Galuh (4 Agu 2026):
       "Engineering Contaminant-Safe Freshwater and Salt
        via Hydrate-Based Desalination"

     Judul resmi risetnya dipakai penuh — bukan 'Salt (Garam)'. Karena jauh
     lebih panjang dari judul proyek lain, ukuran hurufnya di kartu dibuat
     menyesuaikan panjang judul (lihat ProjectsSection.jsx).

     ⚠️ DESKRIPSI DI BAWAH ADALAH RINGKASAN — bukan teks resmi utuh.
     Teks asli dari tim ±180 kata, terlalu panjang untuk kartu ini
     (proyek lain ±60-80 kata). Ringkasannya ±90 kata, disusun Claude
     atas permintaan Mahdan 5 Agu 2026. MOHON DIPERIKSA TIM.

     ── TEKS ASLI DARI TIM (Galuh, 4 Agu 2026) — simpan, jangan dihapus ──
     "This project pioneers an interdisciplinary approach that integrates
     hydrate-based seawater desalination with marine environmental science
     to address the dual challenges of freshwater scarcity and marine
     pollution. By coupling hydrate-based desalination with calcium sulfate
     (CaSO₄) precipitation, the research will optimize freshwater and salt
     production while, for the first time, investigating the fate of heavy
     metals and microplastics throughout the desalination process. The study
     will provide fundamental insights into contaminant exclusion, transport,
     and accumulation mechanisms at hydrate and crystal interfaces, advancing
     the scientific understanding of contaminant behavior during desalination.
     These findings will support the development of next-generation
     desalination technologies that are energy-efficient, environmentally
     sustainable, and capable of producing contaminant-safe freshwater and
     salt. Beyond technological innovation, the project contributes to water
     security, marine pollution mitigation, and circular resource recovery,
     supporting the Blue Economy and the Sustainable Development Goals while
     providing practical solutions for Indonesia and other coastal regions
     facing increasing environmental and freshwater challenges."
     ─────────────────────────────────────────────────────────────────────

     Gambarnya diagram teknis (tampak depan & samping), mendatar 4:3.
     Kotak gambarnya 5:3, jadi tetap memakai `fit: 'contain'` — kalau
     dipotong, label "Tampak Samping/Depan" di bagian atas akan hilang.

     ⚠️ `location` masih 'Pangandaran', warisan dari penampung lama.
        Mohon dipastikan — riset ini memakai reaktor bertekanan.
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'salt-research',
    title: 'Engineering Safe Freshwater and Salt Through Hydrate Desalination',
    category: 'Marine Resource Processing',
    status: 'In Development',
    location: 'Pangandaran',
    desc: 'This project combines hydrate-based seawater desalination with marine environmental science to address freshwater scarcity and marine pollution together. By coupling hydrate desalination with calcium sulfate (CaSO₄) precipitation, the research optimizes freshwater and salt production while, for the first time, tracing how heavy metals and microplastics behave throughout the process. Insights into contaminant exclusion and accumulation at hydrate and crystal interfaces will guide desalination technology that is energy-efficient, environmentally sustainable, and capable of producing contaminant-safe freshwater and salt — supporting water security and the Blue Economy across Indonesia\'s coastal regions.',
    image: 'images/projects/salt-desalination.png',
    fit: 'contain',
    tags: ['Hydrate Desalination', 'Clean Water', 'Sea Salt']
  }
];

export { PROJECTS };
