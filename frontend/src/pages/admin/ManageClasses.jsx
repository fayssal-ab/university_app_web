import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { FaPlus, FaUsers, FaGraduationCap, FaEdit, FaTrash, FaBook } from 'react-icons/fa';

const ManageClasses = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);


  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    year: 1,
    branch: 'CPI',
    academicYear: '2024-2025',
    capacity: 50
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await adminService.getAllLevels();
      const levelsData = response.data || [];
      setLevels(Array.isArray(levelsData) ? levelsData : []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLevel(null);
    setFormData({
      name: '',
      shortName: '',
      year: 1,
      branch: 'CPI',
      academicYear: '2024-2025',
      capacity: 50
    });
    setShowModal(true);
  };

  const handleEdit = (level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      shortName: level.shortName,
      year: level.year,
      branch: level.branch,
      academicYear: level.academicYear,
      capacity: level.capacity
    });
    setShowModal(true);
  };
useEffect(() => {
  fetchLevels();
  fetchBranches();
}, []);

const fetchBranches = async () => {
  const data = await adminService.getAllBranches();
  setBranches(data);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLevel) {
        await adminService.updateLevel(editingLevel._id, formData);
        alert('Class updated successfully!');
      } else {
        await adminService.createLevel(formData);
        alert('Class created successfully!');
      }
      setShowModal(false);
      fetchLevels();
    } catch (error) {
      console.error('Error saving class:', error);
      alert(error.response?.data?.error || 'Failed to save class');
    }
  };

  const handleDelete = async (levelId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await adminService.deleteLevel(levelId);
        alert('Class deleted successfully!');
        fetchLevels();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert(error.response?.data?.error || 'Failed to delete class');
      }
    }
  };

  const handleViewStudents = (levelId) => {
    navigate(`/admin/classes/${levelId}/students`);
  };



  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
                <p className="text-gray-600 mt-2">Create and manage student classes</p>
              </div>
              <button 
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus />
                <span>Add Class</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level) => (
                <Card key={level._id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FaGraduationCap className="text-blue-600 text-2xl" />
                      </div>
                     <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">

                        {level.branch?.code}

                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{level.branch?.name}
</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <FaUsers className="mr-2" />
                          Students
                        </span>
                        <span className="font-semibold text-gray-900">
                          {level.studentCount || 0} / {level.capacity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <FaBook className="mr-2" />
                          Modules
                        </span>
                        <span className="font-semibold text-gray-900">
                          {level.moduleCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Year</span>
                        <span className="font-semibold text-gray-900">Year {level.year}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewStudents(level._id)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View Students
                      </button>
                      <button
                        onClick={() => handleEdit(level)}
                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(level._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {levels.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <FaGraduationCap className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Found</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first class</p>
                  <button 
                    onClick={handleCreate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Class
                  </button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLevel ? 'Edit Class' : 'Create New Class'}
        size="md"
      >
        <div onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CPI 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name *
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CPI1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Year 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch *
              </label>
              <select
  value={formData.branch}
  onChange={(e) =>
    setFormData({ ...formData, branch: e.target.value })
  }
  className="w-full px-4 py-2 border rounded"
>
  <option value="">Select branch</option>
  {branches.map((branch) => (
    <option key={branch._id} value={branch._id}>
      {branch.name} ({branch.code})
    </option>
  ))}
</select>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="2024-2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingLevel ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageClasses;