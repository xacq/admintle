<<<<<<< HEAD
import logo from '../assets/universidad.png';
import locked from '../assets/locked-padlock.png';
import { useNavigate } from "react-router-dom";
import '../App.css';

function Login() {

const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/listaregistros");
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/universidad.png";
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
      navigate(payload.dashboardRoute, { state: { user: payload } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b
  };

  return (
    <div className="App">
      <header className="App-header">
<<<<<<< HEAD
        <img src={logo} className='logo_universidad'/>
       <h1>DEPARTAMENTO PERSONAL DE DOCENTE</h1>
      </header>

      <div className='l_container'>

       <div className='login'>
        <div className='content_login'>
          <h3>SISTEMA ODISEO</h3>
          <h5>UNIVERSIDAD AUTÓNOMA "TOMÁS FRÍAS"</h5>

        <div className='data_content'>

          <div className='text_input'>
            <span className='material-symbols-outlined icon_login'>account_circle</span> 
            <input type='text' placeholder='USUARIO' className='login_input' />
          </div>

          <div className='text_input'>
            <span class="material-symbols-outlined icon_login">lock</span>
            <input type='password' placeholder='CONTRASEÑA'  className='login_input' /> 
          </div>
          
          <a href='#'>RECORDAR</a> 
        </div>

        <div className='button_container'>
          <button className='button_login' onClick={handleLogin}>INGRESAR</button>
        </div>
      </div>

      <div className='container_locked'>
           <img src={locked} className='locked_img'/>
      </div>

      </div> 
    </div>
=======
        <img src={logo} className="logo_universidad" alt="Logo universidad" />
        <h1>DEPARTAMENTO PERSONAL DE DOCENTE</h1>
      </header>

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

              <a href="#">RECORDAR</a>

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
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b
    </div>
  );
}

export default Login;
