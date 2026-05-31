import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Edit, Upload, Trash2, Plus } from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';
import api from '/src/services/api.js';
import Card from '/src/components/Card.jsx';
import ManageProjectModal from '/src/components/admin/ManageProjectModal.jsx';
import UploadMediaModal from '/src/components/admin/UploadMediaModal.jsx';
import { getMediaUrl } from '/src/utils/mediaUrl.js';
import { normalizeProjectCategory } from '/src/constants/projectCategories.js';

const ProjectMediaCarousel = lazy(() => import('/src/components/ProjectMediaCarousel.jsx'));

const ProjectCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingProjectId, setUploadingProjectId] = useState(null);

  const decodedCategory = decodeURIComponent(category);

  useEffect(() => {
    fetchProjects();
  }, [category]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      const filtered = (res.data.projects || []).filter(
        (p) => normalizeProjectCategory(p.category) === decodedCategory
      );
      setProjects(filtered);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center lg:pl-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-8 sm:py-12 md:py-16 lg:pl-32">
      <div className="container mx-auto px-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#00d4ff] hover:text-[#0099ff] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{decodedCategory}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} in this category
            </p>
          </div>
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="neon-button flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden relative">
              {isLoggedIn && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
                    aria-label="Edit project"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleUploadMedia(project.id)}
                    className="p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
                    aria-label="Upload media"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
              <div className="space-y-4">
                <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {project.videoUrl ? (
                    <video
                      key={project.videoUrl}
                      src={getMediaUrl(project.videoUrl)}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      loop
                      autoPlay
                    />
                  ) : project.images && project.images.length > 0 ? (
                    <Suspense
                      fallback={
                        <div className="h-full w-full animate-pulse bg-[#252b4a]" />
                      }
                    >
                      <ProjectMediaCarousel
                        images={project.images}
                        title={project.title}
                      />
                    </Suspense>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500">No media</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold">{project.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.split(',').map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full text-sm font-medium"
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
                      className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#0099ff] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No projects in this category yet.
            </p>
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="neon-button inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add first project
              </button>
            )}
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
        defaultCategory={decodedCategory}
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

export default ProjectCategory;
