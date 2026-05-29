import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Github, Upload, ArrowRight, Brain, BarChart3, Code2 } from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';
import Card from '/src/components/Card.jsx';
import ManageProjectModal from '/src/components/admin/ManageProjectModal.jsx';
import UploadMediaModal from '/src/components/admin/UploadMediaModal.jsx';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getMediaUrl } from '/src/utils/mediaUrl.js';

const Projects = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingProjectId, setUploadingProjectId] = useState(null);

  const categories = [
    {
      name: 'AI Engineer',
      icon: Brain,
      description: 'Building intelligent systems with cutting-edge AI technologies',
      gradient: 'from-[#00d4ff] to-[#0099ff]',
    },
    {
      name: 'Data Science Enthusiast',
      icon: BarChart3,
      description: 'Extracting insights and patterns from complex datasets',
      gradient: 'from-[#7c3aed] to-[#a855f7]',
    },
    {
      name: 'Full-Stack Developer',
      icon: Code2,
      description: 'Creating end-to-end web applications with modern technologies',
      gradient: 'from-[#00d4ff] to-[#7c3aed]',
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleUploadMedia = (projectId) => {
    setUploadingProjectId(projectId);
    setIsUploadModalOpen(true);
  };

  const handleUpdate = () => {
    fetchProjects();
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleMediaUploaded = () => {
    fetchProjects();
    setIsUploadModalOpen(false);
    setUploadingProjectId(null);
  };

  const handleViewCategory = (categoryName) => {
    navigate(`/projects/${encodeURIComponent(categoryName)}`);
  };

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category || 'Full-Stack Developer';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {});

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">My Projects</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore my work across AI, Data Science, and Full-Stack Development
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            const categoryProjects = groupedProjects[category.name] || [];
            const projectCount = categoryProjects.length;

            return (
              <Card
                key={category.name}
                className="relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => projectCount > 0 && handleViewCategory(category.name)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative p-6 space-y-4">
                  {/* Icon and Arrow */}
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                      <CategoryIcon className="w-7 h-7 text-white" />
                    </div>
                    {projectCount > 0 && (
                      <button
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099ff] flex items-center justify-center shadow-lg hover:shadow-xl transition-all group-hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCategory(category.name);
                        }}
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Category Info */}
                  <div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${category.gradient} text-white`}>
                        {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>
                  </div>

                  {/* Preview Images (if projects exist) */}
                  {projectCount > 0 && (
                    <div className="flex -space-x-2 overflow-hidden pt-2">
                      {categoryProjects.slice(0, 3).map((project, idx) => (
                        <div
                          key={project.id}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold"
                          style={{ zIndex: 3 - idx }}
                        >
                          {project.title.charAt(0)}
                        </div>
                      ))}
                      {projectCount > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">
                          +{projectCount - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* All Projects Section (Optional - for admin) */}
        {isLoggedIn && projects.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">All Projects (Admin View)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUploadMedia(project.id)}
                      className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      {project.videoUrl ? (
                        <video
                          src={getMediaUrl(project.videoUrl)}
                          className="w-full h-full object-cover"
                          controls
                          muted
                        />
                      ) : project.images && project.images.length > 0 ? (
                        <Carousel
                          showThumbs={false}
                          showStatus={false}
                          infiniteLoop
                          autoPlay
                          interval={3500}
                          className="h-full"
                        >
                          {project.images.map((image) => (
                            <div key={image.id} className="h-48">
                              <img
                                src={getMediaUrl(image.imageUrl)}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-500">No media</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded text-xs font-medium">
                          {project.category || 'Full-Stack Developer'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No projects added yet.</p>
          </div>
        )}
      </div>

      <ManageProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onUpdate={handleUpdate}
        project={editingProject}
      />

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadingProjectId(null);
        }}
        onUpload={handleMediaUploaded}
        projectId={uploadingProjectId}
      />
    </section>
  );
};

export default Projects;
