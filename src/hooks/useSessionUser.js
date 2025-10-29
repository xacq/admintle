import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = 'sessionUser';

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('No se pudo leer la sesión almacenada', error);
    return null;
  }
};

const useSessionUser = () => {
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState(() => readStoredUser());
  const userFromState = location.state?.user;

  useEffect(() => {
    if (!userFromState) {
      return;
    }

    setSessionUser(userFromState);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(userFromState));
    }
  }, [userFromState]);

  return sessionUser;
};

export const clearSessionUser = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
};

export default useSessionUser;
