import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // OJO: Usamos sessionStorage
  const isAuth = sessionStorage.getItem('token_taller'); 

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;