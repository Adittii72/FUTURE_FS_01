import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Home from './views/Home';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ProjectCategory from './views/ProjectCategory';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioDataProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <>
                      <Sidebar />
                      <MobileNav />
                      <Routes>
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
        </PortfolioDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
