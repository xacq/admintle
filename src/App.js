import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
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
import DashboardTutor from "./dashboards/DashboardTutor";
import DashboardBecario from "./dashboards/DashboardBecario";
import DashboardAdmin from "./dashboards/DashboardAdmin";
import DashboardDirector from "./dashboards/DashboardDirector";
import 'bootstrap/dist/css/bootstrap.min.css';


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
import SubirReporte from "./becario/SubirReporte";
import Observaciones from "./becario/Observaciones";
import Calificaciones from "./becario/Calificaciones";
import RevisarReportes from "./tutor/RevisarReportes";
import EvaluacionFinal from "./tutor/EvaluacionFinal";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/perfil" element={<DocentePerfil />} />
        <Route path="/buscarestudiante" element={<BuscarEstudiantes />} />
        <Route path="/designaciones" element={<Designaciones />} />
        <Route path="/docente" element={<Docente />} />
        <Route path="/docenteconfig" element={<DocenteConfig />} />
        <Route path="/historialdesignaciones" element={<HistorialDesignaciones />} />
        <Route path="/historialestudiante" element={<HistorialEstudiante />} />
        <Route path="/listadomaterias" element={<ListadoMaterias />} />
        <Route path="/listaregistros" element={<ListaRegistros />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/notificacionesanteriores" element={<NotificacionesAnteriores />} />
        <Route path="/dashboard/tutor" element={<DashboardTutor />} />
        <Route path="/dashboard/becario" element={<DashboardBecario />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/director" element={<DashboardDirector />} />


        <Route path="/archivoshistoricos" element={<ArchivoHistorico />} />
        <Route path="/centronotificaciones" element={<CentroNotificaciones />} />
        <Route path="/centrosoporte" element={<CentroSoporte />} />
        <Route path="/formbeca" element={<FormBeca />} />
        <Route path="/generacionreportes" element={<GeneracionReportes />} />
        <Route path="/evaluacionfinal" element={<EvaluacionFinal />} />

        <Route path="/evaluadordesempeno" element={<EvaluadorDesempeno />} />
        <Route path="/panelauditoria" element={<PanelAuditoria />} />
        <Route path="/panelconfiguracion" element={<PanelConfiguracion />} />
        <Route path="/reportesavance" element={<ReportesAvance />} />
        <Route path="/subirreporte" element ={<SubirReporte />} />
        <Route path="/observaciones" element={<Observaciones />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/listabecas" element={<ListaBecas />} />
        <Route path="/revisarreportes" element={<RevisarReportes/>} />
      </Routes>
    </Router>
  );
}

export default App;
