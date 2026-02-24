import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./components/screens/LoginScreen";
import SignupScreen from "./components/screens/SignupScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/screens/Dashboard";
import PublicRoute from "./routes/PublicRoute";
import ProjectCreateWizard from "./components/screens/ProjectCreateWizard";
import OnboardingScreen from "./components/screens/OnboardingScreen";
import { Template } from "./components/layout/member/Template";
import QuickRemediesScreen from "./components/screens/QuickRemediesScreen";
import RecentProjectsScreen from "./components/screens/RecentProjectsScreen";
import ProjectViewScreen from "./components/screens/ProjectViewScreen";
import ProjectTasks from "./components/screens/ProjectTasks";

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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/project/create/:projectId?" element={
          <ProtectedRoute>
            <ProjectCreateWizard />
          </ProtectedRoute>
        }
        />
        <Route path="/projects" element={
          <ProtectedRoute><Template content={<RecentProjectsScreen />} /></ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <Template content={<ProjectViewScreen />} />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute><Template content={<ProjectTasks />} /></ProtectedRoute>
        }
        />
        <Route path="/quick-remedies" element={
          <ProtectedRoute><Template content={<QuickRemediesScreen />} /></ProtectedRoute>
        }
        />

        <Route path="/tour" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

