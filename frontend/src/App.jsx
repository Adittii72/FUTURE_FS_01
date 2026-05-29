import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
    </ThemeProvider>
  );
}

export default App;