import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Github, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import ManageProjectModal from '../components/admin/ManageProjectModal';
import UploadMediaModal from '../components/admin/UploadMediaModal';

const Projects = () => {
  const { isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setProjects(res.data);
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

  const isVideo = (url) => {
    return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold gradient-text">Projects</h2>
          {isLoggedIn && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project._id} className="overflow-hidden">
              {isLoggedIn && (
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUploadMedia(project._id)}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {project.coverImageUrl && (
                  <div className="relative w-full h-48 overflow-hidden rounded-lg">
                    {isVideo(project.coverImageUrl) ? (
                      <video
                        src={project.coverImageUrl}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
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

