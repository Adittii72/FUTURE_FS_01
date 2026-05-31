import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { BACKEND_URL } from '../config/backend';

const DEFAULT_ABOUT = {
  name: 'Aditi Shrimankar',
  headline: 'Full Stack Developer | AI Engineer | Data Science Enthusiast',
  bio: 'Computer Science student with hands-on experience in AI, Machine Learning, Data Science, and Full-Stack Development.',
  coverImageUrl: '',
  profileImageUrl: '',
  linkedin: '',
  github: '',
};

const PortfolioDataContext = createContext(null);

export const PortfolioDataProvider = ({ children }) => {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [resumeUrl, setResumeUrl] = useState('');
  const [ready, setReady] = useState(false);

  const applyBootstrap = useCallback((data) => {
    if (data?.about) setAbout((prev) => ({ ...prev, ...data.about }));
    if (data?.resume?.fileUrl) setResumeUrl(data.resume.fileUrl);
  }, []);

  const refreshAbout = useCallback(async () => {
    try {
      const res = await api.get('/about');
      if (res.data?.about) setAbout((prev) => ({ ...prev, ...res.data.about }));
    } catch (error) {
      console.error('Error refreshing about:', error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await api.get('/public/bootstrap');
        if (!cancelled) applyBootstrap(res.data);
      } catch (error) {
        console.error('Error loading portfolio bootstrap:', error);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    load();

    // Wake Render instance in background (do not block UI)
    fetch(`${BACKEND_URL}/health`, { method: 'GET' }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [applyBootstrap]);

  useEffect(() => {
    const imageUrl = about.profileImageUrl || about.coverImageUrl;
    if (!imageUrl) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
    return () => link.remove();
  }, [about.profileImageUrl, about.coverImageUrl]);

  return (
    <PortfolioDataContext.Provider
      value={{ about, setAbout, resumeUrl, ready, refreshAbout }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within PortfolioDataProvider');
  }
  return ctx;
};
