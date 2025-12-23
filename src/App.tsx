import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeDirectory from './components/EmployeeDirectory';
import LeaveManagement from './components/LeaveManagement';
import AttendanceTracking from './components/AttendanceTracking';
import PerformanceReview from './components/PerformanceReview';
import TrainingManagement from './components/TrainingManagement';
import Statistics from './components/Statistics';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'landing') {
      return <LandingPage onNavigate={(view) => setAuthView(view)} />;
    }
    if (authView === 'login') {
      return <LoginForm onSwitchToRegister={() => setAuthView('register')} />;
    }
    if (authView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setAuthView('login')} />;
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'directory':
        return <EmployeeDirectory />;
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
        return <Dashboard />;
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
