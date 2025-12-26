import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaFilePdf, FaFileExcel, FaDownload } from 'react-icons/fa';

const ExportGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await adminService.getAllGrades();
      setGrades(response.data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented soon!');
    // TODO: Implement PDF export
  };

  const handleExportExcel = () => {
    // Simple CSV export as Excel alternative
    if (grades.length === 0) {
      alert('No grades to export');
      return;
    }

    const csvContent = [
      ['Student ID', 'Student Name', 'Module Code', 'Module Name', 'Grade', 'Validated', 'Semester', 'Academic Year'],
      ...grades.map(g => [
        g.student?.studentId || '',
        `${g.student?.user?.firstName || ''} ${g.student?.user?.lastName || ''}`,
        g.module?.code || '',
        g.module?.name || '',
        g.value || '',
        g.validated ? 'Yes' : 'No',
        g.semester || '',
        g.academicYear || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `grades_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Export Grades</h1>

            {/* Summary */}
            <Card className="mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">Total Grades</p>
                  <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Validated</p>
                  <p className="text-2xl font-bold text-green-600">
                    {grades.filter(g => g.validated).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {grades.filter(g => !g.validated).length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition cursor-pointer">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFilePdf size={40} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export to PDF</h3>
                  <p className="text-gray-600 mb-4">Download grades as PDF document</p>
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mx-auto"
                  >
                    <FaDownload />
                    <span>Download PDF</span>
                  </button>
                </div>
              </Card>

              <Card className="hover:shadow-lg transition cursor-pointer">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileExcel size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export to Excel</h3>
                  <p className="text-gray-600 mb-4">Download grades as CSV spreadsheet</p>
                  <button 
                    onClick={handleExportExcel}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mx-auto"
                  >
                    <FaDownload />
                    <span>Download CSV</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExportGrades;