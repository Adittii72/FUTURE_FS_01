import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Textarea from '../Textarea';
import Button from '../Button';

const ManageExperienceModal = ({ isOpen, onClose, onUpdate, experience }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    isPresent: false,
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || '',
        company: experience.company || '',
        location: experience.location || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        description: experience.description || '',
        isPresent: experience.isPresent || false,
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false,
      });
    }
  }, [experience, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (experience) {
        await api.put(`/experience/${experience.id}`, formData);
      } else {
        await api.post('/experience', formData);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={experience ? 'Edit Experience' : 'Add New Experience'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title / Position"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Software Engineer"
        />

        <Input
          label="Company / Organization"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          placeholder="Google"
        />

        <Input
          label="Location (Optional)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Mountain View, CA"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="month"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <Input
            label="End Date"
            name="endDate"
            type="month"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.isPresent}
            required={!formData.isPresent}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPresent"
            name="isPresent"
            checked={formData.isPresent}
            onChange={handleChange}
            className="w-4 h-4 text-[#00d4ff] bg-gray-100 border-gray-300 rounded focus:ring-[#00d4ff] dark:focus:ring-[#00d4ff] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isPresent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Currently working here
          </label>
        </div>

        <Textarea
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Key responsibilities, achievements, technologies used, etc."
          rows={5}
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

export default ManageExperienceModal;
