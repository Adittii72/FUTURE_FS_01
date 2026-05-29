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
        const fileUrl = res?.data?.resume?.fileUrl || '';
        console.log('Resume fetched:', fileUrl);
        setResumeUrl(fileUrl);
      })
      .catch((err) => {
        console.error('Error fetching resume:', err);
        setResumeUrl('');
      });

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
      console.log('Opening resume URL:', resumeUrl);
      // If it's a Supabase URL, open in new tab to view/download
      if (resumeUrl.includes('supabase')) {
        window.open(resumeUrl, '_blank');
      } else {
        // For other URLs, also open in new tab
        window.open(resumeUrl, '_blank');
      }
    } else {
      console.warn('Resume URL is empty');
      alert('Resume not available yet');
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
    <header className="sticky top-0 z-40 glass-card backdrop-blur-md border-b border-gray-700/50">
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
                className="px-3 py-2 rounded-lg transition-all hover:text-primary text-text-secondary"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}

            {resumeUrl && (
              <Button variant="outline" size="sm" onClick={handleDownloadResume} className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Resume
              </Button>
            )}

            {isLoggedIn && (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-lg transition-all hover:text-primary text-text-secondary"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg transition-all hover:text-primary"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden hover:text-primary transition-colors">
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
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-dark-tertiary hover:text-primary transition-all"
              >
                {link.label}
              </button>
            ))}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-dark-tertiary hover:text-primary transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
