import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import CaseStudyPage from './pages/CaseStudyPage';
import InTheWildPage from './pages/InTheWildPage';

// Graybox prototype — three.js loads only when the route is visited.
const EcospacePage = lazy(() => import('./ecospace/EcospacePage'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/work/:slug" element={<CaseStudyPage />} />
      <Route path="/in-the-wild" element={<InTheWildPage />} />
      <Route
        path="/ecospace"
        element={
          <Suspense fallback={null}>
            <EcospacePage />
          </Suspense>
        }
      />
    </Routes>
  );
}
