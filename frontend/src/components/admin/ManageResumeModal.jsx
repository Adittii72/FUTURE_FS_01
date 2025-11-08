import { useState } from 'react';
import api from '../../services/api';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

const ManageResumeModal = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) {
      alert('Please enter a file URL');
      return;
    }

    setLoading(true);

    try {
      await api.post('/resume', { fileUrl });
      onUpdate();
      setFileUrl('');
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('Failed to update resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Resume" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Resume File URL"
          name="fileUrl"
          type="url"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          required
          placeholder="https://example.com/resume.pdf"
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

export default ManageResumeModal;

