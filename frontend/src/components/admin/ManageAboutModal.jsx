import { useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import api from '../../services/api.js';
import Modal from '../Modal.jsx';
import Input from '../Input.jsx';
import Textarea from '../Textarea.jsx';
import Button from '../Button.jsx';

const ManageAboutModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [textLoading, setTextLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    profileImageUrl: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        headline: initialData.headline || '',
        bio: initialData.bio || '',
        profileImageUrl: initialData.profileImageUrl || '',
        linkedin: initialData.linkedin || '',
        github: initialData.github || '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setTextLoading(true);

    try {
      await api.put('/about', formData);
      onUpdate();
      onClose(); 
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about section');
    } finally {
      setTextLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  
  const handleImageUpload = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }
    setImageLoading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('coverImage', file);

      await api.post('/about/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpdate(); 
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the cover image?')) {
      return;
    }
    setDeleteLoading(true);
    setError('');

    try {
      await api.put('/about', { coverImageUrl: null });
      onUpdate(); 
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error.response?.data?.message || 'Failed to remove image');
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit About Section" size="md">
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      
      {/* --- UPDATED FILE UPLOAD SECTION --- */}
      <div className="space-y-4 border-b dark:border-gray-700 pb-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Cover Image
        </label>
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-grow">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-100 file:text-purple-700
                hover:file:bg-purple-200
                dark:file:bg-purple-900/30 dark:file:text-purple-300
                dark:hover:file:bg-purple-800/50"
              id="coverImage-upload"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleImageUpload}
            disabled={imageLoading || !file}
            className="mt-2 sm:mt-0 w-full sm:w-auto"
          >
            {imageLoading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
        {initialData?.coverImageUrl && (
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Image:</span>
              {/* --- NEW DELETE BUTTON --- */}
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleImageDelete}
                disabled={deleteLoading}
                className="flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                {deleteLoading ? 'Removing...' : 'Remove'}
              </Button>
            </div>
            <img src={initialData.coverImageUrl} alt="Current cover" className="mt-2 rounded-lg w-full max-w-xs h-auto" />
          </div>
        )}
      </div>

      {/* --- EXISTING TEXT FORM --- */}
      <form onSubmit={handleTextSubmit} className="space-y-4">
        {/* --- ADDED NAME INPUT --- */}
        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Full Name"
        />

        <Input
          label="Headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          required
          placeholder="Full Stack Developer"
        />

        <Input
          label="Profile Image URL"
          name="profileImageUrl"
          type="url"
          value={formData.profileImageUrl}
          onChange={handleChange}
          placeholder="https://example.com/profile-image.jpg"
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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={textLoading}>
            {textLoading ? 'Saving...' : 'Save Text Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageAboutModal;