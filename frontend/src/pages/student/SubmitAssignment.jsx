import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/FileUpload';
import Loader from '../../components/common/Loader';

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to submit');
      return;
    }

    setLoading(true);
    try {
      await studentService.submitAssignment(assignmentId, file);
      alert('Assignment submitted successfully!');
      navigate('/student/assignments');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Assignment</h1>

            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FileUpload
                  onFileSelect={setFile}
                  accept=".pdf,.doc,.docx,.zip"
                  maxSize={20}
                  label="Upload your submission"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Submission Guidelines:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Accepted formats: PDF, DOC, DOCX, ZIP</li>
                    <li>Maximum file size: 20MB</li>
                    <li>Make sure your file is properly named</li>
                    <li>You can only submit once</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/student/assignments')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className={`px-6 py-2 rounded-lg text-white ${
                      loading || !file
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitAssignment;