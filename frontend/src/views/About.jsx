import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Card from '../components/Card.jsx';
import ManageAboutModal from '../components/admin/ManageAboutModal.jsx';

const About = () => {
  const { isLoggedIn } = useAuth();
  const [about, setAbout] = useState({
    name: 'Aditi Shrimankar',
    headline: 'Full Stack Developer | AI Engineer | Data Science Enthusiast',
    bio: 'Computer Science student with hands-on experience in AI, Machine Learning, Data Science, and Full-Stack Development.',
    coverImageUrl: '',
    profileImageUrl: '',
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
    // Show skeleton/placeholder instead of spinner
    return null;
  }

  return (
    <section className="h-screen flex flex-col relative overflow-hidden">
      <div className="container mx-auto px-4 h-full flex flex-col justify-center py-4">
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

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center h-full max-h-full">
          <div className="space-y-4 md:space-y-6 animate-fade-in order-2 md:order-1">
            {/* --- ADDED NAME FIELD --- */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
              {about.name}
            </h1>
            {/* --- HEADLINE --- */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="gradient-text">{about.headline}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.bio}
            </p>
          </div>
          <div className="animate-fade-in order-1 md:order-2 flex justify-center items-center w-full">
            {about.profileImageUrl ? (
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] to-[#0099ff] rounded-full opacity-100"></div>
                <div className="relative opacity-100 rounded-full overflow-hidden" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', margin: '10px' }}>
                  <img
                    src={about.profileImageUrl}
                    alt={about.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    width="380"
                    height="380"
                  />
                </div>
              </div>
            ) : about.coverImageUrl ? (
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] to-[#0099ff] rounded-full opacity-100"></div>
                <div className="relative opacity-100 rounded-full overflow-hidden" style={{ width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', margin: '10px' }}>
                  <img
                    src={about.coverImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    width="380"
                    height="380"
                  />
                </div>
              </div>
            ) : null}
          </div>
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