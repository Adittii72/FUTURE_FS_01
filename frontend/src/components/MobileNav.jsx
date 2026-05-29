import { useState, useEffect } from 'react';
import { Home, Code, Briefcase, Award, Mail, Menu, X, User, LogOut, Download, Linkedin, Github, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    // Fetch resume
    api.get('/resume')
      .then(res => {
        setResumeUrl(res?.data?.resume?.fileUrl || '');
      })
      .catch(() => setResumeUrl(''));

    // Fetch social links
    api.get('/about')
      .then(res => {
        const about = res?.data?.about ?? res?.data;
        setSocialLinks({
          linkedin: about?.linkedin || '',
          github: about?.github || '',
        });
      })
      .catch(() => {
        setSocialLinks({ linkedin: '', github: '' });
      });
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
      setIsOpen(false);
    } else {
      alert('Resume not available yet');
    }
  };

  const navItems = [
    { id: 'about', icon: Home, label: 'Home' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 shadow-glow-cyan flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 glass-card z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20 space-y-4">
          <h2 className="text-xl font-bold gradient-text mb-6">Navigation</h2>
          
          {/* Navigation Links */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Social Links & Actions */}
          <div className="h-px bg-gray-700 my-4"></div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Links</h3>
          
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
            >
              <Linkedin className="w-5 h-5 text-primary" />
              <span>LinkedIn</span>
            </a>
          )}
          
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
            >
              <Github className="w-5 h-5 text-primary" />
              <span>GitHub</span>
            </a>
          )}

          {resumeUrl && (
            <button
              onClick={handleDownloadResume}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
            >
              <Download className="w-5 h-5 text-primary" />
              <span>Resume</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5 text-primary" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-primary" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Admin Actions */}
          {isLoggedIn && (
            <>
              <div className="h-px bg-gray-700 my-4"></div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Admin</h3>
              
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-secondary transition-all text-left"
              >
                <User className="w-5 h-5 text-primary" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-tertiary hover:bg-red-500 transition-all text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
