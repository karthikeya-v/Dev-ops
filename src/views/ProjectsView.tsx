import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Project, ProjectCreate } from '../types/Project';
import { createProject, getProjects, updateProject, deleteProject } from '../api/projectsApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { cn } from '../lib/utils';

const ProjectsView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.user) {
      setError('You must be logged in to create a project.');
      return;
    }
    if (!newProjectName.trim()) {
      setError('Project name is required.');
      return;
    }
    const projectData: ProjectCreate = {
      name: newProjectName,
      description: newProjectDescription || undefined,
      owner_id: user.user.id,
    };
    try {
      const newProject = await createProject(projectData);
      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project.');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description || '');
    setShowCreateForm(false); // Hide create form if open
  };

  const handleUpdateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (!editProjectName.trim()) {
      setError('Project name is required for update.');
      return;
    }
    try {
      const updated = await updateProject(editingProject.id, {
        name: editProjectName,
        description: editProjectDescription || undefined,
      });
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null);
      setError(null);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project and all its data?')) {
      return;
    }
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project.');
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading projects...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => { setShowCreateForm(true); setEditingProject(null); }}>Create New Project</Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {(showCreateForm || editingProject) && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <div>
              <Label htmlFor={editingProject ? "editProjectName" : "newProjectName"}>Project Name</Label>
              <Input
                id={editingProject ? "editProjectName" : "newProjectName"}
                type="text"
                value={editingProject ? editProjectName : newProjectName}
                onChange={(e) => editingProject ? setEditProjectName(e.target.value) : setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor={editingProject ? "editProjectDescription" : "newProjectDescription"}>Description (Optional)</Label>
              <textarea
                id={editingProject ? "editProjectDescription" : "newProjectDescription"}
                value={editingProject ? editProjectDescription : newProjectDescription}
                onChange={(e) => editingProject ? setEditProjectDescription(e.target.value) : setNewProjectDescription(e.target.value)}
                placeholder="Enter project description"
                rows={3}
                className={cn(
                  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                  'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg mt-1'
                )}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={() => { setShowCreateForm(false); setEditingProject(null); setError(null); }}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                {editingProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 && !isLoading && !showCreateForm && !editingProject && (
        <p className="text-center text-gray-500 py-8">No projects found. Get started by creating one!</p>
      )}

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/projects/${project.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {project.name}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{project.description || 'No description'}</p>
                <p className="text-xs text-gray-400 mt-2">Created: {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2 mt-1">
                <Button variant="outline" onClick={() => handleEditProject(project)}>Edit</Button>
                <Button variant="ghost" className="text-red-600 hover:bg-red-100" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView; 