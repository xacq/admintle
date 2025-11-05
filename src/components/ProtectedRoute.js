import { Navigate, useLocation } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useSessionUser();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
