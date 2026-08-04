/* ================================================================
   DATA PROGRAM RISSET & PROYEK LAB TORGAS BLUE ENERGY
================================================================ */
const PROJECTS = [
  {
    id: 'biosentor-usv',
    title: 'Waste water monitoring',
    category: 'Marine Technology & Robotics',
    status: 'In-Field Testing',
    location: 'Stasiun Pangandaran',
    desc: 'Waste water quality monitoring activities through the analysis of physical, chemical, and biological parameters, including heavy metal content such as mercury (Hg), lead (Pb), cadmium (Cd), chromium (Cr), and arsenic (As). These tests aim to detect pollution levels, ensure that wastewater meets environmental quality standards, and protect marine ecosystems from the impacts of pollution and heavy metal accumulation.',
    image: 'images/projects/image-1.jpg',
    tags: ['Autonomous USV', 'Real-Time Telemetry', 'Oceanography']
  },
  {
    id: 'biogas-biomassa',
    title: 'Carbon storage and radiocarbon dating',
    category: 'Renewable Clean Energy',
    status: 'Active Lab Experiment',
    location: 'Lab Terpadu Jatinangor',
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
    location: 'Pesisir Jawa Barat',
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
    location: 'Perairan Pangandaran',
    desc: 'TORGAS (Biosystem Engineering) is a device used to produce gas from natural materials through the biomass conversion process. This device supports research in the field of biosystem engineering by utilizing organic waste or biomass as a source of renewable energy, thereby contributing to the development of environmentally friendly and sustainable technologies.',
    image: 'images/projects/Biosystem-Engineering.jpg',
    tags: ['Biodiversity', 'Ecosystem Health', 'Marine Survey']
  },
  {
    id: 'desalination-micro',
    title: 'Ocean Blue Health Innovation',
    category: 'Sustainable Technology',
    status: 'Prototype Phase',
    location: 'Lab Terpadu Jatinangor',
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

     ⚠️ Isi di bawah ini masih PLACEHOLDER. Mohon lengkapi:
        • desc     — deskripsi riset garam yang sebenarnya
        • status   — misal 'Active Lab Experiment' / 'In Development'
        • location — lokasi kegiatannya
        • image    — taruh foto di images/projects/ lalu tulis pathnya,
                     jangan lupa buat versi .webp-nya
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'salt-research',
    title: 'Salt (Garam)',
    category: 'Marine Resource Processing',
    status: 'In Development',
    location: 'Pangandaran',
    desc: 'PLACEHOLDER — mohon diisi deskripsi riset garam: fokus penelitian, metode, dan tujuannya.',
    image: 'images/projects/image-1.jpg',
    tags: ['Sea Salt', 'Marine Resource', 'Coastal Industry']
  }
];

export { PROJECTS };
