// src/components/PanelConfiguracion.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Nav,
  Tab,
  Badge,
  Alert,
  ListGroup,
  Modal,
  Spinner,
} from 'react-bootstrap';
import Header from '../components/Header';
import './admin.css';

const PanelConfiguracion = () => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioForm, setUsuarioForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    roleId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [usuarioAccionId, setUsuarioAccionId] = useState(null);
  const [usuarioEliminandoId, setUsuarioEliminandoId] = useState(null);
  const [parametros, setParametros] = useState({
    academicYear: '',
    managementStartDate: '',
    managementEndDate: '',
    reportDeadline: '',
    maxReportsPerScholar: 0,
    systemStatus: 'activo',
    researchLines: [],
  });
  const [parametrosIniciales, setParametrosIniciales] = useState(null);
  const [lineasInvestigacion, setLineasInvestigacion] = useState('');
  const [parametrosLoading, setParametrosLoading] = useState(true);
  const [parametrosError, setParametrosError] = useState('');
  const [parametrosSaving, setParametrosSaving] = useState(false);
  const [parametrosFeedback, setParametrosFeedback] = useState(null);

  const rolesDisponibles = useMemo(() => {
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles
      .map((rol) => {
        const derivedId =
          rol?.id ?? rol?.ID ?? rol?.uuid ?? rol?.slug ?? rol?.name ?? rol?.displayName ?? rol?.nombre;

        if (derivedId == null) {
          return null;
        }

        return {
          id: String(derivedId),
          nombre: rol?.displayName ?? rol?.name ?? rol?.nombre ?? 'Rol sin nombre',
          descripcion: rol?.description ?? rol?.descripcion ?? 'Sin descripción disponible',
        };
      })
      .filter(Boolean);
  }, [roles]);

  // --- MANEJADORES DE EVENTOS ---
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const cargarUsuarios = async () => {
    setUsuariosLoading(true);
    setUsuariosError(null);

    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de usuarios');
      }

      const data = await response.json();
      setUsuarios(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      setUsuariosError(error.message);
    } finally {
      setUsuariosLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de roles');
      }

      const data = await response.json();
      setRoles(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'danger', message: error.message });
    }
  };

  const cargarParametros = async () => {
    setParametrosLoading(true);
    setParametrosError('');

    try {
      const response = await fetch('/api/system-parameters');
      if (!response.ok) {
        throw new Error('No se pudo cargar los parámetros del sistema');
      }

      const payload = await response.json();
      const data = payload?.data ?? {};

      const parsedParametros = {
        academicYear: data.academicYear ?? '',
        managementStartDate: data.managementStartDate ?? '',
        managementEndDate: data.managementEndDate ?? '',
        reportDeadline: data.reportDeadline ?? '',
        maxReportsPerScholar: data.maxReportsPerScholar ?? 0,
        systemStatus: data.systemStatus ?? 'activo',
        researchLines: Array.isArray(data.researchLines) ? data.researchLines : [],
      };

      setParametros({
        ...parsedParametros,
        researchLines: [...parsedParametros.researchLines],
      });
      setParametrosIniciales({
        ...parsedParametros,
        researchLines: [...parsedParametros.researchLines],
      });
      setLineasInvestigacion(parsedParametros.researchLines.join('\n'));
    } catch (error) {
      console.error(error);
      setParametrosError(error.message);
    } finally {
      setParametrosLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
    cargarParametros();
  }, []);

  const handleCambiarEstadoUsuario = async (id) => {
    setUsuarioAccionId(id);
    setFeedback(null);

    try {
      const response = await fetch(`/api/users/${id}/toggle`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado del usuario');
      }

      const data = await response.json();
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) => (usuario.id === id ? data.data : usuario))
      );
      setFeedback({ type: 'success', message: 'Estado del usuario actualizado correctamente.' });
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'danger', message: error.message });
    } finally {
      setUsuarioAccionId(null);
    }
  };

  const handleResetPassword = (id) => {
    alert(`Restableciendo contraseña para usuario ID: ${id} (simulación)`);
  };

  const handleActualizarParametros = async (event) => {
    event.preventDefault();

    setParametrosFeedback(null);
    setParametrosSaving(true);

    const maxReports = Number.parseInt(parametros.maxReportsPerScholar, 10);

    const payload = {
      academic_year: parametros.academicYear,
      management_start_date: parametros.managementStartDate,
      management_end_date: parametros.managementEndDate,
      report_deadline: parametros.reportDeadline,
      max_reports_per_scholar: Number.isNaN(maxReports) ? 0 : maxReports,
      system_status: parametros.systemStatus,
      research_lines: lineasInvestigacion
        .split('\n')
        .map((linea) => linea.trim())
        .filter((linea) => linea.length > 0),
    };

    try {
      const response = await fetch('/api/system-parameters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data?.message || 'No se pudo actualizar la configuración.');
      }

      const researchLines = Array.isArray(data.data?.researchLines)
        ? data.data.researchLines
        : payload.research_lines;

      const parametrosActualizados = {
        academicYear: data.data?.academicYear ?? payload.academic_year,
        managementStartDate: data.data?.managementStartDate ?? payload.management_start_date,
        managementEndDate: data.data?.managementEndDate ?? payload.management_end_date,
        reportDeadline: data.data?.reportDeadline ?? payload.report_deadline,
        maxReportsPerScholar: data.data?.maxReportsPerScholar ?? payload.max_reports_per_scholar,
        systemStatus: data.data?.systemStatus ?? payload.system_status,
        researchLines,
      };

      setParametros({
        ...parametrosActualizados,
        researchLines: [...parametrosActualizados.researchLines],
      });
      setParametrosIniciales({
        ...parametrosActualizados,
        researchLines: [...parametrosActualizados.researchLines],
      });
      setLineasInvestigacion(researchLines.join('\n'));
      setParametrosFeedback({ type: 'success', message: data?.message || 'Parámetros institucionales actualizados correctamente.' });
    } catch (error) {
      console.error(error);
      setParametrosFeedback({ type: 'danger', message: error.message });
    } finally {
      setParametrosSaving(false);
    }
  };

  const handleRestaurarParametros = () => {
    if (parametrosIniciales) {
      setParametros({
        ...parametrosIniciales,
        researchLines: [...(parametrosIniciales.researchLines ?? [])],
      });
      setLineasInvestigacion((parametrosIniciales.researchLines ?? []).join('\n'));
      setParametrosFeedback(null);
    }
  };

  const handleMantenimiento = (accion) => {
    alert(`Ejecutando acción de mantenimiento: ${accion} (simulación)`);
  };

  const handleRespaldo = (accion) => {
    alert(`Realizando acción de respaldo: ${accion} (simulación)`);
  };

  const handleAbrirModalUsuario = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setUsuarioForm({
        name: usuario.name ?? '',
        email: usuario.email ?? '',
        username: usuario.username ?? '',
        password: '',
        roleId:
          usuario.role?.id != null
            ? String(usuario.role.id)
            : usuario.role_id != null
            ? String(usuario.role_id)
            : '',
      });
    } else {
      setUsuarioEditando(null);
      setUsuarioForm({ name: '', email: '', username: '', password: '', roleId: '' });
    }
    setFormErrors({});
    setFeedback(null);
    setShowUsuarioModal(true);
  };

  const handleCerrarModalUsuario = () => {
    if (!formSubmitting) {
      setShowUsuarioModal(false);
      setUsuarioEditando(null);
    }
  };

  const handleChangeUsuarioForm = (field, value) => {
    setUsuarioForm((prev) => ({ ...prev, [field]: value }));
  };

  const validarFormularioUsuario = () => {
    const errores = {};

    if (!usuarioForm.name.trim()) {
      errores.name = 'El nombre es obligatorio.';
    }

    if (!usuarioForm.email.trim()) {
      errores.email = 'El correo es obligatorio.';
    }

    if (!usuarioForm.username.trim()) {
      errores.username = 'El nombre de usuario es obligatorio.';
    }

    if (!usuarioEditando) {
      if (!usuarioForm.password.trim()) {
        errores.password = 'La contraseña es obligatoria.';
      } else if (usuarioForm.password.length < 8) {
        errores.password = 'La contraseña debe tener al menos 8 caracteres.';
      }
    } else if (usuarioForm.password && usuarioForm.password.length < 8) {
      errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!usuarioForm.roleId) {
      errores.roleId = 'Debe seleccionar un rol.';
    }

    setFormErrors(errores);

    return Object.keys(errores).length === 0;
  };

  const handleSubmitUsuario = async (event) => {
    event.preventDefault();

    if (!validarFormularioUsuario()) {
      return;
    }

    setFormSubmitting(true);
    setFeedback(null);

    const payload = {
      name: usuarioForm.name.trim(),
      email: usuarioForm.email.trim(),
      username: usuarioForm.username.trim(),
      role_id: Number(usuarioForm.roleId),
    };

    if (usuarioForm.password.trim()) {
      payload.password = usuarioForm.password.trim();
    }

    const endpoint = usuarioEditando ? `/api/users/${usuarioEditando.id}` : '/api/users';
    const method = usuarioEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const firstError = errorBody?.errors
          ? Object.values(errorBody.errors).flat()[0]
          : null;
        const defaultMessage = usuarioEditando
          ? 'No se pudo actualizar el usuario.'
          : 'No se pudo crear el usuario.';
        const message = firstError || errorBody?.message || defaultMessage;
        throw new Error(message);
      }

      const data = await response.json();
      const usuarioGuardado = data.data;

      setUsuarios((prevUsuarios) => {
        if (usuarioEditando) {
          return prevUsuarios
            .map((usuario) => (usuario.id === usuarioEditando.id ? usuarioGuardado : usuario))
            .sort((a, b) => a.name.localeCompare(b.name));
        }

        return [...prevUsuarios, usuarioGuardado].sort((a, b) => a.name.localeCompare(b.name));
      });

      setFeedback({
        type: 'success',
        message: usuarioEditando
          ? 'Usuario actualizado correctamente.'
          : 'Usuario creado correctamente.',
      });
      setShowUsuarioModal(false);
      setUsuarioEditando(null);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'danger', message: error.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditarUsuario = (usuario) => {
    handleAbrirModalUsuario(usuario);
  };

  const handleEliminarUsuario = async (id) => {
    const usuario = usuarios.find((item) => item.id === id);
    const nombreUsuario = usuario?.name ? ` al usuario "${usuario.name}"` : '';

    if (!window.confirm(`¿Está seguro de eliminar${nombreUsuario}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setUsuarioEliminandoId(id);
    setFeedback(null);

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const firstError = errorBody?.errors
          ? Object.values(errorBody.errors).flat()[0]
          : null;
        const message = firstError || errorBody?.message || 'No se pudo eliminar el usuario.';
        throw new Error(message);
      }

      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuarioItem) => usuarioItem.id !== id));
      setFeedback({ type: 'success', message: 'Usuario eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'danger', message: error.message });
    } finally {
      setUsuarioEliminandoId(null);
    }
  };

  const usuariosFormateados = useMemo(
    () =>
      usuarios.map((usuario) => ({
        ...usuario,
        displayRole: usuario?.role?.displayName || 'Sin rol',
        estado: usuario?.isActive ? 'Activo' : 'Inactivo',
        fechaCreacion: usuario?.createdAt
          ? new Date(usuario.createdAt).toLocaleDateString('es-BO')
          : '—',
      })),
    [usuarios]
  );

  const lineasInvestigacionList = useMemo(
    () =>
      lineasInvestigacion
        .split('\n')
        .map((linea) => linea.trim())
        .filter((linea) => linea.length > 0),
    [lineasInvestigacion]
  );

  return (
    <div className="panel-configuracion-page">
      <Header />
      <Container fluid className="panel-configuracion-wrapper">
      {/* 1. Encabezado principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          ⚙️ Panel de Configuración del Sistema de Becas Auxiliares de Investigación – DyCIT
        </h1>
        <p className="lead text-muted">Gestión de usuarios, roles y parámetros institucionales</p>
        <p className="text-muted small">
          Este módulo está reservado únicamente al Administrador, según el Documento de GPC:
          "Incluye las opciones administrativas del sistema, como la creación de usuarios, asignación de roles, actualización de parámetros institucionales y mantenimiento general de la plataforma."
        </p>
      </div>

      <Row>
        {/* 2. Panel de navegación lateral (menú interno) */}
        <Col md={3} className="mb-4">
          <Card className="menu-lateral">
            <Card.Header as="h5" className="fw-bold">Menú Administrativo</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item 
                action 
                active={activeTab === 'usuarios'} 
                onClick={() => handleTabSelect('usuarios')}
              >
                👥 Gestión de usuarios
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeTab === 'roles'} 
                onClick={() => handleTabSelect('roles')}
              >
                🔐 Gestión de roles y permisos
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeTab === 'parametros'} 
                onClick={() => handleTabSelect('parametros')}
              >
                🏛️ Parámetros institucionales
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Contenido principal según la opción seleccionada */}
        <Col md={9}>
          {/* 3. Bloque 1: Gestión de usuarios */}
          {activeTab === 'usuarios' && (
            <Card>
              <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
                <span>Gestión de Usuarios</span>
                <Button variant="primary" size="sm" onClick={() => handleAbrirModalUsuario()}>
                  Nuevo usuario
                </Button>
              </Card.Header>
              <Card.Body>
                {feedback && (
                  <Alert variant={feedback.type} onClose={() => setFeedback(null)} dismissible>
                    {feedback.message}
                  </Alert>
                )}

                {usuariosLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando usuarios...</span>
                  </div>
                ) : usuariosError ? (
                  <Alert variant="danger">{usuariosError}</Alert>
                ) : usuariosFormateados.length === 0 ? (
                  <Alert variant="info" className="mb-0">
                    Aún no hay usuarios registrados en el sistema.
                  </Alert>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre completo</th>
                        <th>Correo institucional</th>
                        <th>Rol asignado</th>
                        <th>Estado</th>
                        <th>Fecha de creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFormateados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.name}</td>
                          <td>{usuario.email}</td>
                          <td>{usuario.displayRole}</td>
                          <td>
                            <Badge bg={usuario.estado === 'Activo' ? 'success' : 'secondary'}>
                              {usuario.estado}
                            </Badge>
                          </td>
                          <td>{usuario.fechaCreacion}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEditarUsuario(usuario)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant={usuario.estado === 'Activo' ? 'outline-warning' : 'outline-success'}
                              size="sm"
                              className="me-1"
                              onClick={() => handleCambiarEstadoUsuario(usuario.id)}
                              disabled={usuarioAccionId === usuario.id}
                            >
                              {usuarioAccionId === usuario.id ? (
                                <Spinner animation="border" size="sm" role="status" className="me-1" />
                              ) : null}
                              {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEliminarUsuario(usuario.id)}
                              disabled={usuarioEliminandoId === usuario.id}
                            >
                              {usuarioEliminandoId === usuario.id ? (
                                <Spinner animation="border" size="sm" role="status" className="me-1" />
                              ) : null}
                              Eliminar
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleResetPassword(usuario.id)}
                            >
                              Resetear contraseña
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          )}

          {/* 4. Bloque 2: Gestión de roles y permisos */}
          {activeTab === 'roles' && (
            <Card>
              <Card.Header as="h5" className="fw-bold">Gestión de Roles y Permisos</Card.Header>
              <Tab.Container id="roles-tabs" defaultActiveKey="roles">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="roles">Roles del sistema</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="permisos">Permisos por módulo</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="roles">
                    <Card.Body>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre del rol</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rolesDisponibles.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center text-muted">
                                No hay roles registrados.
                              </td>
                            </tr>
                          ) : (
                            rolesDisponibles.map((rol) => (
                              <tr key={rol.id}>
                                <td>{rol.id}</td>
                                <td>{rol.nombre}</td>
                                <td>{rol.descripcion}</td>
                                <td>
                                  <Button variant="outline-primary" size="sm" className="me-1">
                                    Editar
                                  </Button>
                                  <Button variant="outline-danger" size="sm">Eliminar</Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Tab.Pane>
                  <Tab.Pane eventKey="permisos">
                    <Card.Body>
                      <Alert variant="info" className="mb-0">
                        La configuración detallada de permisos se habilitará cuando el backend exponga esta información. Por ahora, los roles utilizan los permisos definidos en el servidor.
                      </Alert>
                    </Card.Body>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card>
          )}

          {/* 5. Bloque 3: Parámetros institucionales */}
          {activeTab === 'parametros' && (
            <Card>
              <Card.Header as="h5" className="fw-bold">Parámetros Institucionales</Card.Header>
              <Card.Body>
                {parametrosFeedback && (
                  <Alert
                    variant={parametrosFeedback.type}
                    onClose={() => setParametrosFeedback(null)}
                    dismissible
                  >
                    {parametrosFeedback.message}
                  </Alert>
                )}

                {parametrosLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando parámetros institucionales…</span>
                  </div>
                ) : parametrosError ? (
                  <Alert variant="danger" className="mb-0">
                    {parametrosError}
                  </Alert>
                ) : (
                  <Form onSubmit={handleActualizarParametros}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gestión académica vigente</Form.Label>
                          <Form.Control
                            type="text"
                            value={parametros.academicYear}
                            onChange={(event) =>
                              setParametros({ ...parametros, academicYear: event.target.value })
                            }
                            placeholder="Ej. 2025"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Estado general del sistema</Form.Label>
                          <Form.Select
                            value={parametros.systemStatus}
                            onChange={(event) =>
                              setParametros({ ...parametros, systemStatus: event.target.value })
                            }
                          >
                            <option value="activo">Activo</option>
                            <option value="cerrado">Cerrado</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de inicio de la gestión</Form.Label>
                          <Form.Control
                            type="date"
                            value={parametros.managementStartDate}
                            onChange={(event) =>
                              setParametros({ ...parametros, managementStartDate: event.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de cierre de la gestión</Form.Label>
                          <Form.Control
                            type="date"
                            value={parametros.managementEndDate}
                            onChange={(event) =>
                              setParametros({ ...parametros, managementEndDate: event.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha límite para recepción de reportes</Form.Label>
                          <Form.Control
                            type="date"
                            value={parametros.reportDeadline}
                            onChange={(event) =>
                              setParametros({ ...parametros, reportDeadline: event.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Número máximo de reportes por becario</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            value={parametros.maxReportsPerScholar}
                            onChange={(event) =>
                              setParametros({ ...parametros, maxReportsPerScholar: event.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Líneas de investigación habilitadas</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={lineasInvestigacion}
                            onChange={(event) => setLineasInvestigacion(event.target.value)}
                            placeholder={
                              'Ingrese una línea por fila. Ej. Tecnología educativa\nEnergías renovables'
                            }
                          />
                          <Form.Text className="text-muted">
                            Se utilizarán para clasificar convocatorias y reportes asociados a las becas.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="bg-light rounded border p-3">
                          <h6 className="mb-2">Vista previa de líneas registradas</h6>
                          {lineasInvestigacionList.length > 0 ? (
                            <ul className="mb-0 ps-3">
                              {lineasInvestigacionList.map((linea, index) => (
                                <li key={`${linea}-${index}`}>{linea}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mb-0 text-muted">No hay líneas de investigación registradas.</p>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleRestaurarParametros}
                        disabled={!parametrosIniciales || parametrosSaving}
                      >
                        Restaurar valores originales
                      </Button>
                      <Button variant="primary" type="submit" disabled={parametrosSaving}>
                        {parametrosSaving ? (
                          <>
                            <Spinner animation="border" role="status" size="sm" className="me-2" />
                            Guardando…
                          </>
                        ) : (
                          'Guardar cambios'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showUsuarioModal} onHide={handleCerrarModalUsuario} centered>
        <Form onSubmit={handleSubmitUsuario}>
          <Modal.Header closeButton={!formSubmitting}>
            <Modal.Title>{usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nuevoUsuarioNombre">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={usuarioForm.name}
                onChange={(event) => handleChangeUsuarioForm('name', event.target.value)}
                isInvalid={Boolean(formErrors.name)}
              />
              <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nuevoUsuarioCorreo">
              <Form.Label>Correo institucional</Form.Label>
              <Form.Control
                type="email"
                value={usuarioForm.email}
                onChange={(event) => handleChangeUsuarioForm('email', event.target.value)}
                isInvalid={Boolean(formErrors.email)}
              />
              <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nuevoUsuarioUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuarioForm.username}
                onChange={(event) => handleChangeUsuarioForm('username', event.target.value)}
                isInvalid={Boolean(formErrors.username)}
              />
              <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nuevoUsuarioPassword">
              <Form.Label>
                {usuarioEditando
                  ? 'Contraseña temporal (opcional)'
                  : 'Contraseña temporal'}
              </Form.Label>
              <Form.Control
                type="password"
                value={usuarioForm.password}
                onChange={(event) => handleChangeUsuarioForm('password', event.target.value)}
                isInvalid={Boolean(formErrors.password)}
                placeholder={
                  usuarioEditando
                    ? 'Dejar en blanco para mantener la contraseña actual'
                    : 'Mínimo 8 caracteres'
                }
              />
              <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-0" controlId="nuevoUsuarioRol">
              <Form.Label>Rol asignado</Form.Label>
              <Form.Select
                value={usuarioForm.roleId}
                onChange={(event) => handleChangeUsuarioForm('roleId', event.target.value)}
                isInvalid={Boolean(formErrors.roleId)}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={String(rol.id)}>
                    {rol.displayName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.roleId}</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCerrarModalUsuario} disabled={formSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={formSubmitting}>
              {formSubmitting ? <Spinner animation="border" size="sm" role="status" className="me-2" /> : null}
              {usuarioEditando ? 'Actualizar usuario' : 'Guardar usuario'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Pie institucional */}
        <div className="text-center py-3 mt-5 border-top">
          <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – UATF</p>
          <p className="mb-0 small text-muted">
            {new Date().toLocaleDateString()} - v1.0.3 – 2025
          </p>
        </div>
      </Container>
    </div>
  );
};

export default PanelConfiguracion;
