const STORAGE_KEY = 'admintle:user';

export const saveUserSession = (user) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    // Ignorar almacenamiento no disponible (modo privado, etc.).
  }
};

export const getUserSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearUserSession = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignorar almacenamiento no disponible.
  }
};
