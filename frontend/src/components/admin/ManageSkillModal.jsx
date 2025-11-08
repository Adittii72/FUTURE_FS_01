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
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        percent: skill.percent || 0,
      });
    } else {
      setFormData({ name: '', percent: 0 });
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

        <Input
          label="Proficiency (%)"
          name="percent"
          type="number"
          min="0"
          max="100"
          value={formData.percent}
          onChange={handleChange}
          required
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

