// ============================================================
// File: client/src/components/Layout.jsx
// ============================================================

import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
