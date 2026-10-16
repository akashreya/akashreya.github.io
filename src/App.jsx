import { Routes, Route, useLocation } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import CaseStudyPage from './pages/CaseStudyPage';
import InTheWildPage from './pages/InTheWildPage';

export default function App() {
  const { pathname } = useLocation();
  // keyed on pathname so each route change remounts .route and replays route-in (portfolio.css)
  return (
    <div className="route" key={pathname}>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/in-the-wild" element={<InTheWildPage />} />
      </Routes>
    </div>
  );
}
