// src/App.jsx
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NegotiationPage from './pages/NegotiationPage';
import VerdictPage from './pages/VerdictPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import { ThemeProvider } from './ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen min-w-screen bg-gray-900 text-gray-200">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/negotiation/:negotiationId" element={<NegotiationPage />} />
                <Route path="/verdict/:negotiationId" element={<VerdictPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
