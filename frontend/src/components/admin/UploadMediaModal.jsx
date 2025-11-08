import { useState, useEffect } from 'react';
import { Upload, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';
import Button from '../Button';

const UploadMediaModal = ({ isOpen, onClose, onUpload, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // Changed to handle multiple files
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');

  // Fetch existing images when the modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      api.get(`/projects/${projectId}`)
        .then(res => {
          setExistingImages(res.data.project.images || []);
        })
        .catch(err => {
          console.error("Error fetching project images:", err);
          setError("Failed to load existing images.");
        });
    } else {
      // Clear state when closed
      setFiles([]);
      setExistingImages([]);
      setError('');
    }
  }, [isOpen, projectId]);

  // ... (inside UploadMediaModal.jsx)

  const isVideoFile = (file) => file.type.startsWith('video/');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // --- NEW VALIDATION LOGIC ---
    const videoCount = existingImages.filter(img => isVideoFile({ type: img.imageUrl.includes('.mp4') ? 'video/mp4' : 'image/jpeg' })).length + selectedFiles.filter(isVideoFile).length;
    
    if (videoCount > 1) {
      setError('You can only upload one video per project.');
      setFiles([]);
      return;
    }

    if (selectedFiles.some(file => file.size > 50 * 1024 * 1024)) { // 50MB limit
      setError('File size must be less than 50MB');
      return;
    }

    if (existingImages.length + selectedFiles.length > 5) {
      setError(`You can only have a maximum of 5 media items total. You selected ${selectedFiles.length}.`);
      return;
    }
    // --- END NEW VALIDATION LOGIC ---

    setFiles(selectedFiles);
    setError('');
  };

  // Handles uploading the NEW files
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !projectId) {
      setError('Please select one or more files');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      // Append all files under the same field name
      files.forEach(file => {
        formData.append('mediaFiles', file); // Must match backend route
      });

      await api.post(`/projects/upload/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload(); // This tells Projects.jsx to refetch all projects
      onClose();  // Close the modal
    } catch (error) {
      console.error('Error uploading media:', error);
      setError(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setLoading(false);
    }
  };

  // Handles deleting an EXISTING image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/projects/image/${imageId}`); // Use our new backend route
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      onUpload(); // Tell Projects.jsx to refetch
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image.");
    }
  };

  const isVideo = (url) => url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Project Media" size="md">
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* --- Section to Manage Existing Images --- */}
      {existingImages.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Media
          </label>
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map(image => (
              <div key={image.id} className="relative group">
                {isVideo(image.imageUrl) ? (
                  <video src={image.imageUrl} className="w-full h-24 object-cover rounded-lg" />
                ) : (
                  <img src={image.imageUrl} alt="Project media" className="w-full h-24 object-cover rounded-lg" />
                )}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Section to Upload New Files --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload New Images/Videos (Max 5)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="media-upload"
              multiple // Allow multiple files
            />
            <label
              htmlFor="media-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Up to 5 files, 50MB each.
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>
          <Button type="submit" variant="primary" disabled={loading || files.length === 0}>
            {loading ? 'Uploading...' : `Upload ${files.length} File(s)`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadMediaModal;