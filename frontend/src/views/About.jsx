import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import ManageAboutModal from '../components/admin/ManageAboutModal';

const About = () => {
  const { isLoggedIn } = useAuth();
  const [about, setAbout] = useState({
    headline: 'Full Stack Developer',
    bio: 'Passionate developer creating amazing web experiences.',
    coverImageUrl: '',
    linkedin: '',
    github: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await api.get('/about');
      setAbout(res.data.about);
    } catch (error) {
      console.error('Error fetching about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchAbout();
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        {isLoggedIn && (
          <div className="flex justify-end mb-4 md:mb-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit About</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="space-y-4 md:space-y-6 animate-fade-in order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">{about.headline}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.bio}
            </p>
          </div>
          {about.coverImageUrl && (
            <div className="animate-fade-in order-1 md:order-2">
              <img
                src={about.coverImageUrl}
                alt="Profile"
                className="w-full h-auto rounded-xl md:rounded-2xl shadow-2xl object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <ManageAboutModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
        initialData={about}
      />
    </section>
  );
};

export default About;

