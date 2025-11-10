import { useState, useRef, useEffect } from 'react';
import { Upload, Image, Video, X } from 'lucide-react';
import api from '/src/services/api.js';
import Modal from '/src/components/Modal.jsx';
import Button from '/src/components/Button.jsx';

const UploadMediaModal = ({ isOpen, onClose, onUpload, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadType, setUploadType] = useState('images'); 
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;
  const MAX_VIDEO_SIZE_MB = 50;
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;


  useEffect(() => {
    if (isOpen) {
      setError('');
      setSelectedFiles([]);
      setUploadType('images');
      
      if (fileInputRef.current) {
        fileInputRef.current.accept = 'image/*';
        fileInputRef.current.multiple = true;
        fileInputRef.current.value = null;
      }
      
    }
  }, [isOpen]);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = uploadType === 'images' ? 'image/*' : 'video/*';
      fileInputRef.current.multiple = uploadType === 'images';
      fileInputRef.current.value = null;
      setSelectedFiles([]);
    }
  }, [uploadType]);


  const handleFileChange = (e) => {
    let files = Array.from(e.target.files);
    setError('');

    if (uploadType === 'images') {
      if (files.length > MAX_IMAGES) {
        setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
        files = files.slice(0, MAX_IMAGES);
      }
      setSelectedFiles(files);
    } else if (uploadType === 'video') {
      if (files.length > 0) {
        const videoFile = files[0];
        if (videoFile.size > MAX_VIDEO_SIZE_BYTES) {
          setError(`Video file must be less than ${MAX_VIDEO_SIZE_MB}MB.`);
          setSelectedFiles([]);
        } else {
          setSelectedFiles([videoFile]);
        }
      } else {
        setSelectedFiles([]);
      }
    }
  };

  const removeFile = (fileName) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (uploadType === 'images') {
        selectedFiles.forEach(file => {
          formData.append('imageFiles', file); 
        });
      } else {
        formData.append('videoFile', selectedFiles[0]);
      }

      await api.post(`/projects/upload/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload();
      onClose();
    } catch (error) {
      console.error('Error uploading media:', error);
      setError(error.response?.data?.message || 'Failed to upload media. Check file type/size.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Project Media" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              uploadType === 'images'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <input
              type="radio"
              name="uploadType"
              value="images"
              checked={uploadType === 'images'}
              onChange={() => setUploadType('images')}
              className="hidden"
            />
            <Image className="w-5 h-5" />
            <span>Upload Images</span>
          </label>
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              uploadType === 'video'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <input
              type="radio"
              name="uploadType"
              value="video"
              checked={uploadType === 'video'}
              onChange={() => setUploadType('video')}
              className="hidden"
            />
            <Video className="w-5 h-5" />
            <span>Upload Video</span>
          </label>
        </div>

        <div>
          <label htmlFor="media-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {uploadType === 'images' ? `Select Images (Up to ${MAX_IMAGES})` : `Select Video (Max ${MAX_VIDEO_SIZE_MB}MB)`}
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
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
                Click to upload
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {uploadType === 'images' ? 'PNG, JPG, GIF' : 'MP4, WEBM, MOV'}
              </span>
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</h4>
            <div className="max-h-32 overflow-y-auto space-y-2 rounded-lg border dark:border-gray-700 p-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate pr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || selectedFiles.length === 0}>
            {loading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadMediaModal;