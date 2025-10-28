import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserSession, saveUserSession } from "../utils/session";

const useAuthenticatedUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationUser = location.state?.user;
  const [user, setUser] = useState(() => locationUser ?? getUserSession());

  useEffect(() => {
    if (locationUser) {
      saveUserSession(locationUser);
      setUser(locationUser);
    }
  }, [locationUser]);

  useEffect(() => {
    if (!user) {
      const stored = getUserSession();
      if (stored) {
        setUser(stored);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  return user;
};

export default useAuthenticatedUser;
