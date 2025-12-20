import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

const ExportGrades = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Export Grades</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition cursor-pointer">
                <div className="text-center py-8">
                  <FaFilePdf size={64} className="mx-auto text-red-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export to PDF</h3>
                  <p className="text-gray-600 mb-4">Download grades as PDF document</p>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Download PDF
                  </button>
                </div>
              </Card>

              <Card className="hover:shadow-lg transition cursor-pointer">
                <div className="text-center py-8">
                  <FaFileExcel size={64} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export to Excel</h3>
                  <p className="text-gray-600 mb-4">Download grades as Excel spreadsheet</p>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Download Excel
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