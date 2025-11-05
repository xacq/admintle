import logo from '../assets/universidad.png';
import '../App.css';

function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="logo_universidad" alt="Logo universidad" />
      <h1>DEPARTAMENTO PERSONAL DE DOCENTE</h1>
    </header>
  );
}

export default Header;
