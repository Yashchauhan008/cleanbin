import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ReportDustbin from './pages/ReportDustbin';

function App() {
  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/home' element={<HomePage/>}/>
    <Route path='/bin/:DustbinId' element={<ReportDustbin/>}/>  
  </Routes>
  </BrowserRouter>
  </>
  );
}

export default App;
