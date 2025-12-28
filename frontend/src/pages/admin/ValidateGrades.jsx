import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  FaCheckCircle, 
  FaClock, 
  FaGraduationCap, 
  FaChevronRight,
  FaUsers,
  FaBook,
  FaFilter,
  FaArrowLeft
} from 'react-icons/fa';

const ValidateGrades = () => {
  const [levels, setLevels] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [filterBranch, setFilterBranch] = useState('');

  useEffect(() => {
    fetchLevelsAndBranches();
  }, []);

  const fetchLevelsAndBranches = async () => {
    try {
      const [levelsRes, branchesRes] = await Promise.all([
        adminService.getAllLevels(),
        adminService.getAllBranches()
      ]);
      
      setLevels(levelsRes.data || []);
      setBranches(branchesRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLevel = async (level) => {
    setSelectedLevel(level);
    setLoading(true);

    try {
      const studentsRes = await adminService.getStudentsByLevel(level._id);
      const studentsList = Array.isArray(studentsRes) ? studentsRes : [];
      setStudents(studentsList);

      const modulesRes = await adminService.getAllModules();
      const levelModules = (modulesRes.data || []).filter(
        m => m.level?._id === level._id
      );
      setModules(levelModules);

      const gradesRes = await adminService.getAllGrades();
      const allGrades = gradesRes.data || [];
      
      const studentIds = studentsList.map(s => s._id);
      const levelGrades = allGrades.filter(g => 
        studentIds.includes(g.student?._id)
      );
      setGrades(levelGrades);
    } catch (error) {
      console.error('Error fetching level data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateGrade = async (gradeId) => {
    setValidating(true);
    try {
      await adminService.validateGrade(gradeId);
      
      const gradesRes = await adminService.getAllGrades();
      const allGrades = gradesRes.data || [];
      const studentIds = students.map(s => s._id);
      const levelGrades = allGrades.filter(g => 
        studentIds.includes(g.student?._id)
      );
      setGrades(levelGrades);
      
      alert('✅ Note validée avec succès !');
    } catch (error) {
      console.error('Error validating grade:', error);
      alert('❌ Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const handleValidateAllPending = async () => {
    const pendingGrades = grades.filter(g => !g.validated);
    
    if (pendingGrades.length === 0) {
      alert('Aucune note en attente de validation');
      return;
    }

    if (!window.confirm(
      `Êtes-vous sûr de vouloir valider toutes les ${pendingGrades.length} note(s) en attente ?`
    )) {
      return;
    }

    setValidating(true);
    let successCount = 0;
    let errorCount = 0;

    for (const grade of pendingGrades) {
      try {
        await adminService.validateGrade(grade._id);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Error validating grade:', grade._id, error);
      }
    }

    const gradesRes = await adminService.getAllGrades();
    const allGrades = gradesRes.data || [];
    const studentIds = students.map(s => s._id);
    const levelGrades = allGrades.filter(g => 
      studentIds.includes(g.student?._id)
    );
    setGrades(levelGrades);

    setValidating(false);

    let message = `✅ ${successCount} note(s) validée(s)`;
    if (errorCount > 0) message += `\n❌ ${errorCount} erreur(s)`;
    alert(message);
  };

  const handleBackToClasses = () => {
    setSelectedLevel(null);
    setStudents([]);
    setModules([]);
    setGrades([]);
  };

  const filteredLevels = filterBranch
    ? levels.filter(l => l.branch?._id === filterBranch)
    : levels;

  const getStudentGrades = (studentId, moduleId) => {
    return grades.filter(g => 
      g.student?._id === studentId && 
      g.module?._id === moduleId
    );
  };

  if (loading && !selectedLevel) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Valider les Notes
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedLevel 
                  ? `Classe: ${selectedLevel.name} (${selectedLevel.shortName})`
                  : 'Sélectionnez une classe pour valider les notes'
                }
              </p>
            </div>

            {/* Show Classes List */}
            {!selectedLevel && (
              <>
                {/* Branch Filter */}
                <Card className="mb-6">
                  <div className="flex items-center space-x-4">
                    <FaFilter className="text-gray-500" />
                    <div className="flex-1">
                      <select
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Toutes les Filières</option>
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name} ({branch.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    {filterBranch && (
                      <button
                        onClick={() => setFilterBranch('')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </Card>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLevels.map(level => (
                    <div
                      key={level._id}
                      onClick={() => handleSelectLevel(level)}
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      <Card className="hover:shadow-xl transition-shadow h-full">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <FaGraduationCap className="text-blue-600 text-2xl" />
                            </div>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                              {level.branch?.code}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {level.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {level.branch?.name}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <FaUsers className="mr-2" />
                              {level.studentCount || 0} étudiants
                            </span>
                            <FaChevronRight className="text-gray-400 group-hover:translate-x-1 transition" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

                {filteredLevels.length === 0 && (
                  <Card>
                    <div className="text-center py-12">
                      <FaGraduationCap className="mx-auto text-gray-400 text-5xl mb-4" />
                      <p className="text-gray-500 font-medium">
                        {filterBranch 
                          ? 'Aucune classe trouvée pour cette filière'
                          : 'Aucune classe disponible'
                        }
                      </p>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Show Selected Level Grades */}
            {selectedLevel && (
              <>
                <button
                  onClick={handleBackToClasses}
                  className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition font-medium"
                >
                  <FaArrowLeft className="mr-2" />
                  Retour aux classes
                </button>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-3 p-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FaUsers className="text-blue-600 text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Étudiants</p>
                        <p className="text-2xl font-bold text-blue-900">{students.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-purple-50 border border-purple-200">
                    <div className="flex items-center space-x-3 p-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FaBook className="text-purple-600 text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-800 font-medium">Modules</p>
                        <p className="text-2xl font-bold text-purple-900">{modules.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center space-x-3 p-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <FaClock className="text-yellow-600 text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">En Attente</p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {grades.filter(g => !g.validated).length}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-green-50 border border-green-200">
                    <div className="flex items-center space-x-3 p-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FaCheckCircle className="text-green-600 text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-green-800 font-medium">Validées</p>
                        <p className="text-2xl font-bold text-green-900">
                          {grades.filter(g => g.validated).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Validate All Button */}
                {grades.filter(g => !g.validated).length > 0 && (
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={handleValidateAllPending}
                      disabled={validating}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition ${
                        validating
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 shadow-lg'
                      }`}
                    >
                      <FaCheckCircle />
                      <span>
                        {validating 
                          ? 'Validation en cours...' 
                          : `Valider Tout (${grades.filter(g => !g.validated).length})`
                        }
                      </span>
                    </button>
                  </div>
                )}

                {/* Grades Table */}
                <Card>
                  {loading ? (
                    <Loader />
                  ) : students.length === 0 ? (
                    <div className="text-center py-12">
                      <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
                      <p className="text-gray-500 font-medium">
                        Aucun étudiant dans cette classe
                      </p>
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBook className="mx-auto text-gray-400 text-5xl mb-4" />
                      <p className="text-gray-500 font-medium">
                        Aucun module assigné à cette classe
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                              Étudiant
                            </th>
                            {modules.map(module => (
                              <th 
                                key={module._id} 
                                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                              >
                                <div>{module.code}</div>
                                <div className="text-xs font-normal text-gray-400 mt-1">
                                  {module.name}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map(student => (
                            <tr key={student._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                    {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                      {student.user?.firstName} {student.user?.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {student.studentId}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              
                              {modules.map(module => {
                                const moduleGrades = getStudentGrades(student._id, module._id);
                                const finalGrade = moduleGrades.find(g => g.gradeType === 'final');

                                return (
                                  <td 
                                    key={module._id} 
                                    className="px-4 py-3 text-center"
                                  >
                                    {finalGrade ? (
                                      <div className="space-y-2">
                                        <div className={`text-lg font-bold ${
                                          finalGrade.value >= 10 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                        }`}>
                                          {finalGrade.value}/20
                                        </div>

                                        {finalGrade.validated ? (
                                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                            <FaCheckCircle className="mr-1" size={12} />
                                            Validé
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() => handleValidateGrade(finalGrade._id)}
                                            disabled={validating}
                                            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                              validating
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            }`}
                                          >
                                            <FaClock className="mr-1" size={12} />
                                            Valider
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-400">
                                        Non noté
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ValidateGrades;