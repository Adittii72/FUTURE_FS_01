import { useState, useEffect } from 'react';
import { Home, Code, Briefcase, Award, Mail, Download, Linkedin, Github, LogOut, User, GraduationCap, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Sidebar = () => {
  const { isLoggedIn, authReady, logout } = useAuth();
  const canManage = authReady && isLoggedIn;
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('about');
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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'education', 'skills', 'projects', 'experience', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('Resume not available yet');
    }
  };

  const navItems = [
    { id: 'about', icon: Home, label: 'Home' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'experience', icon: Building2, label: 'Experience' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'resume', icon: Download, label: 'Resume', isAction: true },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="glass-card p-4 rounded-3xl space-y-6">
        {/* Navigation Icons */}
        <nav className="space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            // Handle resume download action
            if (item.isAction && item.id === 'resume') {
              return (
                <button
                  key={item.id}
                  onClick={handleDownloadResume}
                  className="group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-dark-tertiary hover:bg-dark-secondary"
                  title={item.label}
                >
                  <Icon className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                  
                  {/* Tooltip */}
                  <span className="absolute left-full ml-4 px-3 py-2 bg-dark-secondary rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </span>
                </button>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-primary to-blue-500 shadow-glow-cyan'
                    : 'bg-dark-tertiary hover:bg-dark-secondary'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-primary'}`} />
                
                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-2 bg-dark-secondary rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gray-700"></div>

        {/* Social Links */}
        <div className="space-y-4">
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 rounded-xl bg-dark-tertiary hover:bg-dark-secondary flex items-center justify-center transition-all"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            </a>
          )}
          
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="group w-12 h-12 rounded-xl bg-dark-tertiary hover:bg-dark-secondary flex items-center justify-center transition-all"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            </a>
          )}
        </div>

        {/* Admin Actions */}
        {canManage && (
          <>
            <div className="h-px bg-gray-700"></div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group w-12 h-12 rounded-xl bg-dark-tertiary hover:bg-dark-secondary flex items-center justify-center transition-all"
                title="Dashboard"
              >
                <User className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </button>
              
              <button
                onClick={logout}
                className="group w-12 h-12 rounded-xl bg-dark-tertiary hover:bg-red-500 flex items-center justify-center transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-text-secondary group-hover:text-white transition-colors" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
