import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaClock } from 'react-icons/fa';

const ModuleCard = ({ module }) => {
  return (
    <Link
      to={`/student/modules/${module._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaBook className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {module.name}
            </h3>
            <p className="text-sm text-gray-500">{module.code}</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
          Coef: {module.coefficient}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {module.description || 'No description available'}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <FaUser />
          <span>
            {module.professor?.user?.firstName} {module.professor?.user?.lastName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaClock />
          <span>Semester {module.semester}</span>
        </div>
      </div>

      {module.materials && module.materials.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">
            {module.materials.length} material(s) available
          </p>
        </div>
      )}
    </Link>
  );
};

export default ModuleCard;