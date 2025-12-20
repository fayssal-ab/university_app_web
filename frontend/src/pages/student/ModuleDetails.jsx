import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaDownload, FaBook, FaUser, FaTasks } from 'react-icons/fa';

const ModuleDetails = () => {
  const { id } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModuleDetails();
  }, [id]);

  const fetchModuleDetails = async () => {
    try {
      const response = await studentService.getModuleDetails(id);
      setModuleData(response.data);
    } catch (error) {
      console.error('Error fetching module details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const { module, assignments, grade } = moduleData;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/student/modules" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Modules
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{module.name}</h1>
                    <p className="text-gray-500 mt-1">{module.code}</p>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                    Coef: {module.coefficient}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{module.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Semester:</span>
                    <span className="ml-2 font-medium">{module.semester}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Field:</span>
                    <span className="ml-2 font-medium">{module.field}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Professor:</span>
                    <span className="ml-2 font-medium">
                      {module.professor?.user?.firstName} {module.professor?.user?.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="ml-2 font-medium">{module.academicYear}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Your Grade</h3>
                {grade ? (
                  <>
                    <p className="text-5xl font-bold mb-2">{grade.value}/20</p>
                    <p className="text-green-100 text-sm">
                      {grade.validated ? '✅ Validated' : '⏳ Pending validation'}
                    </p>
                  </>
                ) : (
                  <p className="text-green-100">No grade published yet</p>
                )}
              </Card>
            </div>

            {/* Course Materials */}
            <Card title="Course Materials" className="mb-8">
              {module.materials && module.materials.length > 0 ? (
                <div className="space-y-3">
                  {module.materials.map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <FaBook className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-900">{material.title}</h4>
                          <p className="text-sm text-gray-500">{material.description}</p>
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
                <p className="text-gray-500 text-center py-8">No materials available yet</p>
              )}
            </Card>

            {/* Assignments */}
            <Card title="Assignments">
              {assignments && assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FaTasks className="text-purple-600" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/student/assignments"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No assignments yet</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleDetails;