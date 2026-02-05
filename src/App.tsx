import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "./components/screens/LoginScreen";
import SignupScreen from "./components/screens/SignupScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/screens/Dashboard";
import PublicRoute from "./routes/PublicRoute";
import ProjectCreateWizard from "./components/screens/ProjectCreateWizard";
import OnboardingScreen from "./components/screens/OnboardingScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/signup" element={
          <PublicRoute><SignupScreen /></PublicRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/create/:projectId?"
          element={
            <ProtectedRoute>
              <ProjectCreateWizard />
            </ProtectedRoute>
          }
        />
        <Route path="/tour" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

