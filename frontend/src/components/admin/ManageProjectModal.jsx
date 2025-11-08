import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Textarea from '../Textarea';
import Button from '../Button';

const ManageProjectModal = ({ isOpen, onClose, onUpdate, project }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || '',
        githubUrl: project.githubUrl || '',
      });
    } else {
      setFormData({ title: '', description: '', techStack: '', githubUrl: '' });
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
      const payload = {
        ...formData,
        // techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
      };

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

