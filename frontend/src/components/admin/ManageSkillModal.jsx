import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const ManageSkillModal = ({ isOpen, onClose, onUpdate, skill }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    percent: 0,
    icon: '',
    category: 'Featured',
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        percent: skill.percent || 0,
        icon: skill.icon || '',
        category: skill.category || 'Featured',
      });
    } else {
      setFormData({ name: '', percent: 0, icon: '', category: 'Featured' });
    }
  }, [skill, isOpen]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (skill) {
        await api.put(`/skills/${skill.id}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skill ? 'Edit Skill' : 'Add New Skill'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="React"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            required
          >
            <option value="Featured">Featured</option>
            <option value="Languages">Languages</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Tools">Tools</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Icon URL (optional)"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
        />
        <p className="text-xs text-gray-500 -mt-2">Use icon URLs from devicon.dev or similar</p>

        <Input
          label="Proficiency (%) - Optional"
          name="percent"
          type="number"
          min="0"
          max="100"
          value={formData.percent}
          onChange={handleChange}
          placeholder="85"
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

export default ManageSkillModal;

