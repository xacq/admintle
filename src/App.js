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
import EvaluacionFinalForm from "./docente/EvaluacionFinalForm";
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
import ConfiguracionSistema from './admin/ConfiguracionSistema';
import ReportesAvance from './becario/ReportesAvance';
import SubirReporte from "./becario/SubirReporte";
import Observaciones from "./becario/Observaciones";
import Calificaciones from "./becario/Calificaciones";
import RevisarReportes from "./tutor/RevisarReportes";
import EvaluacionFinal from "./tutor/EvaluacionFinal";
import HistorialBecas from "./admin/HistorialBecas";
import DetalleBeca from "./admin/DetalleBeca";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <DocentePerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscarestudiante"
          element={
            <ProtectedRoute>
              <BuscarEstudiantes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designaciones"
          element={
            <ProtectedRoute>
              <Designaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente"
          element={
            <ProtectedRoute>
              <Docente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docenteconfig"
          element={
            <ProtectedRoute>
              <DocenteConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historialdesignaciones"
          element={
            <ProtectedRoute>
              <HistorialDesignaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historialestudiante"
          element={
            <ProtectedRoute>
              <HistorialEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listadomaterias"
          element={
            <ProtectedRoute>
              <ListadoMaterias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listaregistros"
          element={
            <ProtectedRoute>
              <ListaRegistros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute>
              <Notificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificacionesanteriores"
          element={
            <ProtectedRoute>
              <NotificacionesAnteriores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute>
              <DashboardTutor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/becario"
          element={
            <ProtectedRoute>
              <DashboardBecario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/director"
          element={
            <ProtectedRoute>
              <DashboardDirector />
            </ProtectedRoute>
          }
        />


        <Route
          path="/archivoshistoricos"
          element={
            <ProtectedRoute>
              <ArchivoHistorico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/centronotificaciones"
          element={
            <ProtectedRoute>
              <CentroNotificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/centrosoporte"
          element={
            <ProtectedRoute>
              <CentroSoporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formbeca"
          element={
            <ProtectedRoute>
              <FormBeca />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generacionreportes"
          element={
            <ProtectedRoute>
              <GeneracionReportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluacionfinal"
          element={
            <ProtectedRoute>
              <EvaluacionFinal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluadordesempeno"
          element={
            <ProtectedRoute>
              <EvaluadorDesempeno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panelauditoria"
          element={
            <ProtectedRoute>
              <PanelAuditoria />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panelconfiguracion"
          element={
            <ProtectedRoute>
              <PanelConfiguracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion-sistema"
          element={
            <ProtectedRoute>
              <ConfiguracionSistema />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportesavance"
          element={
            <ProtectedRoute>
              <ReportesAvance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subirreporte"
          element={
            <ProtectedRoute>
              <SubirReporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/observaciones"
          element={
            <ProtectedRoute>
              <Observaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calificaciones"
          element={
            <ProtectedRoute>
              <Calificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listabecas"
          element={
            <ProtectedRoute>
              <ListaBecas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revisarreportes"
          element={
            <ProtectedRoute>
              <RevisarReportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluacionfinal"
          element={
            <ProtectedRoute>
              <EvaluacionFinalForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historialbeca"
          element={
            <ProtectedRoute>
              <HistorialBecas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detallebeca/:becaId"
          element={
            <ProtectedRoute>
              <DetalleBeca />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
