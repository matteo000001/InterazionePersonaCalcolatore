import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole } from '@exam-planner/shared-types';
import { api } from '../api';
import { getAccessToken } from '../auth/auth.api';
import { SecretaryAppointmentsSearchPage } from './secretary-appointments-search.page';
import { SecretaryDegreeProgramsPage } from './secretary-degree-programs.page';
import { SecretaryHomePage } from './secretary-home.page';
import { SecretarySubjectsPage } from './secretary-subjects.page';
import { SecretaryMenuItem } from './secretary-dashboard.types';
import { SecretaryUsersPage } from './secretary-users.page';

export function SecretaryDashboard() {
  const navigate = useNavigate();
  const token = getAccessToken();
  const [user, setUser] = useState<User | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<SecretaryMenuItem>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      setLoading(true);
      setError(null);

      try {
        const me = await api.getMe(token);
        setUser(me);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Caricamento fallito');
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentUser();
  }, [token]);

  function renderSelectedPage() {
    if (selectedMenuItem === 'home') {
      return <SecretaryHomePage />;
    }

    if (selectedMenuItem === 'users') {
      return <SecretaryUsersPage currentUserId={user?.id} />;
    }

    if (selectedMenuItem === 'subjects') {
      return <SecretarySubjectsPage />;
    }

    if (selectedMenuItem === 'appointments') {
      return <SecretaryAppointmentsSearchPage />;
    }

    return <SecretaryDegreeProgramsPage />;
  }

  if (loading) {
    return <main className="app-shell loading-screen">Caricamento in corso...</main>;
  }

  if (user?.role === UserRole.TEACHER) {
    return <Navigate to="/teacher" replace />;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-card">
          <div className="summary-row">
            <span>Utente</span>
            <strong>{user?.name ?? 'Segreteria'}</strong>
          </div>

          <div className="inline-actions">
            <button
              type="button"
              className={selectedMenuItem === 'home' ? 'primary' : 'secondary'}
              onClick={() => setSelectedMenuItem('home')}
            >
              Pagina iniziale
            </button>
            <button
              type="button"
              className={selectedMenuItem === 'users' ? 'primary' : 'secondary'}
              onClick={() => setSelectedMenuItem('users')}
            >
              Utenti
            </button>
            <button
              type="button"
              className={selectedMenuItem === 'subjects' ? 'primary' : 'secondary'}
              onClick={() => setSelectedMenuItem('subjects')}
            >
              Materie
            </button>
            <button
              type="button"
              className={
                selectedMenuItem === 'degree-programs' ? 'primary' : 'secondary'
              }
              onClick={() => setSelectedMenuItem('degree-programs')}
            >
              Corsi di laurea
            </button>
            <button
              type="button"
              className={
                selectedMenuItem === 'appointments' ? 'primary' : 'secondary'
              }
              onClick={() => setSelectedMenuItem('appointments')}
            >
              Visualizza appelli
            </button>
          </div>

          <button
            type="button"
            className="secondary"
            onClick={() => navigate('/logout')}
          >
            Esci
          </button>

          <div className="summary-row">
            <span>Documentazione API</span>
            <a href="http://localhost:3333/api/docs" target="_blank" rel="noreferrer">
              http://localhost:3333/api/docs
            </a>
          </div>
        </div>
      </section>

      {error ? <div className="alert error">{error}</div> : null}
      {renderSelectedPage()}
    </main>
  );
}
