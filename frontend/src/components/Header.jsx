import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Download, Linkedin, Github, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useState, useEffect } from 'react';
import Button from './Button';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [resumeUrl, setResumeUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '' });

  useEffect(() => {
    // Fetch resume URL
    api.get('/resume')
      .then(res => setResumeUrl(res.data.fileUrl))
      .catch(() => {});

    // Fetch social links from about
    api.get('/about')
      .then(res => {
        setSocialLinks({
          linkedin: res.data.linkedin || '',
          github: res.data.github || ''
        });
      })
      .catch(() => {});
  }, []);

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/achievements', label: 'Achievements' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Portfolio
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Social Links */}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}

            {/* Resume Download */}
            {resumeUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                className="hidden sm:flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Resume
              </Button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin Logout */}
            {isLoggedIn && (
              <>
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">Dashboard</Button>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

