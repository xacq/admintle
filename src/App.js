import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import DocentePerfil from "./docente/DocentePerfil";
import './index.css';
import Designaciones from './docente/Designaciones';
import HistorialDesignaciones from './docente/HistorialDesignaciones';
import ListaRegistros from './docente/ListaRegistros';
import Docente from './docente/Docente';
import DocenteConfig from './docente/DocenteConfig';
import HistorialEstudiante from './docente/HistorialEstudiante';
import BuscarEstudiantes from './docente/BuscarEstudiante';
import ListadoMaterias from './docente/ListadoMaterias';
import Notificaciones from './docente/Notificaciones';
import NotificacionesAnteriores from './docente/NotificacionesAnteriores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/perfil" element={<DocentePerfil />} />
        <Route path="/buscarestudiante" element={<BuscarEstudiantes/>} />
        <Route path="/designaciones" element={<Designaciones />} />
        <Route path="/docente" element={<Docente />} />
        <Route path="/docenteconfig" element={<DocenteConfig />} />
        <Route path="/historialdesignaciones" element={<HistorialDesignaciones/>} />
        <Route path="/historialestudiante" element={<HistorialEstudiante />} />
        <Route path="/listadomaterias" element={<ListadoMaterias />} />
        <Route path="/listaregistros" element={<ListaRegistros />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/notificacionesanteriores" element={<NotificacionesAnteriores />} />
      </Routes>
    </Router>
  );
}

export default App;