import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import SubmissionTable from '../../components/professor/SubmissionTable';
import GradeForm from '../../components/professor/GradeForm';
import Loader from '../../components/common/Loader';

const ViewSubmissions = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const response = await professorService.getSubmissions(assignmentId);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (submissionId, grade, feedback) => {
    try {
      await professorService.gradeSubmission(submissionId, grade, feedback);
      alert('Grade submitted successfully!');
      setShowGradeModal(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to submit grade');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Assignment Submissions
            </h1>

            <Card>
              <SubmissionTable submissions={submissions} onGrade={handleGrade} />
            </Card>
          </div>
        </main>
      </div>

      {/* Grade Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Grade Submission"
        size="md"
      >
        {selectedSubmission && (
          <GradeForm
            submission={selectedSubmission}
            onSubmit={handleGradeSubmit}
            onCancel={() => setShowGradeModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ViewSubmissions;