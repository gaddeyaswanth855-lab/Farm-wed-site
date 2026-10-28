import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FarmProvider } from './context/FarmContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { DistressAlertModal } from './components/DistressAlertBanner';

// Pages
import { Dashboard } from './pages/Dashboard';
import { PlotsManagement } from './pages/PlotsManagement';
import { CropPlanner } from './pages/CropPlanner';
import { PestDoctor } from './pages/PestDoctor';
import { SoilDoctor } from './pages/SoilDoctor';
import { MandiPrices } from './pages/MandiPrices';
import { SchemesCredit } from './pages/SchemesCredit';
import { PostHarvest } from './pages/PostHarvest';
import { Assistant } from './pages/Assistant';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <FarmProvider>
          <Router>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
              {/* Sticky Top Navigation */}
              <Navbar />

              {/* Main App Container */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/plots" element={<PlotsManagement />} />
                  <Route path="/crop-planner" element={<CropPlanner />} />
                  <Route path="/pest-doctor" element={<PestDoctor />} />
                  <Route path="/soil-fertility" element={<SoilDoctor />} />
                  <Route path="/mandi-prices" element={<MandiPrices />} />
                  <Route path="/schemes-credit" element={<SchemesCredit />} />
                  <Route path="/post-harvest" element={<PostHarvest />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global Distress Alert Lifeline Modal */}
              <DistressAlertModal />

              {/* Footer */}
              <footer className="border-t border-slate-900 bg-slate-950/80 mt-auto py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500 space-y-2 sm:space-y-0">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <span>
                      <strong className="text-slate-400">Tele-MANAS:</strong> 14416 (24/7 Free Emotional Lifeline)
                    </span>
                    <span>
                      <strong className="text-slate-400">Kisan Call Centre:</strong> 1800-180-1551
                    </span>
                  </div>
                  <div>
                    &copy; 2026 KisanSeva AI • Climate-Resilient Smallholder Agronomy Engine
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </FarmProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;

