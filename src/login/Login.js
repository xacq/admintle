import logo from '../assets/universidad.png';
import locked from '../assets/locked-padlock.png';
import { useNavigate } from "react-router-dom";
import '../App.css';

function Login() {

const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/perfil");
  };

  return (
    <div className="App">
      <header className="App-header">
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
    </div>
  );
}

export default Login;
