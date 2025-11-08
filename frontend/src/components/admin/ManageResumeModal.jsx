import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';
import Button from '../Button';

const ManageResumeModal = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resumeFile', file);

      await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resume" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Resume File
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file ? file.name : 'Click to upload'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PDF, DOC, DOCX up to 50MB
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

export default ManageResumeModal;