import { useState, useEffect } from 'react';
import api from '/src/services/api.js';
import Modal from '/src/components/Modal.jsx';
import Input from '/src/components/Input.jsx';
import Textarea from '/src/components/Textarea.jsx';
import Button from '/src/components/Button.jsx';

const ManageProjectModal = ({ isOpen, onClose, onUpdate, project }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    category: 'Full-Stack Developer',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || '',
        githubUrl: project.githubUrl || '',
        category: project.category || 'Full-Stack Developer',
      });
    } else {
      setFormData({ title: '', description: '', techStack: '', githubUrl: '', category: 'Full-Stack Developer' });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Payload no longer contains 'category'
      const payload = { ...formData };

      if (project) {
        await api.put(`/projects/${project.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Add New Project'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="AI Engineer">AI Engineer</option>
            <option value="Data Science Enthusiast">Data Science Enthusiast</option>
            <option value="Full-Stack Developer">Full-Stack Developer</option>
          </select>
        </div>
        
        {/* 'category' input field REMOVED */}

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