import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
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
       
      </Routes>
    </Router>
  );
}

export default App;