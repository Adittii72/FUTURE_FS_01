import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import About from './views/About';
import Skills from './views/Skills';
import Projects from './views/Projects';
import Achievements from './views/Achievements';
import Contact from './views/Contact';
import Login from './views/Login';
import Dashboard from './views/Dashboard';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<About />} />
                      <Route path="/skills" element={<Skills />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/contact" element={<Contact />} />
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

