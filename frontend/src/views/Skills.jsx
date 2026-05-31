import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Code, Palette, Server, Database, Wrench, Brain } from 'lucide-react';
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
      setSkills(res.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
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
      <section className="py-8 sm:py-12 md:py-16 min-h-[40vh]">
        <div className="container mx-auto px-4">
          <div className="h-10 w-32 bg-[#252b4a] rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[#252b4a] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    let category = skill.category || 'Languages';
    // Map old "Featured" category to "Languages" for backward compatibility
    if (category === 'Featured') {
      category = 'Languages';
    }
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills).sort();

  // Category icons mapping
  const categoryIcons = {
    'Languages': Code,
    'Frontend': Palette,
    'Backend': Server,
    'Database': Database,
    'Tools': Wrench,
    'AI & Data Science': Brain,
  };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Skills</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        {categories.map((category) => {
          const CategoryIcon = categoryIcons[category] || Brain;
          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryIcon className="w-6 h-6 text-[#00d4ff]" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {category}
                </h3>
              </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {groupedSkills[category].map((skill) => (
                <Card key={skill.id} className="relative group hover:scale-105 transition-transform">
                  {isLoggedIn && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        aria-label="Edit skill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        aria-label="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center p-4 space-y-3">
                    {skill.icon ? (
                      skill.icon.trim().startsWith('<svg') ? (
                        // Handle inline SVG code
                        <div 
                          className="w-12 h-12 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: skill.icon }}
                        />
                      ) : (
                        // Handle URL-based icons
                        <img 
                          src={skill.icon} 
                          alt={skill.name}
                          className="w-12 h-12 object-contain"
                          loading="lazy"
                          decoding="async"
                          width="48"
                          height="48"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error(`Failed to load icon for ${skill.name}:`, skill.icon);
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      )
                    ) : null}
                    <div 
                      className="w-12 h-12 bg-gradient-to-br from-[#1a1f3a] to-[#252b4a] border border-[#00d4ff]/30 rounded-lg flex items-center justify-center text-[#00d4ff] font-bold text-xl shadow-lg"
                      style={{ display: skill.icon ? 'none' : 'flex' }}
                    >
                      {skill.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-center">{skill.name}</span>
                    {skill.percent > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-[#00d4ff] to-[#0099ff] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.percent}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        })}

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

