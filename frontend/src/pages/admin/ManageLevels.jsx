import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaPlus } from 'react-icons/fa';

const ManageLevels = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await adminService.getAllLevels();
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manage Levels</h1>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaPlus />
                <span>Add Level</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level) => (
                <Card key={level._id}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
                  <p className="text-gray-500 mb-4">{level.shortName}</p>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Fields:</h4>
                    <ul className="space-y-1">
                      {level.fields?.map((field, index) => (
                        <li key={index} className="text-sm text-gray-600">• {field}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageLevels;