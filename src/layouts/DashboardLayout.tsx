import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="dashboard-layout">
      <aside>
        <h2>Portal do Professor</h2>
        <nav>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            📊 Dashboard
          </Link>
          <Link to="/alunos" className={isActive('/alunos') ? 'active' : ''}>
            👥 Alunos
          </Link>
          <Link to="/turmas" className={isActive('/turmas') ? 'active' : ''}>
            📚 Turmas
          </Link>
          <Link to="/avaliacoes" className={isActive('/avaliacoes') ? 'active' : ''}>
            📝 Avaliações
          </Link>
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f0f0f0', marginTop: 'auto' }}>
          {user && (
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
              {user.name}
            </p>
          )}
          <button onClick={handleLogout}>🚪 Sair</button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
