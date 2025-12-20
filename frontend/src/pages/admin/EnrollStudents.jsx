import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import EnrollmentForm from '../../components/admin/EnrollmentForm';
import Loader from '../../components/common/Loader';

const EnrollStudents = () => {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Enroll Students</h1>

            <Card>
              <EnrollmentForm
                students={students}
                modules={modules}
                onSubmit={handleEnroll}
                onCancel={() => {}}
              />
            </Card>

            {/* Recent Enrollments */}
            <Card title="Recent Enrollments" className="mt-8">
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div key={student._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {student.user?.firstName} {student.user?.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {student.enrolledModules?.length || 0} modules
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnrollStudents;