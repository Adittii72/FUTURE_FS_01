import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import ManageSkillModal from '../components/admin/ManageSkillModal';

const Skills = () => {
  const { isLoggedIn } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Sample data for styling preview
      setSkills([
        { _id: '1', name: 'React', percent: 95 },
        { _id: '2', name: 'Node.js', percent: 90 },
        { _id: '3', name: 'TypeScript', percent: 85 },
        { _id: '4', name: 'Tailwind CSS', percent: 92 },
        { _id: '5', name: 'MongoDB', percent: 80 },
        { _id: '6', name: 'Express.js', percent: 88 },
        { _id: '7', name: 'Next.js', percent: 87 },
        { _id: '8', name: 'GraphQL', percent: 75 },
        { _id: '9', name: 'Docker', percent: 70 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
      }
    }
  };

  const handleUpdate = () => {
    fetchSkills();
    setIsModalOpen(false);
    setEditingSkill(null);
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
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Skills</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {skills.map((skill) => (
            <Card key={skill._id} className="relative">
              {isLoggedIn && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    aria-label="Edit skill"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    aria-label="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{skill.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Proficiency</span>
                    <span>{skill.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${skill.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No skills added yet.</p>
          </div>
        )}
      </div>

      <ManageSkillModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        onUpdate={handleUpdate}
        skill={editingSkill}
      />
    </section>
  );
};

export default Skills;

