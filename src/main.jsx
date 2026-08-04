import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import './index.css';

// Statistik pengunjung tanpa cookie. Otomatis nonaktif saat `npm run dev`
// dan saat pengaturan di .env belum diisi — lihat src/lib/analytics.js
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
