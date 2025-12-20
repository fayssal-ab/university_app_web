import { useState } from 'react';

const GradeForm = ({ submission, onSubmit, onCancel }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numGrade = parseFloat(grade);
    const maxGrade = submission.assignment?.maxGrade || 20;

    if (isNaN(numGrade) || numGrade < 0 || numGrade > maxGrade) {
      setError(`Grade must be between 0 and ${maxGrade}`);
      return;
    }

    onSubmit(submission._id, numGrade, feedback);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student
        </label>
        <p className="text-gray-900 font-semibold">
          {submission.student?.user?.firstName}{' '}
          {submission.student?.user?.lastName}
        </p>
        <p className="text-sm text-gray-500">
          {submission.student?.studentId}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade (out of {submission.assignment?.maxGrade || 20})
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          max={submission.assignment?.maxGrade || 20}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter grade"
          required
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Provide feedback to the student..."
        />
      </div>

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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Grade
        </button>
      </div>
    </form>
  );
};

export default GradeForm;