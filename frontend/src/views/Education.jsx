import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import ManageEducationModal from '../components/admin/ManageEducationModal';

const Education = () => {
  const { isLoggedIn } = useAuth();
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await api.get('/education');
      setEducation(res.data.education);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await api.delete(`/education/${id}`);
        fetchEducation();
      } catch (error) {
        console.error('Error deleting education:', error);
        alert('Failed to delete education');
      }
    }
  };

  const handleUpdate = () => {
    fetchEducation();
    setIsModalOpen(false);
    setEditingEducation(null);
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
    <section className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Education</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          )}
        </div>

        {education.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00d4ff] via-[#0099ff] to-transparent hidden md:block"></div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={edu.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-8 w-4 h-4 bg-[#00d4ff] rounded-full border-4 border-dark-primary shadow-glow-cyan hidden md:block transform -translate-x-1.5"></div>

                  {/* Content card */}
                  <Card className="md:ml-20 group hover:shadow-glow-cyan transition-all duration-300">
                    <div className="relative">
                      {isLoggedIn && (
                        <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(edu)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            aria-label="Edit education"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(edu.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            aria-label="Delete education"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#00d4ff] to-[#0099ff] rounded-lg flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                            {edu.degree}
                          </h3>
                          <p className="text-lg text-[#00d4ff] font-semibold mb-2">
                            {edu.institution}
                          </p>
                          {edu.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              📍 {edu.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                            {formatDate(edu.startDate)} - {edu.isPresent ? 'Present' : formatDate(edu.endDate)}
                          </p>
                          {edu.description && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No education entries added yet.</p>
          </div>
        )}
      </div>

      <ManageEducationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEducation(null);
        }}
        onUpdate={handleUpdate}
        education={editingEducation}
      />
    </section>
  );
};

export default Education;
