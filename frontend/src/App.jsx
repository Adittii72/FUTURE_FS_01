import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import LoadingBar from './components/LoadingBar';
import Home from './views/Home';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ProjectCategory from './views/ProjectCategory';
import { wakeUpBackend, prefetchCriticalData } from './utils/backendWakeup';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  // Wake up backend on app load
  useEffect(() => {
    const initBackend = async () => {
      await wakeUpBackend();
      // Prefetch critical data after backend is awake
      await prefetchCriticalData();
      setInitialLoading(false);
    };
    initBackend();
  }, []);

  return (
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <LoadingBar isLoading={initialLoading} />
          <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <>
                    <Sidebar />
                    <MobileNav />
                    <Routes>
                      {/* Single-page app: all sections rendered on home route */}
                      <Route path="/" element={<Home />} />
                      <Route
                        path="/projects"
                        element={
                          <Navigate
                            to="/"
                            replace
                            state={{ scrollTo: 'projects' }}
                          />
                        }
                      />
                      <Route path="/projects/:category" element={<ProjectCategory />} />
                      <Route
                        path="/dashboard"
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LoadingProvider>
  </ThemeProvider>
  );
}

export default App;