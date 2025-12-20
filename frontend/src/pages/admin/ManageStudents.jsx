import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import EnrollmentForm from '../../components/admin/EnrollmentForm';
import Loader from '../../components/common/Loader';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, modulesRes] = await Promise.all([
        adminService.getAllStudents(),
        adminService.getAllModules()
      ]);
      setStudents(studentsRes.data);
      setModules(modulesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (studentId, moduleIds) => {
    try {
      await adminService.enrollStudent(studentId, moduleIds);
      alert('Student enrolled successfully!');
      setShowEnrollModal(false);
      fetchData();
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('Failed to enroll student');
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enroll Student
              </button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Field
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Enrolled Modules
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {student.user?.firstName} {student.user?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.user?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.level?.shortName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.field}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {student.enrolledModules?.length || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Modal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        title="Enroll Student in Modules"
        size="lg"
      >
        <EnrollmentForm
          students={students}
          modules={modules}
          onSubmit={handleEnroll}
          onCancel={() => setShowEnrollModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ManageStudents;