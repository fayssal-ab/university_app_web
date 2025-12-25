import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import MaterialUpload from '../../components/professor/MaterialUpload';
import Loader from '../../components/common/Loader';
import { FaUpload, FaBook, FaUsers, FaDownload, FaChartLine } from 'react-icons/fa';

const ManageModule = () => {
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [students, setStudents] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      // Get module with students
      const response = await professorService.getModuleStudents(moduleId);
      setModuleData(response.data.module);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching module data:', error);
      alert('Failed to load module data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (moduleId, title, description, file) => {
    try {
      await professorService.uploadMaterial(moduleId, title, description, file);
      alert('Material uploaded successfully!');
      setShowUploadModal(false);
      fetchModuleData();
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material');
    }
  };

  if (loading) return <Loader />;

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center py-12">
              <p className="text-gray-500">Module not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const module = moduleData;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{module?.name}</h1>
                <p className="text-gray-500 mt-1">{module?.code}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaUpload />
                  <span>Upload Material</span>
                </button>
                <Link
                  to={`/professor/modules/${moduleId}/grades`}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaChartLine />
                  <span>Manage Grades</span>
                </Link>
              </div>
            </div>

            {/* Module Info */}
            <Card className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Code:</span>
                  <p className="font-medium text-gray-900">{module?.code}</p>
                </div>
                <div>
                  <span className="text-gray-500">Level/Class:</span>
                  <p className="font-medium text-gray-900">
                    {module?.level?.shortName} - {module?.level?.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Semester:</span>
                  <p className="font-medium text-gray-900">Semester {module?.semester}</p>
                </div>
                <div>
                  <span className="text-gray-500">Coefficient:</span>
                  <p className="font-medium text-gray-900">{module?.coefficient}</p>
                </div>
                <div>
                  <span className="text-gray-500">Academic Year:</span>
                  <p className="font-medium text-gray-900">{module?.academicYear}</p>
                </div>
                <div>
                  <span className="text-gray-500">Students Enrolled:</span>
                  <p className="font-medium text-gray-900">{students.length}</p>
                </div>
              </div>
              {module?.description && (
                <div className="mt-4 pt-4 border-t">
                  <span className="text-gray-500 text-sm">Description:</span>
                  <p className="text-gray-700 mt-1">{module.description}</p>
                </div>
              )}
            </Card>

            {/* Course Materials */}
            <Card title="Course Materials" className="mb-8">
              {module?.materials && module.materials.length > 0 ? (
                <div className="space-y-3">
                  {module.materials.map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBook className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-gray-500">{material.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:5000${material.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FaDownload />
                        <span>Download</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBook size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No materials uploaded yet</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Upload your first material
                  </button>
                </div>
              )}
            </Card>

            {/* Enrolled Students */}
            <Card title="Enrolled Students">
              {students.length > 0 ? (
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
                          Current Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => {
                        const finalGrade = student.grades?.find(g => g.gradeType === 'final');
                        
                        return (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.studentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.user?.firstName} {student.user?.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.user?.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.level?.shortName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {finalGrade ? (
                                <span className={`font-bold ${
                                  finalGrade.value >= 10 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {finalGrade.value}/20
                                  {finalGrade.validated && (
                                    <span className="ml-2 text-xs text-green-600">(Validated)</span>
                                  )}
                                  {!finalGrade.validated && (
                                    <span className="ml-2 text-xs text-yellow-600">(Pending)</span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-gray-400">Not graded</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaUsers size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No students enrolled yet</p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Upload Material Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Course Material"
        size="lg"
      >
        <MaterialUpload
          modules={[module]}
          onUpload={handleUpload}
          onCancel={() => setShowUploadModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ManageModule;