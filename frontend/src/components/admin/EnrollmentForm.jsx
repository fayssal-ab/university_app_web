import { useState } from 'react';

const EnrollmentForm = ({ students, modules, onSubmit, onCancel }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);

  const handleModuleToggle = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || selectedModules.length === 0) {
      alert('Please select a student and at least one module');
      return;
    }
    onSubmit(selectedStudent, selectedModules);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Student *
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.user?.firstName} {student.user?.lastName} - {student.studentId}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Modules * (Select multiple)
        </label>
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
          {modules.length === 0 ? (
            <p className="text-gray-500 text-center">No modules available</p>
          ) : (
            modules.map((module) => (
              <label
                key={module._id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module._id)}
                  onChange={() => handleModuleToggle(module._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {module.code} - {module.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {module.field} | Semester {module.semester} | Coef: {module.coefficient}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedModules.length} module(s) selected
        </p>
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
          Enroll Student
        </button>
      </div>
    </form>
  );
};

export default EnrollmentForm;