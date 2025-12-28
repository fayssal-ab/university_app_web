import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaBook } from 'react-icons/fa';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchesData, levelsData] = await Promise.all([
        adminService.getAllBranches(),
        adminService.getAllLevels()
      ]);
      setBranches(branchesData);
      setLevels(levelsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditing(branch);
    setFormData(branch);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await adminService.updateBranch(editing._id, formData);
      } else {
        await adminService.createBranch(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error saving branch');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await adminService.deleteBranch(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting branch:', error);
        alert('Error deleting branch');
      }
    }
  };

  // Get unique academic years from levels
  const academicYears = [...new Set(levels.map(l => l.academicYear))].sort().reverse();

  // Filter levels based on selected branch and year
  const filteredLevels = levels.filter(level => {
    const branchMatch = !selectedBranch || level.branch?._id === selectedBranch;
    const yearMatch = !selectedYear || level.academicYear === selectedYear;
    return branchMatch && yearMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaBook className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manage Branches</h1>
                  <p className="text-gray-600 mt-1">Manage your institution branches and levels</p>
                </div>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                <FaPlus className="mr-2" /> Add Branch
              </button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-4">
                  <FaFilter className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Branch Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Branches</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name} ({branch.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Years</option>
                      {academicYears.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reset Filters */}
                {(selectedBranch || selectedYear) && (
                  <button
                    onClick={() => {
                      setSelectedBranch('');
                      setSelectedYear('');
                    }}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ✕ Clear Filters
                  </button>
                )}
              </div>
            </Card>

            {/* Branches List */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Branches</h2>
              <Card>
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : branches.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No branches found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {branches.map((branch) => (
                          <tr key={branch._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{branch.name}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {branch.code}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{branch.description || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => openEdit(branch)}
                                  className="inline-flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(branch._id)}
                                  className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            {/* Levels Table */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Levels
                {selectedBranch && ` - ${branches.find(b => b._id === selectedBranch)?.name}`}
                {selectedYear && ` (${selectedYear})`}
              </h2>
              <Card>
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredLevels.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {selectedBranch || selectedYear 
                      ? 'No levels found for the selected filters'
                      : 'No levels available'
                    }
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Level Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Short Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Academic Year</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredLevels.map((level) => (
                          <tr key={level._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{level.name}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                {level.shortName}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {level.branch?.name} ({level.branch?.code})
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{level.academicYear}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{level.capacity || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Branch' : 'Create Branch'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
            <input
              placeholder="e.g., Génie Informatique"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
            <input
              placeholder="e.g., INFO, RESEAU, DATA"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Brief description of the branch"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBranches;