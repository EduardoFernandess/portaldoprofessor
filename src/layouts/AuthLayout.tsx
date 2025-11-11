import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export const AuthLayout = () => (
  <div className="auth-layout">
    <Outlet />
  </div>
);
