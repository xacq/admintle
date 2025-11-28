import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import locked from "../assets/locked-padlock.png";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let message = "No se pudo iniciar sesión.";

        try {
          const payload = await response.json();
          message =
            payload?.message ||
            payload?.errors?.username?.[0] ||
            payload?.errors?.password?.[0] ||
            message;
        } catch (parseError) {
          // Ignorar errores de parseo y usar el mensaje por defecto.
        }

        throw new Error(message);
      }

      const payload = await response.json();

      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("sessionUser", JSON.stringify(payload));
        } catch (storageError) {
          console.error("No se pudo guardar la sesión del usuario", storageError);
        }
      }

      navigate(payload.dashboardRoute, { state: { user: payload } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="l_container">
        <div className="login">
          <div className="content_login">
            <h3>SISTEMA ODISEO</h3>
            <h5>UNIVERSIDAD AUTÓNOMA "TOMÁS FRÍAS"</h5>

            <form className="data_content" onSubmit={handleLogin}>
              <div className="text_input">
                <span className="material-symbols-outlined icon_login">account_circle</span>
                <input
                  type="text"
                  placeholder="USUARIO"
                  className="login_input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="text_input">
                <span className="material-symbols-outlined icon_login">lock</span>
                <input
                  type="password"
                  placeholder="CONTRASEÑA"
                  className="login_input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="button" className="link-button" disabled>
                RECORDAR
              </button>

              <div className="button_container">
                <button className="button_login" type="submit" disabled={submitting}>
                  {submitting ? "INGRESANDO..." : "INGRESAR"}
                </button>
              </div>

              {error && <p className="login_error">{error}</p>}
            </form>
          </div>

          <div className="container_locked">
            <img src={locked} className="locked_img" alt="Candado" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
