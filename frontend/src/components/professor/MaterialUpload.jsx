import { useState } from 'react';
import FileUpload from '../common/FileUpload';

const MaterialUpload = ({ modules, onUpload, onCancel }) => {
  const [formData, setFormData] = useState({
    moduleId: '',
    title: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.moduleId || !formData.title || !file) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await onUpload(formData.moduleId, formData.title, formData.description, file);
      setFormData({ moduleId: '', title: '', description: '' });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Module *
        </label>
        <select
          value={formData.moduleId}
          onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a module</option>
          {modules.map((module) => (
            <option key={module._id} value={module._id}>
              {module.code} - {module.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Chapter 1 - Introduction"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the material..."
        />
      </div>

      <FileUpload
        onFileSelect={setFile}
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        maxSize={10}
        label="Upload Material *"
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>
      </div>
    </form>
  );
};

export default MaterialUpload;