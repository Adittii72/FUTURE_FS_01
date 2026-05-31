import { useState } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import ManageAboutModal from '../components/admin/ManageAboutModal.jsx';

const About = () => {
  const { isLoggedIn } = useAuth();
  const { about, refreshAbout } = usePortfolioData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdate = () => {
    refreshAbout();
    setIsEditModalOpen(false);
  };

  const profileSrc = about.profileImageUrl || about.coverImageUrl;

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
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
              {about.name}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="gradient-text">{about.headline}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.bio}
            </p>
          </div>

          <div className="order-1 md:order-2 flex justify-center items-center w-full">
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto"
              aria-hidden={!profileSrc}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] to-[#0099ff] rounded-full" />
              <div
                className="relative rounded-full overflow-hidden bg-[#1a1f3a]"
                style={{
                  width: 'calc(100% - 20px)',
                  height: 'calc(100% - 20px)',
                  margin: '10px',
                }}
              >
                {profileSrc ? (
                  <img
                    src={profileSrc}
                    alt={about.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width="380"
                    height="380"
                  />
                ) : (
                  <div className="w-full h-full animate-pulse bg-[#252b4a]" />
                )}
              </div>
            </div>
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
