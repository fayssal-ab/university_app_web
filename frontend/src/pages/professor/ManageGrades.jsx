import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  FaSave, 
  FaArrowLeft, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaClock, 
  FaUsers,
  FaCalculator,
  FaExclamationTriangle 
} from 'react-icons/fa';

const ManageGrades = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  const fetchData = async () => {
    try {
      const response = await professorService.getModuleStudents(moduleId);
      const module = response.data.module;
      const studentsList = response.data.students;

      setModuleData(module);
      setStudents(studentsList);

      // Initialize grades object
      const gradesObj = {};
      studentsList.forEach(student => {
        const controleGrade = student.grades?.find(g => g.gradeType === 'continuous');
        const examGrade = student.grades?.find(g => g.gradeType === 'exam');
        const finalGrade = student.grades?.find(g => g.gradeType === 'final');

        gradesObj[student._id] = {
          controle: controleGrade?.value || '',
          exam: examGrade?.value || '',
          final: finalGrade?.value || '',
          comments: finalGrade?.comments || '',
          validated: finalGrade?.validated || false
        };
      });
      setGrades(gradesObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate final grade automatically (Controle 40% + Exam 60%)
  const calculateFinalGrade = (controle, exam) => {
    const c = parseFloat(controle);
    const e = parseFloat(exam);
    
    if (isNaN(c) || isNaN(e)) return '';
    if (c < 0 || c > 20 || e < 0 || e > 20) return '';
    
    const final = (c * 0.4) + (e * 0.6);
    return final.toFixed(2);
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value
        }
      };

      // Auto-calculate final grade when controle or exam changes
      if (field === 'controle' || field === 'exam') {
        const finalGrade = calculateFinalGrade(
          field === 'controle' ? value : updated[studentId].controle,
          field === 'exam' ? value : updated[studentId].exam
        );
        updated[studentId].final = finalGrade;
      }

      return updated;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const studentId in grades) {
      const gradeData = grades[studentId];
      
      // Skip if already validated
      if (gradeData.validated) {
        skippedCount++;
        continue;
      }

      const controle = parseFloat(gradeData.controle);
      const exam = parseFloat(gradeData.exam);

      // Skip if incomplete
      if (isNaN(controle) || isNaN(exam)) {
        skippedCount++;
        continue;
      }

      // Validate ranges
      if (controle < 0 || controle > 20 || exam < 0 || exam > 20) {
        errorCount++;
        continue;
      }

      const finalValue = parseFloat(gradeData.final);

      try {
        // Save Controle grade (40%)
        await professorService.addGrade({
          studentId,
          moduleId,
          value: controle,
          semester: moduleData.semester,
          academicYear: moduleData.academicYear,
          gradeType: 'continuous',
          comments: gradeData.comments
        });

        // Save Exam grade (60%)
        await professorService.addGrade({
          studentId,
          moduleId,
          value: exam,
          semester: moduleData.semester,
          academicYear: moduleData.academicYear,
          gradeType: 'exam',
          comments: gradeData.comments
        });

        // Save Final grade (calculated)
        await professorService.addGrade({
          studentId,
          moduleId,
          value: finalValue,
          semester: moduleData.semester,
          academicYear: moduleData.academicYear,
          gradeType: 'final',
          comments: gradeData.comments
        });

        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error saving grades for student ${studentId}:`, error);
      }
    }

    setSaving(false);
    
    let message = `✅ ${successCount} étudiant(s) noté(s)`;
    if (errorCount > 0) message += `\n⚠️ ${errorCount} erreur(s)`;
    if (skippedCount > 0) message += `\n⭐️ ${skippedCount} sauté(s) (vide ou validé)`;
    message += '\n\n📋 Les notes attendent la validation de l\'admin.';
    
    alert(message);
    fetchData();
  };

  // Calculate statistics
  const totalStudents = students.length;
  const gradedCount = Object.values(grades).filter(g => 
    g.controle !== '' && g.exam !== '' && g.final !== ''
  ).length;
  const validatedCount = students.filter(s => {
    const finalGrade = s.grades?.find(g => g.gradeType === 'final');
    return finalGrade?.validated;
  }).length;
  const pendingCount = gradedCount - validatedCount;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate(`/professor/modules/${moduleId}/manage`)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <FaArrowLeft className="mr-2" />
                Retour au Module
              </button>
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Noter la Classe: {moduleData?.name}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {moduleData?.code} • {moduleData?.level?.name} • Semestre {moduleData?.semester}
                  </p>
                </div>
                <button
                  onClick={handleSaveAll}
                  disabled={saving || gradedCount === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition ${
                    saving || gradedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <FaSave className="text-xl" />
                  <span>{saving ? 'Enregistrement...' : `Enregistrer Tout (${gradedCount})`}</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaUsers className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Total Étudiants</p>
                    <p className="text-2xl font-bold text-blue-900">{totalStudents}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaCalculator className="text-purple-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-800 font-medium">Notés</p>
                    <p className="text-2xl font-bold text-purple-900">{gradedCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaClock className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-green-800 font-medium">Validés</p>
                    <p className="text-2xl font-bold text-green-900">{validatedCount}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">📚 Guide Rapide - Système de Notation</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <p className="font-semibold mb-1">🎯 Comment ça marche :</p>
                      <ul className="space-y-1">
                        <li>• Entrez la <strong>Note de Contrôle</strong> (sur 20)</li>
                        <li>• Entrez la <strong>Note d'Examen</strong> (sur 20)</li>
                        <li>• La <strong>Note Finale</strong> se calcule automatiquement</li>
                        <li>• Cliquez "Enregistrer Tout" pour sauvegarder</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">📊 Calcul de la Note Finale :</p>
                      <ul className="space-y-1">
                        <li>• <strong>Contrôle = 40%</strong> de la note finale</li>
                        <li>• <strong>Examen = 60%</strong> de la note finale</li>
                        <li>• Formule: <code className="bg-blue-100 px-1 rounded">Final = (Contrôle × 0.4) + (Examen × 0.6)</code></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-sm text-yellow-800 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      <strong>Important:</strong> Les notes validées ne peuvent plus être modifiées (contactez l'admin si nécessaire)
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Grades Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Matricule</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom Complet</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-purple-600 uppercase">
                        🎯 Contrôle<br/><span className="text-xs font-normal">(40%)</span>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-orange-600 uppercase">
                        📝 Examen<br/><span className="text-xs font-normal">(60%)</span>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-green-600 uppercase">
                        ✅ Note Finale<br/><span className="text-xs font-normal">(Auto)</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Commentaire</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => {
                      const existingFinalGrade = student.grades?.find(g => g.gradeType === 'final');
                      const isValidated = existingFinalGrade?.validated || false;
                      const studentGrades = grades[student._id] || {};
                      
                      return (
                        <tr 
                          key={student._id} 
                          className={`hover:bg-gray-50 transition ${
                            isValidated ? 'bg-green-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 shadow">
                                {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {student.user?.firstName} {student.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">{student.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Contrôle Grade (40%) */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={studentGrades.controle || ''}
                              onChange={(e) => handleGradeChange(student._id, 'controle', e.target.value)}
                              disabled={isValidated}
                              className={`w-24 px-3 py-2 border-2 rounded-lg text-center font-bold focus:ring-2 focus:ring-purple-500 transition ${
                                isValidated 
                                  ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                                  : studentGrades.controle
                                    ? 'border-purple-300 text-purple-700 bg-purple-50' 
                                    : 'border-gray-300'
                              }`}
                              placeholder="--"
                            />
                            <div className="text-xs text-purple-600 font-medium mt-1">40%</div>
                          </td>

                          {/* Exam Grade (60%) */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={studentGrades.exam || ''}
                              onChange={(e) => handleGradeChange(student._id, 'exam', e.target.value)}
                              disabled={isValidated}
                              className={`w-24 px-3 py-2 border-2 rounded-lg text-center font-bold focus:ring-2 focus:ring-orange-500 transition ${
                                isValidated 
                                  ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                                  : studentGrades.exam
                                    ? 'border-orange-300 text-orange-700 bg-orange-50' 
                                    : 'border-gray-300'
                              }`}
                              placeholder="--"
                            />
                            <div className="text-xs text-orange-600 font-medium mt-1">60%</div>
                          </td>

                          {/* Final Grade (Auto-calculated) */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className={`w-24 mx-auto px-3 py-2 border-2 rounded-lg text-center font-bold ${
                              studentGrades.final
                                ? parseFloat(studentGrades.final) >= 10 
                                  ? 'border-green-400 text-green-700 bg-green-50' 
                                  : 'border-red-400 text-red-700 bg-red-50'
                                : 'border-gray-300 text-gray-400 bg-gray-50'
                            }`}>
                              {studentGrades.final || '--'}
                            </div>
                            {studentGrades.final && (
                              <div className="text-xs text-gray-500 mt-1">
                                {parseFloat(studentGrades.final) >= 10 ? '✅ Admis' : '❌ Ajourné'}
                              </div>
                            )}
                          </td>

                          {/* Comments */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={studentGrades.comments || ''}
                              onChange={(e) => handleGradeChange(student._id, 'comments', e.target.value)}
                              disabled={isValidated}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition ${
                                isValidated ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                              }`}
                              placeholder="Commentaire optionnel..."
                            />
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {existingFinalGrade ? (
                              <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center w-fit ${
                                existingFinalGrade.validated
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              }`}>
                                {existingFinalGrade.validated ? (
                                  <>
                                    <FaCheckCircle className="mr-1" />
                                    Validé
                                  </>
                                ) : (
                                  <>
                                    <FaClock className="mr-1" />
                                    En Attente
                                  </>
                                )}
                              </span>
                            ) : studentGrades.final ? (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                À Sauvegarder
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                                Non Noté
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {students.length === 0 && (
                <div className="text-center py-12">
                  <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500 font-medium">Aucun étudiant inscrit dans ce module</p>
                </div>
              )}
            </Card>

            {/* Bottom Summary */}
            {students.length > 0 && (
              <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-700">
                  <span className="font-bold text-blue-600">{totalStudents}</span> étudiants • 
                  <span className="font-bold text-purple-600 ml-2">{gradedCount}</span> notés • 
                  <span className="font-bold text-yellow-600 ml-2">{pendingCount}</span> en attente • 
                  <span className="font-bold text-green-600 ml-2">{validatedCount}</span> validés
                </div>
                
                <button
                  onClick={handleSaveAll}
                  disabled={saving || gradedCount === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-bold transition ${
                    saving || gradedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg'
                  }`}
                >
                  <FaSave />
                  <span>{saving ? 'Enregistrement...' : `Enregistrer (${gradedCount})`}</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageGrades;