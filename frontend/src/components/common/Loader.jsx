// Loader.jsx - التصميم الجديد
const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col items-center justify-center">
        
        {/* شعار EMSI مع تأثير نبض */}
        <div className="relative mb-8">
          {/* تأثير النبض */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-32 h-32 rounded-full border-2 border-blue-200 animate-ping"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.5 - i * 0.15
                }}
              />
            ))}
          </div>
          
          {/* الشعار المركزي */}
          <div className="relative z-10 w-20 h-20 rounded-xl flex items-center justify-center bg-white shadow-lg border border-gray-200">
            <img 
              src="/src/assets/logo/logo.jpg" 
              alt="EMSI Logo" 
              className="w-16 h-16 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* رسالة التحميل بالفرنسية */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Chargement en cours...
          </p>
          
          {/* نقاط متحركة */}
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          {/* شريط التقدم البسيط */}
<div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
  <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Loader;