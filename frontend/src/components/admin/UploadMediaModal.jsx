import { useState } from 'react';
import { Upload } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';
import Button from '../Button';

const UploadMediaModal = ({ isOpen, onClose, onUpload, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !projectId) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('mediaFile', file);

      await api.post(`/projects/upload/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload();
    } catch (error) {
      console.error('Error uploading media:', error);
      setError(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Project Media" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Image or Video
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file ? file.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, GIF, MP4, WEBM up to 50MB
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadMediaModal;

