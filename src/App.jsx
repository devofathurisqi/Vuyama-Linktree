import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicPage from './pages/PublicPage';
import AdminPage from './pages/AdminPage';
import CompanyProfilePage from './pages/CompanyProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/profile" element={<CompanyProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
