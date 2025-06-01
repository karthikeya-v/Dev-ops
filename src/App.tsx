import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './providers/AuthProvider';
import AuthGuard from './components/AuthGuard';
import LoginPage from './views/LoginPage';
import KanbanBoard from './views/KanbanBoard';
import ProjectsView from './views/ProjectsView';
import { Button } from './components/ui/Button';
const DependencyFlowView = lazy(() => import('./views/DependencyFlowView'));
const AIGenerationView = lazy(() => import('./views/AIGenerationView'));

// Placeholder for ProjectDetailView
const ProjectDetailViewPlaceholder = () => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-gray-700">Project Detail Page</h2>
    <p className="text-gray-600 mt-2">Iterations and work items for this project will be displayed here.</p>
  </div>
);

function Navigation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Workflow Dashboard
        </Link>
        <div className="space-x-2 flex items-center">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            Kanban
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            Projects
          </NavLink>
          <NavLink 
            to="/dependencies" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            Dependencies
          </NavLink>
          <NavLink 
            to="/ai-generation" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            AI Generation
          </NavLink>
          <Button onClick={handleLogout} variant="outline" className="text-sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-sky-100">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <Suspense fallback={<div className="text-center p-12 text-lg font-medium text-gray-600">Loading page...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<AuthGuard><KanbanBoard /></AuthGuard>} />
              <Route path="/projects" element={<AuthGuard><ProjectsView /></AuthGuard>} />
              <Route path="/projects/:projectId" element={<AuthGuard><ProjectDetailViewPlaceholder /></AuthGuard>} />
              <Route path="/dependencies" element={<AuthGuard><DependencyFlowView /></AuthGuard>} />
              <Route path="/ai-generation" element={<AuthGuard><AIGenerationView /></AuthGuard>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ToastContainer 
        position="bottom-right" 
        autoClose={4000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />
    </Router>
  );
}

export default App;
