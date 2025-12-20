import { FaTasks, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const AssignmentCard = ({ assignment, onSubmit }) => {
  const isOverdue = new Date(assignment.deadline) < new Date();
  const hasSubmission = assignment.submission !== null;

  const getStatusColor = () => {
    if (hasSubmission) {
      if (assignment.submission.status === 'graded') return 'text-green-600 bg-green-100';
      return 'text-blue-600 bg-blue-100';
    }
    if (isOverdue) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusText = () => {
    if (hasSubmission) {
      if (assignment.submission.status === 'graded') return 'Graded';
      return 'Submitted';
    }
    if (isOverdue) return 'Overdue';
    return 'Pending';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaTasks className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-500">
              {assignment.module?.name}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {assignment.description}
      </p>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <FaClock />
          <span>Due: {format(new Date(assignment.deadline), 'MMM dd, yyyy HH:mm')}</span>
        </div>
        <span className="text-gray-700 font-medium">
          Max Grade: {assignment.maxGrade}
        </span>
      </div>

      {hasSubmission ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Submitted on: {format(new Date(assignment.submission.submittedAt), 'MMM dd, yyyy HH:mm')}
              </p>
              {assignment.submission.grade && (
                <p className="text-lg font-bold text-green-600 mt-1">
                  Grade: {assignment.submission.grade}/{assignment.maxGrade}
                </p>
              )}
            </div>
            <FaCheckCircle className="text-green-600" size={24} />
          </div>
          {assignment.submission.feedback && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Feedback:</span> {assignment.submission.feedback}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => onSubmit(assignment._id)}
          disabled={isOverdue}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isOverdue
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOverdue ? 'Deadline Passed' : 'Submit Assignment'}
        </button>
      )}
    </div>
  );
};

export default AssignmentCard;