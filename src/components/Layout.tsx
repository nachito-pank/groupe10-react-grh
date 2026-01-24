import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import {
  Users,
  Calendar,
  Clock,
  Award,
  GraduationCap,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  ChevronDown,
} from 'lucide-react';
import Logo from './Logo';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const { isMobile, isTablet, isAppleWatch } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'employe'] },
    { id: 'directory', label: 'Annuaire', icon: Users, roles: ['admin'] },
    { id: 'leaves', label: 'Congés', icon: Calendar, roles: ['admin', 'employe'] },
    { id: 'attendance', label: 'Présences', icon: Clock, roles: ['admin', 'employe'] },
    { id: 'performance', label: 'Évaluations', icon: Award, roles: ['admin', 'employe'] },
    { id: 'training', label: 'Formations', icon: GraduationCap, roles: ['admin', 'employe'] },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, roles: ['admin'] },
    { id: 'divider', label: '', icon: null, roles: ['admin'] },
    { id: 'employees', label: 'Gestion employés', icon: Users, roles: ['admin'] },
    { id: 'services', label: 'Gestion services', icon: Building2, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || 'employe')
  );

  const handleLogout = async () => {
    await logout();
  };

  // Pour Apple Watch, afficher une navigation ultra-compacte
  if (isAppleWatch) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
          <div className="px-2 py-2">
            <div className="flex justify-between items-center">
              <Logo size="xs" showText={false} variant="light" />
              <button
                onClick={handleLogout}
                className="p-1 text-gray-400 hover:text-white rounded text-xs"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-gray-400 truncate">{user?.name}</p>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-2">
          {children}
        </main>

        <nav className="bg-gray-800 border-t border-gray-700 sticky bottom-0">
          <div className="grid grid-cols-3 gap-1 p-1">
            {filteredMenuItems.slice(0, 3).map((item) => {
              if (item.id === 'divider') return null;
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`p-1.5 rounded text-xs flex flex-col items-center gap-0.5 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Icon className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header - Ultra responsive */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 shadow-sm">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-14 xs:h-16 sm:h-16 md:h-16">
            {/* Left section with menu button and logo */}
            <div className="flex items-center gap-2 xs:gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 xs:w-6 xs:h-6" />
                ) : (
                  <Menu className="w-5 h-5 xs:w-6 xs:h-6" />
                )}
              </button>
              <Logo size="sm" showText={false} variant="dark" />
              <h1 className="text-lg-fluid font-bold text-gray-800 hidden md:inline">
                Gestion RH
              </h1>
              <h1 className="text-lg-fluid font-bold text-gray-800 inline md:hidden">
                GRH
              </h1>
            </div>

            {/* Right section with user info and logout */}
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 min-w-0">
              <div className="text-right hidden xs:block">
                <p className="text-xs-fluid xs:text-sm-fluid font-medium text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 xs:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 xs:w-5 xs:h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Layout wrapper */}
      <div className="flex pt-14 xs:pt-16 sm:pt-16 md:pt-16">
        {/* Sidebar - Hidden on mobile, shown on larger screens */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20 w-56 sm:w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out pt-14 xs:pt-16 sm:pt-16 md:pt-16 lg:pt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-2 xs:p-3 sm:p-4 space-y-1 overflow-y-auto h-[calc(100vh-theme(height.16))] lg:h-auto">
            {filteredMenuItems.map((item) => {
              if (item.id === 'divider') {
                return <div key="divider" className="border-t border-gray-200 my-2 xs:my-3" />;
              }
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-4 py-2 xs:py-3 rounded-lg transition-all
                    text-xs-fluid xs:text-sm-fluid font-medium
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-theme(height.16))] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
