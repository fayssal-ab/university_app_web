import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ModuleForm from '../../components/admin/ModuleForm';
import Loader from '../../components/common/Loader';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ManageModules = () => {
  const [modules, setModules] = useState([]);
  const [levels, setLevels] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesRes, levelsRes, profsRes] = await Promise.all([
        adminService.getAllModules(),
        adminService.getAllLevels(),
        adminService.getAllProfessors()
      ]);
      setModules(modulesRes.data);
      setLevels(levelsRes.data);
      setProfessors(profsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedModule(null);
    setShowModal(true);
  };

  const handleEdit = (module) => {
    setSelectedModule(module);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedModule) {
        await adminService.updateModule(selectedModule._id, formData);
        alert('Module updated successfully!');
      } else {
        await adminService.createModule(formData);
        alert('Module created successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Failed to save module');
    }
  };

  const handleDelete = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await adminService.deleteModule(moduleId);
        alert('Module deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module');
      }
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Modules</h1>
              <button
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaPlus />
                <span>Add Module</span>
              </button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Professor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Coefficient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map((module) => (
                      <tr key={module._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {module.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {module.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {module.level?.shortName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {module.professor?.user?.firstName} {module.professor?.user?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          S{module.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {module.coefficient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(module)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(module._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={18} />
                          </button>
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedModule ? 'Edit Module' : 'Create Module'}
        size="lg"
      >
        <ModuleForm
          levels={levels}
          professors={professors}
          module={selectedModule}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ManageModules;