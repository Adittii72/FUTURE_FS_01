import { useState, useEffect } from 'react';
import api from '/src/services/api.js';
import Modal from '/src/components/Modal.jsx';
import Input from '/src/components/Input.jsx';
import Textarea from '/src/components/Textarea.jsx';
import Button from '/src/components/Button.jsx';
import ProjectCategoryPicker from './ProjectCategoryPicker.jsx';
import {
  DEFAULT_PROJECT_CATEGORY,
  normalizeProjectCategory,
} from '/src/constants/projectCategories.js';

const ManageProjectModal = ({ isOpen, onClose, onUpdate, project, defaultCategory }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    category: DEFAULT_PROJECT_CATEGORY,
  });

  useEffect(() => {
    if (project?.id) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || '',
        githubUrl: project.githubUrl || '',
        category: normalizeProjectCategory(project.category),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        techStack: '',
        githubUrl: '',
        category: normalizeProjectCategory(defaultCategory),
      });
    }
  }, [project, isOpen, defaultCategory]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack,
        githubUrl: formData.githubUrl,
        category: normalizeProjectCategory(formData.category),
      };

      if (project?.id) {
        await api.put(`/projects/${project.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 401) {
        alert('Session expired or not signed in. You will be redirected to login.');
      } else {
        alert(message || 'Failed to save project');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project?.id ? 'Edit Project' : 'Add New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProjectCategoryPicker
          value={formData.category}
          onChange={handleCategoryChange}
        />

        <Input
          label="Project Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="My Awesome Project"
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Project description..."
        />

        <Input
          label="Tech Stack (comma-separated)"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />

        <Input
          label="GitHub URL"
          name="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/username/project"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageProjectModal;
