import { useState, useEffect } from 'react';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBullhorn, FaBook, FaUsers, FaPaperPlane } from 'react-icons/fa';

const Announcements = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    moduleId: '',
    title: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await professorService.getModules();
      console.log('📚 Modules loaded:', response.data);
      setModules(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching modules:', error);
      alert('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.moduleId) {
      newErrors.moduleId = 'Please select a module';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSending(true);

    try {
      console.log('📤 Sending announcement:', formData);
      
      const response = await professorService.sendAnnouncement(
        formData.moduleId,
        formData.title,
        formData.message
      );
      
      console.log('✅ Response:', response);
      
      alert(`✅ Announcement sent successfully!\n${response.message || 'Notification sent to students'}`);
      
      // Reset form
      setFormData({ moduleId: '', title: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('❌ Error sending announcement:', error);
      console.error('Error details:', error.response?.data);
      alert(`❌ Failed to send announcement\n${error.response?.data?.error || error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectedModule = modules.find(m => m._id === formData.moduleId);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaBullhorn className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Send Announcement
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Notify students enrolled in your modules
                  </p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <FaBullhorn className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Select a module from your assigned modules</li>
                    <li>• Write a clear title and message</li>
                    <li>• All enrolled students will receive a notification</li>
                    <li>• Students can view announcements in their notifications page</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Form */}
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Module Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Module *
                  </label>
                  <div className="relative">
                    <select
                      name="moduleId"
                      value={formData.moduleId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                        errors.moduleId 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      required
                    >
                      <option value="">Choose a module...</option>
                      {modules.map((module) => (
                        <option key={module._id} value={module._id}>
                          {module.code} - {module.name} ({module.level?.shortName || 'N/A'})
                        </option>
                      ))}
                    </select>
                    <FaBook className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.moduleId && (
                    <p className="mt-1 text-sm text-red-600">{errors.moduleId}</p>
                  )}
                  
                  {/* Module Info */}
                  {selectedModule && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaUsers className="text-blue-600" />
                          <span>
                            <strong>{selectedModule.studentCount || 0}</strong> student(s) will be notified
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {selectedModule.level?.shortName || 'Unknown Level'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.title 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Class Cancelled Tomorrow"
                    required
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Type your announcement message here...&#10;&#10;Example:&#10;Dear students,&#10;&#10;Our next class (Wednesday, Jan 15) is cancelled due to...&#10;&#10;Best regards"
                    required
                    maxLength={1000}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                {/* Preview */}
                {formData.title && formData.message && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Preview</p>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaBullhorn className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{formData.title}</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            From: {selectedModule?.code} - {selectedModule?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ moduleId: '', title: '', message: '' })}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !formData.moduleId || !formData.title || !formData.message}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition ${
                      sending || !formData.moduleId || !formData.title || !formData.message
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <FaPaperPlane className={sending ? 'animate-pulse' : ''} />
                    <span>{sending ? 'Sending...' : 'Send Announcement'}</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* Recent Announcements Info */}
            <Card className="mt-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaBullhorn className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tips for effective announcements</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Keep your title short and descriptive</li>
                    <li>• Include important dates and deadlines</li>
                    <li>• Be clear and professional in your message</li>
                    <li>• Students will receive a notification immediately</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Announcements;