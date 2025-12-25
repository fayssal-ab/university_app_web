import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { FaPlus, FaEdit, FaTrash, FaBook, FaFilter } from 'react-icons/fa';

const ManageModules = () => {
  const [modules, setModules] = useState([]);
  const [levels, setLevels] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterBranch, setFilterBranch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesRes, levelsRes, profsRes, branchesRes] = await Promise.all([
        adminService.getAllModules(),
        adminService.getAllLevels(),
        adminService.getAllProfessors(),
        adminService.getAllBranches()
      ]);
      setModules(modulesRes.data || []);
      setLevels(levelsRes.data || []);
      setProfessors(profsRes.data || []);
      setBranches(Array.isArray(branchesRes) ? branchesRes : []);
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
      alert(error.response?.data?.error || 'Failed to save module');
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

  // Filter modules
  const filteredModules = modules.filter(module => {
    if (filterBranch && module.level?.branch?._id !== filterBranch) return false;
    if (filterLevel && module.level?._id !== filterLevel) return false;
    if (filterSemester && module.semester !== parseInt(filterSemester)) return false;
    return true;
  });

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
                <h1 className="text-3xl font-bold text-gray-900">Manage Modules</h1>
                <p className="text-gray-600 mt-2">Create and manage course modules</p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus />
                <span>Add Module</span>
              </button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <div className="flex items-center space-x-4">
                <FaFilter className="text-gray-500" />
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <select
                      value={filterBranch}
                      onChange={(e) => {
                        setFilterBranch(e.target.value);
                        setFilterLevel(''); // Reset level filter
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Branches</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name} ({branch.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!filterBranch}
                    >
                      <option value="">All Levels</option>
                      {levels
                        .filter(level => !filterBranch || level.branch?._id === filterBranch)
                        .map(level => (
                          <option key={level._id} value={level._id}>
                            {level.name} ({level.shortName})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterSemester}
                      onChange={(e) => setFilterSemester(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Semesters</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                </div>

                {(filterBranch || filterLevel || filterSemester) && (
                  <button
                    onClick={() => {
                      setFilterBranch('');
                      setFilterLevel('');
                      setFilterSemester('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </Card>

            {/* Modules Table */}
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
                        Branch
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
                        Coef
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredModules.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FaBook className="text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500 font-medium">No modules found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {filterBranch || filterLevel || filterSemester
                                ? 'Try changing your filters'
                                : 'Add your first module to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredModules.map((module) => (
                        <tr key={module._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {module.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {module.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                              {module.level?.branch?.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.level?.shortName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.professor?.user?.firstName} {module.professor?.user?.lastName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            S{module.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                Showing {filteredModules.length} of {modules.length} module(s)
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedModule ? 'Edit Module' : 'Create Module'}
        size="lg"
      >
        <ModuleForm
          levels={levels}
          professors={professors}
          branches={branches}
          module={selectedModule}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

// ✅ IMPROVED MODULE FORM
const ModuleForm = ({ levels, professors, branches, module, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: module?.code || '',
    name: module?.name || '',
    description: module?.description || '',
    semester: module?.semester || 1,
    level: module?.level?._id || '',
    field: module?.field || '',
    professor: module?.professor?._id || '',
    coefficient: module?.coefficient || 1,
    academicYear: module?.academicYear || '2024-2025'
  });

  const [selectedBranch, setSelectedBranch] = useState(
    module?.level?.branch?._id || ''
  );

  const [filteredLevels, setFilteredLevels] = useState([]);

  useEffect(() => {
    if (selectedBranch) {
      const filtered = levels.filter(level => level.branch?._id === selectedBranch);
      setFilteredLevels(filtered);
    } else {
      setFilteredLevels([]);
    }
  }, [selectedBranch, levels]);

  // Auto-set field when level changes
  useEffect(() => {
    if (formData.level) {
      const selectedLevel = levels.find(l => l._id === formData.level);
      if (selectedLevel?.branch?.name) {
        setFormData(prev => ({ ...prev, field: selectedLevel.branch.name }));
      }
    }
  }, [formData.level, levels]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
            placeholder="e.g., INF101"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Programming C"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the module..."
        />
      </div>

      {/* ✅ BRANCH → LEVEL CASCADE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch *
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setFormData({ ...formData, level: '', field: '' });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Branch First</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level/Class *
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!selectedBranch}
            required
          >
            <option value="">
              {selectedBranch ? 'Select Level' : 'Select Branch First'}
            </option>
            {filteredLevels.map((level) => (
              <option key={level._id} value={level._id}>
                {level.name} ({level.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester *
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coefficient *
          </label>
          <input
            type="number"
            name="coefficient"
            value={formData.coefficient}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year *
          </label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="2024-2025"
            required
          />
        </div>
      </div>

      {/* Field (auto-filled) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field (Auto-filled)
        </label>
        <input
          type="text"
          name="field"
          value={formData.field}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          placeholder="Will be auto-filled from branch"
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professor (Optional)
        </label>
        <select
          name="professor"
          value={formData.professor}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No Professor Assigned Yet</option>
          {professors.map((prof) => (
            <option key={prof._id} value={prof._id}>
              {prof.user?.firstName} {prof.user?.lastName} ({prof.professorId})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          You can assign a professor later
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {module ? 'Update Module' : 'Create Module'}
        </button>
      </div>
    </form>
  );
};

export default ManageModules;