import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import ManageExperienceModal from '../components/admin/ManageExperienceModal';

const Experience = () => {
  const { isLoggedIn } = useAuth();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await api.get('/experience');
      setExperience(res.data.experience);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await api.delete(`/experience/${id}`);
        fetchExperience();
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Failed to delete experience');
      }
    }
  };

  const handleUpdate = () => {
    fetchExperience();
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (month) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Experience</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          )}
        </div>

        {experience.length > 0 ? (
          <div className="space-y-6">
            {experience.map((exp) => (
              <Card key={exp.id} className="group hover:shadow-glow-cyan transition-all duration-300">
                <div className="relative">
                  {isLoggedIn && (
                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        aria-label="Edit experience"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        aria-label="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#00d4ff] to-[#0099ff] rounded-lg flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-[#00d4ff] font-semibold mb-2">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          📍 {exp.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                        {formatDate(exp.startDate)} - {exp.isPresent ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No experience entries added yet.</p>
          </div>
        )}
      </div>

      <ManageExperienceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExperience(null);
        }}
        onUpdate={handleUpdate}
        experience={editingExperience}
      />
    </section>
  );
};

export default Experience;
