import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getAccessToken } from './auth.api';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return getAccessToken() ? children : <Navigate to="/login" replace />;
}
