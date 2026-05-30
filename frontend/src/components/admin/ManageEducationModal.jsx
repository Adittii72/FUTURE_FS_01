import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Textarea from '../Textarea';
import Button from '../Button';

const ManageEducationModal = ({ isOpen, onClose, onUpdate, education }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    isPresent: false,
  });

  useEffect(() => {
    if (education) {
      setFormData({
        degree: education.degree || '',
        institution: education.institution || '',
        location: education.location || '',
        startDate: education.startDate || '',
        endDate: education.endDate || '',
        description: education.description || '',
        isPresent: education.isPresent || false,
      });
    } else {
      setFormData({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isPresent: false,
      });
    }
  }, [education, isOpen]);

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
      if (education) {
        await api.put(`/education/${education.id}`, formData);
      } else {
        await api.post('/education', formData);
      }
      onUpdate();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={education ? 'Edit Education' : 'Add New Education'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Degree / Qualification"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          required
          placeholder="Bachelor of Technology in Computer Science"
        />

        <Input
          label="Institution / University"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
          placeholder="MIT"
        />

        <Input
          label="Location (Optional)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Cambridge, MA"
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
            Currently studying here
          </label>
        </div>

        <Textarea
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Key achievements, coursework, GPA, etc."
          rows={4}
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

export default ManageEducationModal;
