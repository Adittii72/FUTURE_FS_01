import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Download, Linkedin, Github, LogOut, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/resume')
      .then(res => setResumeUrl(res.data.resume.fileUrl))
      .catch(() => {
        setResumeUrl('https://example.com/resume.pdf');
      });

    api.get('/about')
      .then(res => {
        setSocialLinks({
          linkedin: res.data.about.linkedin || '',
          github: res.data.about.github || ''
        });
      })
      .catch(() => {
        setSocialLinks({
          linkedin: 'https://www.linkedin.com/in/aditi-shrimankar-163848356/',
          github: 'https://github.com/Adittii72/offline-AI-assistant'
        });
      });
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
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/" className="text-xl md:text-2xl font-bold gradient-text">
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

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Social Links - Hidden on small screens */}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                className="hidden lg:flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden xl:inline">Resume</span>
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
                <Link to="/dashboard" className="hidden sm:block">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 pt-2">
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
                {resumeUrl && (
                  <button
                    onClick={() => {
                      handleDownloadResume();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </button>
                )}
                {isLoggedIn && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

