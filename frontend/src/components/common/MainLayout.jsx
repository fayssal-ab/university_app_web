// ========================================
// MainLayout.jsx - Enhanced Version
// Place this in: src/components/common/MainLayout.jsx
// ========================================
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, menuOpen, onCloseMenu }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Backdrop for mobile */}
      {isMobile && menuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onCloseMenu}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={menuOpen} onClose={onCloseMenu} />
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-100/20 to-transparent rounded-full -z-10 blur-3xl"></div>
        <div className="fixed top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100/10 to-transparent rounded-full -z-10 blur-3xl"></div>
      </main>
    </div>
  );
};

export default MainLayout;