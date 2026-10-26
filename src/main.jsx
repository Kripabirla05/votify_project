import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ensureFreshSeedData } from './data/mockData';

// Clears any stale `smartvote_*` snapshot from a previous seed version before
// React mounts, so the app always boots with the current demo data.
ensureFreshSeedData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
