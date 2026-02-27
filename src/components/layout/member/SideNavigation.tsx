import { ChevronLeft, ChevronRight, Menu, X} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuSections } from '../../../utils/menu';

type SideNavigationProps = {
    readonly isMobileMenuOpen: boolean;
    readonly setIsMobileMenuOpen: (open: boolean) => void;
}

export default function SideNavigation({ isMobileMenuOpen, setIsMobileMenuOpen }: SideNavigationProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (view: string) => {
    onNavigateView(view);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const onNavigateView = (view: string) => {
    let path = menuSections.flatMap(section => section.items).find(item => item.id === view)?.path;
    if (path) {
      navigate(path);
    }
  }

  return (
    <>
      {/* {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 bg-blue-900 text-white p-3 rounded-lg shadow-lg hover:bg-blue-800 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )} */}

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && isCollapsed ? 'w-16' : 'w-64'}
          bg-blue-900 text-white h-screen transition-all duration-300 flex flex-col
        `}
      >
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white hover:bg-blue-800 p-2 rounded-lg transition-colors md:hidden"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-blue-900 text-white rounded-full p-1 hover:bg-blue-800 transition-colors z-10 border border-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        <div className="flex-1 overflow-y-auto py-6 mt-12 md:mt-0">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-6 text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-800 transition-colors ${isActive ? 'bg-blue-800 border-l-4 border-blue-400' : ''
                        }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!isCollapsed && (
          <div className="p-6 border-t border-blue-800">
            <p className="text-xs text-blue-300">Construction Management</p>
            <p className="text-xs text-blue-400 mt-1">v1.0.0</p>
          </div>
        )}
      </div>
    </>
  );
}
