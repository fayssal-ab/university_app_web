import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBook, FaUsers, FaFileAlt, FaGraduationCap } from 'react-icons/fa';

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await professorService.getModules();
      console.log('Modules Response:', response); // DEBUG
      setModules(response.data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Modules</h1>

            {modules.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaBook className="mx-auto text-gray-400 text-5xl mb-4" />
                <p className="text-gray-500 text-lg">No modules assigned yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <Card key={module._id} className="hover:shadow-lg transition">
                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBook className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {module.name}
                          </h3>
                          <p className="text-sm text-gray-500">{module.code}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        S{module.semester}
                      </span>
                    </div>

                    {/* Level/Class Info */}
                    {module.level ? (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaGraduationCap className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-900">
                            {module.level.name || module.level.shortName}
                          </span>
                        </div>
                        {module.level.branch && (
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                              {module.level.branch.code}
                            </span>
                            <span className="text-xs text-gray-600">
                              {module.level.branch.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-700">
                          ⚠️ No level/class assigned
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {module.description || 'No description available'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                      <div className="flex items-center space-x-2">
                        <FaUsers size={14} />
                        <span>{module.studentCount || 0} students</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaFileAlt size={14} />
                        <span>{module.materials?.length || 0} materials</span>
                      </div>
                      <span className="font-semibold text-gray-700">
                        Coef: {module.coefficient}
                      </span>
                    </div>

                    {/* Academic Year */}
                    <div className="text-xs text-gray-500 mb-3">
                      📅 {module.academicYear}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/professor/modules/${module._id}/manage`}
                      className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Manage Module
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyModules;