import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import WhiteLightGuide from './pages/WhiteLightGuide';
import CoveComparisonPage from './pages/CoveComparisonPage';
import NotFound from './pages/NotFound';
import { findPage, siteName } from './site';

// Older links used a "#compare" hash on the single-page guide; send them to the new route.
const legacyHashRoutes = { '#compare': '/cove-comparison' };

function App() {
  const location = useLocation();

  useEffect(() => {
    const page = findPage(location.pathname);
    document.title = page ? `${page.title} · ${siteName}` : location.pathname === '/' ? siteName : `Not found · ${siteName}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const legacyTarget = legacyHashRoutes[location.hash];
  if (legacyTarget && location.pathname !== legacyTarget) {
    return <Navigate to={legacyTarget} replace />;
  }

  return (
    <div className="min-h-screen bg-acclaim-fog flex flex-col">
      <SiteNav />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/white-light-guide" element={<WhiteLightGuide />} />
          <Route path="/cove-comparison" element={<CoveComparisonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  );
}

export default App;
