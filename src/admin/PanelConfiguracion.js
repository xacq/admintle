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
import './admin.css';

const rolesData = [
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo al sistema' },
  { id: 2, nombre: 'Director', descripcion: 'Supervisión general de becas' },
  { id: 3, nombre: 'Tutor', descripcion: 'Evaluación de proyectos asignados' },
  { id: 4, nombre: 'Investigador', descripcion: 'Gestión de becas y reportes propios' }
];

const permisosData = [
  { modulo: 'Gestión de Becas', ver: true, crear: true, editar: true, eliminar: true },
  { modulo: 'Seguimiento', ver: true, crear: false, editar: false, eliminar: false },
  { modulo: 'Evaluación', ver: true, crear: true, editar: true, eliminar: false },
  { modulo: 'Reportes', ver: true, crear: true, editar: false, eliminar: false },
  { modulo: 'Configuración', ver: false, crear: false, editar: false, eliminar: false }
];

const PanelConfiguracion = () => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
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
  const [parametros, setParametros] = useState({
    nombreInstitucional: 'Dirección de Ciencia e Innovación Tecnológica – UATF',
    anioGestion: '2025',
    fechaInicioConvocatoria: '2025-01-15',
    fechaFinConvocatoria: '2025-02-28',
    rutaAlmacenamiento: '/srv/dycit/documentos',
    logoInstitucional: '/assets/logo_uatf.png'
  });

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

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
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

  const handleActualizarParametros = (e) => {
    e.preventDefault();
    alert('Parámetros institucionales actualizados (simulación)');
  };

  const handleMantenimiento = (accion) => {
    alert(`Ejecutando acción de mantenimiento: ${accion} (simulación)`);
  };

  const handleRespaldo = (accion) => {
    alert(`Realizando acción de respaldo: ${accion} (simulación)`);
  };

  const handleAbrirModalUsuario = () => {
    setUsuarioForm({ name: '', email: '', username: '', password: '', roleId: '' });
    setFormErrors({});
    setFeedback(null);
    setShowUsuarioModal(true);
  };

  const handleCerrarModalUsuario = () => {
    if (!formSubmitting) {
      setShowUsuarioModal(false);
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

    if (!usuarioForm.password.trim()) {
      errores.password = 'La contraseña es obligatoria.';
    } else if (usuarioForm.password.length < 8) {
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

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: usuarioForm.name.trim(),
          email: usuarioForm.email.trim(),
          username: usuarioForm.username.trim(),
          password: usuarioForm.password,
          role_id: Number(usuarioForm.roleId),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const firstError = errorBody?.errors
          ? Object.values(errorBody.errors).flat()[0]
          : null;
        const message = firstError || errorBody?.message || 'No se pudo crear el usuario.';
        throw new Error(message);
      }

      const data = await response.json();
      const nuevoUsuario = data.data;

      setUsuarios((prevUsuarios) =>
        [...prevUsuarios, nuevoUsuario].sort((a, b) => a.name.localeCompare(b.name))
      );

      setFeedback({ type: 'success', message: 'Usuario creado correctamente.' });
      setShowUsuarioModal(false);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'danger', message: error.message });
    } finally {
      setFormSubmitting(false);
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

  return (
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
                <Button variant="primary" size="sm" onClick={handleAbrirModalUsuario}>
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
                            <Button variant="outline-primary" size="sm" className="me-1" disabled>
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
                          {rolesData.map(rol => (
                            <tr key={rol.id}>
                              <td>{rol.id}</td>
                              <td>{rol.nombre}</td>
                              <td>{rol.descripcion}</td>
                              <td>
                                <Button variant="outline-primary" size="sm" className="me-1">Editar</Button>
                                <Button variant="outline-danger" size="sm">Eliminar</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Tab.Pane>
                  <Tab.Pane eventKey="permisos">
                    <Card.Body>
                      <p className="mb-3">Permisos para el rol: <strong>Administrador</strong></p>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Módulo</th>
                            <th>Ver</th>
                            <th>Crear</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permisosData.map((permiso, index) => (
                            <tr key={index}>
                              <td>{permiso.modulo}</td>
                              <td className="text-center">
                                <Form.Check 
                                  type="checkbox" 
                                  checked={permiso.ver} 
                                  onChange={() => {}} 
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check 
                                  type="checkbox" 
                                  checked={permiso.crear} 
                                  onChange={() => {}} 
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check 
                                  type="checkbox" 
                                  checked={permiso.editar} 
                                  onChange={() => {}} 
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check 
                                  type="checkbox" 
                                  checked={permiso.eliminar} 
                                  onChange={() => {}} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary">Guardar permisos</Button>
                      </div>
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
                <Form onSubmit={handleActualizarParametros}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre institucional</Form.Label>
                        <Form.Control
                          type="text"
                          value={parametros.nombreInstitucional}
                          onChange={(e) => setParametros({...parametros, nombreInstitucional: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Año de gestión actual</Form.Label>
                        <Form.Control
                          type="text"
                          value={parametros.anioGestion}
                          onChange={(e) => setParametros({...parametros, anioGestion: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de inicio de convocatoria</Form.Label>
                        <Form.Control
                          type="date"
                          value={parametros.fechaInicioConvocatoria}
                          onChange={(e) => setParametros({...parametros, fechaInicioConvocatoria: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de fin de convocatoria</Form.Label>
                        <Form.Control
                          type="date"
                          value={parametros.fechaFinConvocatoria}
                          onChange={(e) => setParametros({...parametros, fechaFinConvocatoria: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ruta de almacenamiento</Form.Label>
                        <Form.Control
                          type="text"
                          value={parametros.rutaAlmacenamiento}
                          onChange={(e) => setParametros({...parametros, rutaAlmacenamiento: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Logo institucional</Form.Label>
                        <Form.Control
                          type="text"
                          value={parametros.logoInstitucional}
                          onChange={(e) => setParametros({...parametros, logoInstitucional: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary">Restaurar valores por defecto</Button>
                    <Button variant="primary" type="submit">Actualizar parámetros</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showUsuarioModal} onHide={handleCerrarModalUsuario} centered>
        <Form onSubmit={handleSubmitUsuario}>
          <Modal.Header closeButton={!formSubmitting}>
            <Modal.Title>Nuevo usuario</Modal.Title>
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
              <Form.Label>Contraseña temporal</Form.Label>
              <Form.Control
                type="password"
                value={usuarioForm.password}
                onChange={(event) => handleChangeUsuarioForm('password', event.target.value)}
                isInvalid={Boolean(formErrors.password)}
                placeholder="Mínimo 8 caracteres"
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
                  <option key={rol.id} value={rol.id}>
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
              Guardar usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Pie institucional */}
      <footer className="text-center py-3 mt-5 border-top">
        <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – UATF</p>
        <p className="mb-0 small text-muted">
          {new Date().toLocaleDateString()} - v1.0.3 – 2025
        </p>
      </footer>
    </Container>
  );
};

export default PanelConfiguracion;
