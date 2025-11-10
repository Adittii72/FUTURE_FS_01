// import { useState, useRef, useEffect } from 'react';
// import { Upload, X } from 'lucide-react';
// import api from '../../services/api.js';
// import Modal from '../Modal.jsx';
// import Button from '../Button.jsx';

// const UploadAchievementImageModal = ({ isOpen, onClose, onUpload, achievementId }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (isOpen) {
//       setError('');
//       setSelectedFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = null;
//       }
//     }
//   }, [isOpen]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setError('');

//     if (file) {
//       if (file.size > 10 * 1024 * 1024) { // 10MB limit for certificates
//         setError('File size must be less than 10MB.');
//         setSelectedFile(null);
//       } else {
//         setSelectedFile(file);
//       }
//     } else {
//       setSelectedFile(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       setError('Please select an image to upload.');
//       return;
//     }
    
//     setLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('certificateImage', selectedFile); // Must match backend route field name

//       await api.post(`/achievements/upload/${achievementId}`, formData);

//       onUpload();
//       onClose();
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       setError(error.response?.data?.message || 'Failed to upload image. Check file type/size.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Upload Certificate Image" size="md">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* --- FILE INPUT --- */}
//         <div>
//           <label htmlFor="certificate-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Select Image (Max 10MB)
//           </label>
//           <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               id="certificate-upload"
//             />
//             <label
//               htmlFor="certificate-upload"
//               className="cursor-pointer flex flex-col items-center"
//             >
//               <Upload className="w-8 h-8 text-gray-400 mb-2" />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {selectedFile ? selectedFile.name : 'Click to upload'}
//               </span>
//               <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                 PNG, JPG, GIF, WEBP
//               </span>
//             </label>
//           </div>
//         </div>

//         {/* --- SUBMIT BUTTONS --- */}
//         <div className="flex justify-end gap-3 pt-4">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" variant="primary" disabled={loading || !selectedFile}>
//             {loading ? 'Uploading...' : 'Upload Image'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default UploadAchievementImageModal;



import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import api from '/src/services/api.js';
import Modal from '/src/components/Modal.jsx';
import Button from '/src/components/Button.jsx';

const UploadAchievementImageModal = ({ isOpen, onClose, onUpload, achievementId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('Image file must be less than 50MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('certificateImage', selectedFile); // Field name from backend route

      // --- THIS IS THE FIX ---
      await api.post(`/achievements/upload/${achievementId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // --- END FIX ---

      onUpload();
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Certificate Image" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* --- FILE INPUT --- */}
        <div>
          <label htmlFor="certificate-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Image (Max 50MB)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="certificate-upload"
            />
            <label
              htmlFor="certificate-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFile ? selectedFile.name : 'Click to upload'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, GIF, etc.
              </span>
            </label>
          </div>
        </div>

        {/* --- FILE PREVIEW --- */}
        {selectedFile && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected File:</h4>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span className="text-sm text-gray-800 dark:text-gray-200 truncate pr-2">{selectedFile.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- SUBMIT BUTTONS --- */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !selectedFile}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadAchievementImageModal;