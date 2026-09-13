import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProfileProvider } from './context/ProfileContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { Profile } from './pages/Profile';
import { Recommendations } from './pages/Recommendations';
import { NotFound } from './pages/NotFound';

// Helper component to reset scroll position upon page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAFBFC] text-[#0F172A] font-sans antialiased selection:bg-[#D1FAE5] selection:text-[#065F46]">
          {/* Main Navigation */}
          <Navbar />

          {/* Primary View Container */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ProfileProvider>
  );
}
