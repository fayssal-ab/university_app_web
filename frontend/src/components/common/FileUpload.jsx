import { useState } from 'react';
import { FaUpload, FaFile, FaTimes, FaCheckCircle } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, accept, maxSize = 20, label }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    setError('');

    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label || 'Upload File'}
      </label>

      {!selectedFile ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex items-center justify-center w-full"
        >
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          }`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className={`p-4 rounded-full mb-4 transition-colors ${
                isDragging ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <FaUpload className={`w-8 h-8 transition-colors ${
                  isDragging ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                <span className="text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: {maxSize}MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
            />
          </label>
        </div>
      ) : (
        <div className="relative p-5 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaFile className="text-blue-600" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500" size={20} />
                <button
                  onClick={removeFile}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;