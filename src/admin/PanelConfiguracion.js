// src/components/PanelConfiguracion.js

import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Nav, Tab, Badge, Alert, ListGroup } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const usuariosData = [
  {
    id: 1,
    nombre: 'Juan Pérez Mamani',
    correo: 'juan.perez@uatf.edu.bo',
    rol: 'Investigador',
    estado: 'Activo',
    fechaCreacion: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'María García López',
    correo: 'maria.garcia@uatf.edu.bo',
    rol: 'Tutor',
    estado: 'Activo',
    fechaCreacion: '2023-08-22'
  },
  {
    id: 3,
    nombre: 'Carlos Rojas Fernández',
    correo: 'carlos.rojas@uatf.edu.bo',
    rol: 'Director',
    estado: 'Activo',
    fechaCreacion: '2023-03-10'
  },
  {
    id: 4,
    nombre: 'Ana Choque Quispe',
    correo: 'ana.choque@uatf.edu.bo',
    rol: 'Investigador',
    estado: 'Inactivo',
    fechaCreacion: '2024-02-05'
  }
];

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
  const [usuarios, setUsuarios] = useState(usuariosData);
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

  const handleCambiarEstadoUsuario = (id) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id 
        ? { ...usuario, estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : usuario
    ));
    alert('Estado de usuario actualizado (simulación)');
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
              <ListGroup.Item 
                action 
                active={activeTab === 'respaldo'} 
                onClick={() => handleTabSelect('respaldo')}
              >
                💾 Respaldo y restauración
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
                <Button variant="primary" size="sm">Nuevo usuario</Button>
              </Card.Header>
              <Card.Body>
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
                    {usuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.rol}</td>
                        <td>
                          <Badge bg={usuario.estado === 'Activo' ? 'success' : 'secondary'}>
                            {usuario.estado}
                          </Badge>
                        </td>
                        <td>{usuario.fechaCreacion}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-1">Editar</Button>
                          <Button 
                            variant={usuario.estado === 'Activo' ? 'outline-warning' : 'outline-success'} 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleCambiarEstadoUsuario(usuario.id)}
                          >
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

          {/* 7. Bloque 5: Respaldo y restauración */}
          {activeTab === 'respaldo' && (
            <Card>
              <Card.Header as="h5" className="fw-bold">Respaldo y Restauración</Card.Header>
              <Card.Body>
                <Alert variant="info">
                  Este punto cumple el apartado "Seguridad y Respaldo de Información" mencionado en los alcances del documento.
                </Alert>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Información del último respaldo</Card.Title>
                        <p><strong>Fecha:</strong> 15/09/2025 03:00:00</p>
                        <p><strong>Ubicación:</strong> Servidor local (/backup/dycit/)</p>
                        <p><strong>Tamaño:</strong> 245.7 MB</p>
                        <p><strong>Estado:</strong> <Badge bg="success">Completado</Badge></p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Configuración de respaldos automáticos</Card.Title>
                        <p><strong>Frecuencia:</strong> Diario a las 03:00 AM</p>
                        <p><strong>Retención:</strong> 30 días</p>
                        <p><strong>Destino:</strong> Servidor local y nube</p>
                        <Button variant="outline-primary">Configurar</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <div className="d-flex justify-content-around">
                  <Button variant="success" onClick={() => handleRespaldo('generar-respaldo')}>
                        Generar respaldo completo
                  </Button>
                  <Button variant="warning" onClick={() => handleRespaldo('restaurar-copia')}>
                        Restaurar desde copia
                  </Button>
                  <Button variant="info" onClick={() => handleRespaldo('descargar-respaldo')}>
                        Descargar respaldo actual
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

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