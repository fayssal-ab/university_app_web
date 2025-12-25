import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

const fetchBranches = async () => {
  const data = await adminService.getAllBranches();
  setBranches(data); // ✅ مباشرة
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
    if (editing) {
      await adminService.updateBranch(editing._id, formData);
    } else {
      await adminService.createBranch(formData);
    }
    setShowModal(false);
    fetchBranches();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this branch?')) {
      await adminService.deleteBranch(id);
      fetchBranches();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Branches</h1>
            <button
              onClick={openCreate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FaPlus className="mr-2" /> Add Branch
            </button>
          </div>

          <Card>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td>{b.name}</td>
                    <td className="font-semibold">{b.code}</td>
                    <td>{b.description || '-'}</td>
                    <td className="flex gap-3">
                      <button onClick={() => openEdit(b)} className="text-blue-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(b._id)} className="text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Branch' : 'Create Branch'}
      >
        <div className="space-y-4">
          <input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Code (GI, CPI...)"
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBranches;
