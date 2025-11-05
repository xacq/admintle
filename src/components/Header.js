import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/universidad.png';
import useSessionUser, { clearSessionUser } from '../hooks/useSessionUser';
import '../App.css';

function Header() {
  const navigate = useNavigate();
  const sessionUser = useSessionUser();

  const handleLogout = useCallback(() => {
    clearSessionUser();
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <header className="App-header">
      <img src={logo} className="logo_universidad" alt="Logo universidad" />
      <h1>DEPARTAMENTO PERSONAL DE DOCENTE</h1>
      {sessionUser ? (
        <button type="button" className="header_logout_button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      ) : null}
    </header>
  );
}

export default Header;
