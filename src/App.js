import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
<<<<<<< HEAD
import DocentePerfil from "./tutor/DocentePerfil";
import './index.css';
import Designaciones from './tutor/Designaciones';
import HistorialDesignaciones from './tutor/HistorialDesignaciones';
import ListaRegistros from './tutor/ListaRegistros';
import Docente from './tutor/Docente';
import DocenteConfig from './tutor/DocenteConfig';
import HistorialEstudiante from './tutor/HistorialEstudiante';
import BuscarEstudiantes from './tutor/BuscarEstudiante';
import ListadoMaterias from './tutor/ListadoMaterias';
import Notificaciones from './tutor/Notificaciones';
import NotificacionesAnteriores from './tutor/NotificacionesAnteriores';
import ArchivoHistorico from './admin/ArchivoHistorico';
import CentroNotificaciones from './admin/CentroNotificaciones';
import CentroSoporte from './admin/CentroSoporte';
import FormBeca from './admin/FormBecas';
import GeneracionReportes from './admin/GeneracionReportes';
import ListaBecas from './admin/ListaBecas';
import EvaluadorDesempeno from './director/EvaluacionDesempeno';
import PanelAuditoria from './admin/PanelAuditoria';
import PanelConfiguracion from './admin/PanelConfiguracion';
import ReportesAvance from './becario/ReportesAvance';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardAdmin from "./admin/DashboardAdmin";
import DashboardDirector from "./director/DashboardDirector";
import DashboardBecario from "./becario/DashboardBecario";
import DashboardTutor from "./tutor/DashboardTutor";
import SubirReporte from "./becario/SubirReporte";
import Observaciones from "./becario/Observaciones";
import Calificaciones from "./becario/Calificaciones";
=======
import DocentePerfil from "./docente/DocentePerfil";
import "./index.css";
import Designaciones from "./docente/Designaciones";
import HistorialDesignaciones from "./docente/HistorialDesignaciones";
import ListaRegistros from "./docente/ListaRegistros";
import Docente from "./docente/Docente";
import DocenteConfig from "./docente/DocenteConfig";
import HistorialEstudiante from "./docente/HistorialEstudiante";
import BuscarEstudiantes from "./docente/BuscarEstudiante";
import ListadoMaterias from "./docente/ListadoMaterias";
import Notificaciones from "./docente/Notificaciones";
import NotificacionesAnteriores from "./docente/NotificacionesAnteriores";
import DashoboardTutor from "./dashboards/DashoboardTutor";
import DashoboardBecario from "./dashboards/DashoboardBecario";
import DashoboardAdmin from "./dashboards/DashoboardAdmin";
import DashoboardDirector from "./dashboards/DashoboardDirector";
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/perfil" element={<DocentePerfil />} />
<<<<<<< HEAD
        <Route path="/buscarestudiante" element={<BuscarEstudiantes/>} />
        <Route path="/designaciones" element={<Designaciones />} />
        <Route path="/docente" element={<Docente />} />
        <Route path="/docenteconfig" element={<DocenteConfig />} />
        <Route path="/historialdesignaciones" element={<HistorialDesignaciones/>} />
=======
        <Route path="/buscarestudiante" element={<BuscarEstudiantes />} />
        <Route path="/designaciones" element={<Designaciones />} />
        <Route path="/docente" element={<Docente />} />
        <Route path="/docenteconfig" element={<DocenteConfig />} />
        <Route path="/historialdesignaciones" element={<HistorialDesignaciones />} />
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b
        <Route path="/historialestudiante" element={<HistorialEstudiante />} />
        <Route path="/listadomaterias" element={<ListadoMaterias />} />
        <Route path="/listaregistros" element={<ListaRegistros />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/notificacionesanteriores" element={<NotificacionesAnteriores />} />
<<<<<<< HEAD

        <Route path="/archivoshistoricos" element={<ArchivoHistorico />} />
        <Route path="/centronotificaciones" element={<CentroNotificaciones />} />
        <Route path="/centrosoporte" element={<CentroSoporte />} />
        <Route path="/formbeca" element={<FormBeca />} />
        <Route path="/generacionreportes" element={<GeneracionReportes />} />
        <Route path="/listabecas" element={<ListaBecas />} />
        <Route path="/evaluadordesempeno" element={<EvaluadorDesempeno />} />
        <Route path="/panelauditoria" element={<PanelAuditoria />} />
        <Route path="/panelconfiguracion" element={<PanelConfiguracion />} />
        <Route path="/reportesavance" element={<ReportesAvance />} />
        <Route path="/subirreporte" element ={<SubirReporte />} />
        <Route path="/observaciones" element={<Observaciones />} />
        <Route path="/calificaciones" element={<Calificaciones />} />

        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/dashboarddirector" element={<DashboardDirector />} />
        <Route path="/dashboardbecario" element={<DashboardBecario />} />
        <Route path="/dashboardtutor" element={<DashboardTutor />} />
       
=======
        <Route path="/dashboard/tutor" element={<DashoboardTutor />} />
        <Route path="/dashboard/becario" element={<DashoboardBecario />} />
        <Route path="/dashboard/admin" element={<DashoboardAdmin />} />
        <Route path="/dashboard/director" element={<DashoboardDirector />} />
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b
      </Routes>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> f479927a0665b9937dade86cff0763858ccffa3b
