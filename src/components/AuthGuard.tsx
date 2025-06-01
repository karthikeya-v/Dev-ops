import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'react-hot-toast';

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please sign in to continue');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div>Loading authentication...</div>;
  if (!user) return null;

  return children;
}
