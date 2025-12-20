import { format } from 'date-fns';
import { FaDownload, FaCheckCircle, FaClock } from 'react-icons/fa';

const SubmissionTable = ({ submissions, onGrade }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Submitted At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Grade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No submissions yet
              </td>
            </tr>
          ) : (
            submissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                {/* Student */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {submission.student?.user?.firstName?.[0]}
                      {submission.student?.user?.lastName?.[0]}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.student?.user?.firstName}{' '}
                        {submission.student?.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.student?.studentId}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Submitted At */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(
                    new Date(submission.submittedAt),
                    'MMM dd, yyyy HH:mm'
                  )}
                </td>

                {/* File */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href={`http://localhost:5000${submission.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </a>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      submission.status === 'graded'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'late'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.status === 'graded' ? (
                      <span className="flex items-center space-x-1">
                        <FaCheckCircle />
                        <span>Graded</span>
                      </span>
                    ) : submission.status === 'late' ? (
                      'Late'
                    ) : (
                      <span className="flex items-center space-x-1">
                        <FaClock />
                        <span>Pending</span>
                      </span>
                    )}
                  </span>
                </td>

                {/* Grade */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {submission.grade !== undefined && submission.grade !== null ? (
                    <span className="text-lg font-bold text-green-600">
                      {submission.grade}/{submission.assignment?.maxGrade}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not graded</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {submission.status !== 'graded' && (
                    <button
                      onClick={() => onGrade(submission)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Grade
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;
