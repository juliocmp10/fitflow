import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import PlanDetails from './pages/PlanDetails';
import CreatePlan from './pages/CreatePlan';
import ActiveSession from './pages/ActiveSession';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated, plans } = useStore();

  // Logic: If the user has created at least one plan, they have completed onboarding.
  const hasCompletedOnboarding = plans.length > 0;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute>
          {hasCompletedOnboarding ? <Layout /> : <Navigate to="/onboarding" />}
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="create-plan" element={<CreatePlan />} />
        <Route path="plan/:planId" element={<PlanDetails />} />
        <Route path="exercises" element={<ExerciseLibrary />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/session/:planId/:dayId" element={
        <ProtectedRoute>
          <ActiveSession />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
}

export default App;