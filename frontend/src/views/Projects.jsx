import { useState, useEffect, lazy, Suspense } from 'react';
import { Edit, Plus, Trash2, Github, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';
import api from '/src/services/api.js';
import Card from '/src/components/Card.jsx';
import ManageProjectModal from '/src/components/admin/ManageProjectModal.jsx';
import UploadMediaModal from '/src/components/admin/UploadMediaModal.jsx';
import { getMediaUrl } from '/src/utils/mediaUrl.js';

const ProjectMediaCarousel = lazy(() => import('/src/components/ProjectMediaCarousel.jsx'));
import {
  PROJECT_CATEGORIES,
  normalizeProjectCategory,
} from '/src/constants/projectCategories.js';

const Projects = () => {
  const { isLoggedIn, authReady } = useAuth();
  const canManage = authReady && isLoggedIn;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('categories');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingProjectId, setUploadingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedProjects = projects.reduce((acc, project) => {
    const category = normalizeProjectCategory(project.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {});

  const categoryProjects = activeCategory
    ? groupedProjects[activeCategory] || []
    : [];

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
        if (error.response?.status === 401) {
          alert('Session expired. Please sign in again.');
        } else {
          alert(error.response?.data?.message || 'Failed to delete project');
        }
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
    setActiveCategory(categoryName);
    setView('list');
  };

  const handleBackToCategories = () => {
    setView('categories');
    setActiveCategory(null);
  };

  const renderProjectCard = (project) => (
    <Card key={project.id} className="overflow-hidden relative">
      {canManage && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={() => handleEdit(project)}
            className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
            aria-label="Edit project"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleUploadMedia(project.id)}
            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
            aria-label="Upload media"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(project.id)}
            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
            aria-label="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
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
            <Suspense
              fallback={
                <div className="h-full w-full animate-pulse bg-[#252b4a]" />
              }
            >
              <ProjectMediaCarousel images={project.images} title={project.title} />
            </Suspense>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-500">No media</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <span className="inline-block px-2 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded text-xs font-medium">
            {normalizeProjectCategory(project.category)}
          </span>
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.split(',').map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#00d4ff]/10 text-[#00d4ff] rounded-full text-xs"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#0099ff] text-sm"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <section className="min-h-[50vh] py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-[#252b4a] rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#252b4a] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">My Projects</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {view === 'categories'
                ? 'Explore my work across AI, Data Science, and Full-Stack Development'
                : `${activeCategory} — ${categoryProjects.length} ${categoryProjects.length === 1 ? 'project' : 'projects'}`}
            </p>
          </div>
          {canManage && (
            <button
              onClick={handleCreate}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        {view === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PROJECT_CATEGORIES.map((category) => {
              const CategoryIcon = category.icon;
              const items = groupedProjects[category.name] || [];
              const projectCount = items.length;

              return (
                <Card
                  key={category.name}
                  className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  onClick={() => handleViewCategory(category.name)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <CategoryIcon className="w-7 h-7 text-white" />
                      </div>
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099ff] flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCategory(category.name);
                        }}
                        aria-label={`View ${category.name} projects`}
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {category.description}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${category.gradient} text-white`}
                      >
                        {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>
                    {projectCount > 0 && (
                      <div className="flex -space-x-2 overflow-hidden pt-2">
                        {items.slice(0, 3).map((project, idx) => (
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
        )}

        {view === 'list' && activeCategory && (
          <>
            <button
              type="button"
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-[#00d4ff] hover:text-[#0099ff] mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to categories</span>
            </button>

            {categoryProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProjects.map(renderProjectCard)}
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No projects in {activeCategory} yet.
                </p>
                {canManage && (
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="neon-button inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add first project
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {canManage && projects.length > 0 && view === 'categories' && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">All Projects (Admin)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(renderProjectCard)}
            </div>
          </div>
        )}

        {projects.length === 0 && view === 'categories' && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Pick a category above to get started, or add your first project.
            </p>
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
        defaultCategory={activeCategory}
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
