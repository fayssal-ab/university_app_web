import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher, FaBook } from 'react-icons/fa';

const ManageProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    professorId: '',
    department: '',
    specialization: '',
    branches: [], // ✅ Array of branch IDs
    phoneNumber: '',
    officeLocation: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profsRes, branchesRes] = await Promise.all([
        adminService.getAllProfessors(),
        adminService.getAllBranches()
      ]);
      setProfessors(Array.isArray(profsRes.data) ? profsRes.data : []);
      setBranches(Array.isArray(branchesRes) ? branchesRes : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProfessors([]);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProfessor(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      professorId: '',
      department: '',
      specialization: '',
      branches: [],
      phoneNumber: '',
      officeLocation: ''
    });
    setShowModal(true);
  };

  const handleEdit = (professor) => {
    setEditingProfessor(professor);
    setFormData({
      email: professor.user?.email || '',
      firstName: professor.user?.firstName || '',
      lastName: professor.user?.lastName || '',
      professorId: professor.professorId,
      department: professor.department,
      specialization: professor.specialization || '',
      branches: professor.branches?.map(b => b._id) || [],
      phoneNumber: professor.phoneNumber || '',
      officeLocation: professor.officeLocation || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleBranchToggle = (branchId) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProfessor) {
        const updateData = { ...formData };
        delete updateData.password;
        delete updateData.email;
        await adminService.updateProfessor(editingProfessor._id, updateData);
        alert('Professor updated successfully!');
      } else {
        await adminService.createProfessor(formData);
        alert('Professor created successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving professor:', error);
      alert(error.response?.data?.error || 'Failed to save professor');
    }
  };

  const handleDelete = async (professorId) => {
    if (window.confirm('Are you sure you want to delete this professor?')) {
      try {
        await adminService.deleteProfessor(professorId);
        alert('Professor deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting professor:', error);
        alert(error.response?.data?.error || 'Failed to delete professor');
      }
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Professors</h1>
                <p className="text-gray-600 mt-2">Create and manage professor accounts</p>
              </div>
              <button 
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus />
                <span>Add Professor</span>
              </button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Professor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Professor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Branches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Assigned Modules
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {professors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FaChalkboardTeacher className="text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500 font-medium">No professors found</p>
                            <p className="text-gray-400 text-sm mt-1">Add your first professor to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      professors.map((professor) => (
                        <tr key={professor._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-semibold">
                                {professor.user?.firstName?.[0]}{professor.user?.lastName?.[0]}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {professor.user?.firstName} {professor.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {professor.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {professor.professorId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {professor.department}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {professor.branches?.length > 0 ? (
                                professor.branches.map((branch) => (
                                  <span
                                    key={branch._id}
                                    className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full"
                                  >
                                    {branch.code}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">No branches</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full w-fit">
                              <FaBook className="mr-1" />
                              {professor.assignedModules?.length || 0} modules
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                            <button
                              onClick={() => handleEdit(professor)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(professor._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProfessor ? 'Edit Professor' : 'Create New Professor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={editingProfessor}
                required
              />
            </div>

            {!editingProfessor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={!editingProfessor}
                  minLength={6}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professor ID *
              </label>
              <input
                type="text"
                value={formData.professorId}
                onChange={(e) => setFormData({ ...formData, professorId: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="PROF2024001"
                disabled={editingProfessor}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Département Informatique"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Intelligence Artificielle"
            />
          </div>

          {/* ✅ BRANCHES SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branches (Select all that apply)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
              {branches.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No branches available</p>
              ) : (
                branches.map((branch) => (
                  <label
                    key={branch._id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.branches.includes(branch._id)}
                      onChange={() => handleBranchToggle(branch._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {branch.name}
                      </div>
                      <div className="text-xs text-gray-500">{branch.code}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.branches.length} branch(es) selected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Location
              </label>
              <input
                type="text"
                value={formData.officeLocation}
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Bureau 204"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingProfessor ? 'Update Professor' : 'Create Professor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProfessors;