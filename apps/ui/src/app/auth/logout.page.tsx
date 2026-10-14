import { Navigate } from 'react-router-dom';
import { logout } from './auth.api';

export function LogoutPage() {
  logout();

  return <Navigate to="/login" replace />;
}
