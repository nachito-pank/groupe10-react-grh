import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmployeeManagement from './components/EmployeeManagement';
import ServiceManagement from './components/ServiceManagement';
import LeaveManagement from './components/LeaveManagement';
import AttendanceTracking from './components/AttendanceTracking';
import PerformanceReview from './components/PerformanceReview';
import TrainingManagement from './components/TrainingManagement';
import Statistics from './components/Statistics';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Security from './components/Security';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Cookies from './components/Cookies';

function AppContent() {
  const { user, isAdmin, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const { currentPage, navigateTo } = useNavigation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Handle page routing - Show info pages when not logged in
  if (!user) {
    const infoPages: { [key: string]: React.ReactNode } = {
      'features': <Features />,
      'pricing': <Pricing />,
      'security': <Security />,
      'about': <About />,
      'blog': <Blog />,
      'contact': <Contact />,
      'terms': <Terms />,
      'privacy': <Privacy />,
      'cookies': <Cookies />,
    };

    if (infoPages[currentPage]) {
      return infoPages[currentPage];
    }

    if (authView === 'landing') {
      return <LandingPage onNavigate={(view) => setAuthView(view)} />;
    }
    if (authView === 'login') {
      return <LoginForm onSwitchToRegister={() => setAuthView('register')} onSwitchToLanding={() => setAuthView('landing')} />;
    }
    if (authView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setAuthView('login')} onSwitchToLanding={() => setAuthView('landing')} />;
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
      case 'directory':
        return <EmployeeDirectory />;
      case 'employees':
        return <EmployeeManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'leaves':
        return <LeaveManagement />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'performance':
        return <PerformanceReview />;
      case 'training':
        return <TrainingManagement />;
      case 'statistics':
        return <Statistics />;
      default:
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
