import { Link } from 'react-router-dom';
import { Moon, Sun, Download, Linkedin, Github, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useState, useEffect } from 'react';
import Button from './Button';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const [resumeUrl, setResumeUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Resume
    api.get('/resume')
      .then(res => {
        setResumeUrl(res?.data?.resume?.fileUrl || '');
      })
      .catch(() => setResumeUrl(''));

    // About (FIXED RESPONSE HANDLING)
    api.get('/about')
      .then(res => {
        const about = res?.data?.about ?? res?.data;
        setSocialLinks({
          linkedin: about?.linkedin || '',
          github: about?.github || '',
        });
      })
      .catch(() => {
        setSocialLinks({
          linkedin: '',
          github: '',
        });
      });
  }, []);

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'about', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold gradient-text" onClick={() => scrollToSection('about')}>
            Portfolio
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer">
                <Github className="w-5 h-5" />
              </a>
            )}

            {resumeUrl && (
              <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                <Download className="w-4 h-4" /> Resume
              </Button>
            )}

            <button onClick={toggleTheme}>
              {isDark ? <Sun /> : <Moon />}
            </button>

            {isLoggedIn && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={logout}>
                  <LogOut />
                </button>
              </>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  scrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
