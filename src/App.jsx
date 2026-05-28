import { Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import CaseStudyPage from './pages/CaseStudyPage';
import InTheWildPage from './pages/InTheWildPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/work/:slug" element={<CaseStudyPage />} />
      <Route path="/in-the-wild" element={<InTheWildPage />} />
    </Routes>
  );
}
