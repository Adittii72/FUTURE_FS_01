import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Textarea from '../Textarea';
import Button from '../Button';

const ManageAchievementModal = ({ isOpen, onClose, onUpdate, achievement }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        description: achievement.description || '',
        date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ title: '', description: '', date: '' });
    }
  }, [achievement, isOpen]);

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
      if (achievement) {
        await api.put(`/achievements/${achievement._id}`, formData);
      } else {
        await api.post('/achievements', formData);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={achievement ? 'Edit Achievement' : 'Add New Achievement'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Award Name"
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Achievement description..."
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
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

export default ManageAchievementModal;

