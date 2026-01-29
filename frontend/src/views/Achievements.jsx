import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Award, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Card from '../components/Card.jsx';
import ManageAchievementModal from '../components/admin/ManageAchievementModal.jsx';
import UploadAchievementImageModal from '../components/admin/UploadAchievementImageModal.jsx'; // <-- ADDED
import { getMediaUrl } from '../utils/mediaUrl.js';

const Achievements = () => {
  const { isLoggedIn } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadAchievementId, setUploadAchievementId] = useState(null);


  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      setAchievements(res.data.achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };


  const handleOpenUpload = (id) => {
    setUploadAchievementId(id);
    setIsUploadModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await api.delete(`/achievements/${id}`);
        fetchAchievements();
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Failed to delete achievement');
      }
    }
  };

  const handleUpdate = () => {
    fetchAchievements();
    setIsModalOpen(false);
    setEditingAchievement(null);
  };


  const handleImageUploaded = () => {
    fetchAchievements();
    setIsUploadModalOpen(false);
    setUploadAchievementId(null);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Achievements</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          )}
        </div>

        {/* --- UPDATED GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="relative">
              {isLoggedIn && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    aria-label="Edit achievement"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  {/* --- ADDED UPLOAD BUTTON --- */}
                  <button
                    onClick={() => handleOpenUpload(achievement.id)}
                    className="p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    aria-label="Upload image"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    aria-label="Delete achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
              
              {/* --- UPDATED CARD CONTENT --- */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                  {achievement.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                  {/* --- ADDED IMAGE DISPLAY --- */}
                  {achievement.imageUrl && (
                    <a 
                      href={getMediaUrl(achievement.imageUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-4"
                    >
                      <img 
                        src={getMediaUrl(achievement.imageUrl)} 
                        alt="Certificate" 
                        className="rounded-lg w-full h-auto max-w-xs border dark:border-gray-700"
                      />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* --- END UPDATED GRID --- */}


        {achievements.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No achievements added yet.</p>
          </div>
        )}
      </div>

      <ManageAchievementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAchievement(null);
        }}
        onUpdate={handleUpdate}
        achievement={editingAchievement}
      />

      {/* --- ADDED NEW MODAL --- */}
      <UploadAchievementImageModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadAchievementId(null);
        }}
        onUpload={handleImageUploaded}
        achievementId={uploadAchievementId}
      />
    </section>
  );
};

export default Achievements;