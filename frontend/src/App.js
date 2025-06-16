import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilerPage from './pages/ProfilerPage';
import HistoryPage from './pages/HistoryPage';

function App() {


  return (
    <BrowserRouter>
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profiler/:profiler_name" element={<ProfilerPage />} />
      <Route path="/profiler/:profiler_name/history" element={<HistoryPage />} />
    </Routes>
    </>
    </BrowserRouter>
    
  )
}

export default App
