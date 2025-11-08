import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Textarea from '../Textarea';
import Button from '../Button';

const ManageAboutModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    linkedin: '',
    github: '',
    coverImageUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        headline: initialData.headline || '',
        bio: initialData.bio || '',
        linkedin: initialData.linkedin || '',
        github: initialData.github || '',
        coverImageUrl: initialData.coverImageUrl || '',
      });
    }
  }, [initialData, isOpen]);

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
      await api.put('/about', formData);
      onUpdate();
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit About Section" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          required
          placeholder="Full Stack Developer"
        />

        <Textarea
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Your bio description..."
        />

        <Input
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
        />

        <Input
          label="GitHub URL"
          name="github"
          type="url"
          value={formData.github}
          onChange={handleChange}
          placeholder="https://github.com/yourusername"
        />

        <Input
          label="Cover Image URL"
          name="coverImageUrl"
          type="url"
          value={formData.coverImageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageAboutModal;

