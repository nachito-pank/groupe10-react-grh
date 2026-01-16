import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Settings,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'employe'] },
    { id: 'directory', label: 'Annuaire', icon: Users, roles: ['admin', 'employe'] },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-800">
                Gestion RH
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out pt-16 lg:pt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1">
            {filteredMenuItems.map((item) => {
              if (item.id === 'divider') {
                return <div key="divider" className="border-t border-gray-200 my-2" />;
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
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
