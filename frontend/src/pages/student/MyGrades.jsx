import { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import GradeTable from '../../components/student/GradeTable';
import Loader from '../../components/common/Loader';

const MyGrades = () => {
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await studentService.getGrades();
      setGradesData(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Grades</h1>

            {/* Averages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Semester Average</h3>
                <p className="text-4xl font-bold">{gradesData?.semesterAverage || '0.00'}/20</p>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Yearly Average</h3>
                <p className="text-4xl font-bold">{gradesData?.yearlyAverage || '0.00'}/20</p>
              </Card>
            </div>

            {/* Grades Table */}
            <Card title="All Grades">
              <GradeTable grades={gradesData?.grades || []} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyGrades;