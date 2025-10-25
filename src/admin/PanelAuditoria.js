// src/components/PanelAuditoria.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Modal, Alert, ProgressBar } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const auditoriaData = [
  {
    id: 1,
    fechaHora: '2025-09-28 09:34:15',
    usuario: 'admin_dycit',
    rol: 'Administrador',
    accion: 'Creó nuevo usuario',
    modulo: 'Configuración',
    resultado: 'Éxito',
    ip: '192.168.1.2',
    dispositivo: 'Chrome / Windows 10',
    descripcion: 'Se creó un nuevo usuario con el nombre "María García López" y rol "Tutor".',
    datosPrevios: '{}',
    datosPosteriores: '{"id": 5, "nombre": "María García López", "correo": "maria.garcia@uatf.edu.bo", "rol": "Tutor", "estado": "Activo"}'
  },
  {
    id: 2,
    fechaHora: '2025-09-28 09:36:22',
    usuario: 'juan.perez',
    rol: 'Tutor',
    accion: 'Revisó reporte de avance',
    modulo: 'Seguimiento',
    resultado: 'Éxito',
    ip: '192.168.1.45',
    dispositivo: 'Firefox / Windows 11',
    descripcion: 'El tutor revisó y aprobó el reporte de avance N°3 del becario "Ana Guzmán".',
    datosPrevios: '{"id_reporte": 3, "estado": "En revisión"}',
    datosPosteriores: '{"id_reporte": 3, "estado": "Aprobado", "calificacion": 8.5, "observaciones": "Buen progreso"}'
  },
  {
    id: 3,
    fechaHora: '2025-09-28 10:02:47',
    usuario: 'ana.guzman',
    rol: 'Becaria',
    accion: 'Subió informe de avance',
    modulo: 'Seguimiento',
    resultado: 'Éxito',
    ip: '192.168.1.87',
    dispositivo: 'Safari / macOS',
    descripcion: 'La becaria subió el informe de avance correspondiente al mes de septiembre.',
    datosPrevios: '{}',
    datosPosteriores: '{"id_reporte": 4, "titulo": "Avance Septiembre", "archivo": "informe_septiembre.pdf", "estado": "En revisión"}'
  },
  {
    id: 4,
    fechaHora: '2025-09-28 10:05:13',
    usuario: 'admin_dycit',
    rol: 'Administrador',
    accion: 'Eliminó registro antiguo',
    modulo: 'Archivo',
    resultado: 'Advertencia',
    ip: '192.168.1.2',
    dispositivo: 'Chrome / Windows 10',
    descripcion: 'Se eliminó un registro de proyecto del año 2020 por solicitud del departamento.',
    datosPrevios: '{"id": 15, "codigo": "PI-UATF-005", "titulo": "Estudio de suelos", "estado": "Archivado"}',
    datosPosteriores: '{}'
  },
  {
    id: 5,
    fechaHora: '2025-09-28 10:15:30',
    usuario: 'carlos.rojas',
    rol: 'Director',
    accion: 'Generó reporte institucional',
    modulo: 'Reportes',
    resultado: 'Éxito',
    ip: '192.168.1.33',
    dispositivo: 'Edge / Windows 10',
    descripcion: 'El director generó un reporte consolidado de todas las becas activas del semestre.',
    datosPrevios: '{}',
    datosPosteriores: '{"id_reporte": 8, "tipo": "Consolidado", "periodo": "2025-1", "estado": "Generado"}'
  },
  {
    id: 6,
    fechaHora: '2025-09-28 10:22:18',
    usuario: 'sistema',
    rol: 'Sistema',
    accion: 'Respaldo automático',
    modulo: 'Sistema',
    resultado: 'Éxito',
    ip: '127.0.0.1',
    dispositivo: 'Servidor',
    descripcion: 'Se realizó un respaldo automático de la base de datos.',
    datosPrevios: '{}',
    datosPosteriores: '{"backup": "backup_20250928_102218.sql", "tamano": "245.7 MB", "ubicacion": "/srv/backups/"}'
  },
  {
    id: 7,
    fechaHora: '2025-09-28 10:30:45',
    usuario: 'luis.mamani',
    rol: 'Becario',
    accion: 'Inicio de sesión fallido',
    modulo: 'Autenticación',
    resultado: 'Error',
    ip: '192.168.1.92',
    dispositivo: 'Chrome / Android',
    descripcion: 'Intento de inicio de sesión fallido por contraseña incorrecta.',
    datosPrevios: '{}',
    datosPosteriores: '{"error": "Contraseña incorrecta", "intento": 3, "usuario": "luis.mamani"}'
  }
];

const PanelAuditoria = () => {
  const [auditoria, setAuditoria] = useState(auditoriaData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [auditoriaActiva, setAuditoriaActiva] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Simular rol de administrador
  const [filters, setFilters] = useState({
    usuario: '',
    accion: '',
    modulo: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // --- LÓGICA DE FILTRADO ---
  const filteredEvents = useMemo(() => {
    return auditoria.filter(evento => {
      const usuarioMatch = filters.usuario === '' || evento.usuario.toLowerCase().includes(filters.usuario.toLowerCase());
      const accionMatch = filters.accion === '' || evento.accion.toLowerCase().includes(filters.accion.toLowerCase());
      const moduloMatch = filters.modulo === '' || evento.modulo.toLowerCase().includes(filters.modulo.toLowerCase());
      
      let fechaMatch = true;
      if (filters.fechaDesde && filters.fechaHasta) {
        const eventoFecha = new Date(evento.fechaHora);
        const fechaDesde = new Date(filters.fechaDesde);
        const fechaHasta = new Date(filters.fechaHasta);
        fechaHasta.setHours(23, 59, 59, 999); // Incluir todo el día
        fechaMatch = eventoFecha >= fechaDesde && eventoFecha <= fechaHasta;
      }
      
      return usuarioMatch && accionMatch && moduloMatch && fechaMatch;
    });
  }, [auditoria, filters]);

  // --- MANEJADORES DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      usuario: '',
      accion: '',
      modulo: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  const handleSelectEvent = (evento) => {
    setSelectedEvent(evento);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDownloadLog = () => {
    alert(`Descargando registro de auditoría en formato .log (simulación)`);
  };

  const handleExportRecords = (format) => {
    alert(`Exportando registros en formato ${format} (simulación)`);
  };

  const handleDeleteOldRecords = () => {
    if (window.confirm('¿Está seguro de que desea eliminar los registros antiguos? Esta acción no se puede deshacer.')) {
      alert('Registros antiguos eliminados (simulación)');
    }
  };

  const handleToggleAuditoria = () => {
    setAuditoriaActiva(!auditoriaActiva);
    alert(`Auditoría en tiempo real ${!auditoriaActiva ? 'activada' : 'desactivada'} (simulación)`);
  };

  const handleConfigureAlerts = () => {
    alert('Abriendo configuración de alertas automáticas (simulación)');
  };

  // --- FUNCIONES AUXILIARES ---
  const getResultBadge = (resultado) => {
    switch (resultado) {
      case 'Éxito':
        return 'success';
      case 'Error':
        return 'danger';
      case 'Advertencia':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // --- ESTADÍSTICAS DE ACTIVIDAD ---
  const estadisticas = useMemo(() => {
    const totalOperaciones = auditoria.length;
    const operacionesExitosas = auditoria.filter(e => e.resultado === 'Éxito').length;
    const operacionesFallidas = auditoria.filter(e => e.resultado === 'Error').length;
    const porcentajeExitosas = totalOperaciones > 0 ? Math.round((operacionesExitosas / totalOperaciones) * 100) : 0;
    
    // Contar acciones por usuario
    const usuariosActivos = {};
    auditoria.forEach(evento => {
      if (evento.usuario !== 'sistema') {
        usuariosActivos[evento.usuario] = (usuariosActivos[evento.usuario] || 0) + 1;
      }
    });
    
    const topUsuarios = Object.entries(usuariosActivos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([usuario, count]) => ({ usuario, count }));
    
    // Contar módulos más modificados
    const modulosModificados = {};
    auditoria.forEach(evento => {
      if (evento.accion !== 'Inicio de sesión' && evento.accion !== 'Inicio de sesión fallido') {
        modulosModificados[evento.modulo] = (modulosModificados[evento.modulo] || 0) + 1;
      }
    });
    
    const topModulos = Object.entries(modulosModificados)
      .sort((a, b) => b[1] - a[1])
      .map(([modulo, count]) => ({ modulo, count }));
    
    return {
      totalOperaciones,
      operacionesExitosas,
      operacionesFallidas,
      porcentajeExitosas,
      topUsuarios,
      topModulos,
      ultimoRespaldo: '2025-09-28 10:22:18'
    };
  }, [auditoria]);

  return (
    <Container fluid className="panel-auditoria-wrapper">
      {/* 1. Encabezado principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          🧾 Panel de Auditoría y Control de Actividades del Sistema – DyCIT
        </h1>
        <p className="lead text-muted">Registro y monitoreo de operaciones realizadas por los usuarios en la plataforma</p>
        <p className="text-muted small">
          Este módulo garantiza la seguridad, transparencia y trazabilidad de las operaciones administrativas y académicas.
        </p>
      </div>

      <Row>
        <Col lg={isAdmin ? 9 : 12}>
          {/* 2. Panel de filtros de búsqueda */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">Filtros de Búsqueda</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={filters.usuario}
                    onChange={handleFilterChange}
                    placeholder="Ingrese nombre de usuario..."
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Tipo de acción</Form.Label>
                  <Form.Control
                    type="text"
                    name="accion"
                    value={filters.accion}
                    onChange={handleFilterChange}
                    placeholder="Ej: Creó, Modificó, Eliminó"
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Módulo afectado</Form.Label>
                  <Form.Control
                    type="text"
                    name="modulo"
                    value={filters.modulo}
                    onChange={handleFilterChange}
                    placeholder="Ej: Configuración, Seguimiento"
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Fecha desde</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaDesde"
                    value={filters.fechaDesde}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Fecha hasta</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaHasta"
                    value={filters.fechaHasta}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <div className="d-grid gap-2 w-100">
                    <Button variant="primary">Buscar</Button>
                    <Button variant="outline-secondary" onClick={handleClearFilters}>Limpiar filtros</Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 3. Tabla de registros de auditoría */}
          <Card>
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>Registros de Auditoría ({filteredEvents.length} resultados)</span>
              <div>
                <Button variant="outline-info" size="sm" onClick={() => setShowStats(!showStats)} className="me-2">
                  {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
                </Button>
                <Badge bg={auditoriaActiva ? 'success' : 'danger'}>
                  Auditoría {auditoriaActiva ? 'activa' : 'inactiva'}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acción realizada</th>
                    <th>Módulo afectado</th>
                    <th>Resultado</th>
                    <th>IP / Dispositivo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(evento => (
                      <tr key={evento.id} onClick={() => handleSelectEvent(evento)} style={{ cursor: 'pointer' }}>
                        <td>{evento.fechaHora}</td>
                        <td>{evento.usuario}</td>
                        <td>{evento.rol}</td>
                        <td>{evento.accion}</td>
                        <td>{evento.modulo}</td>
                        <td>
                          <Badge bg={getResultBadge(evento.resultado)}>
                            {evento.resultado === 'Éxito' && '✅ '}
                            {evento.resultado === 'Error' && '❌ '}
                            {evento.resultado === 'Advertencia' && '⚠️ '}
                            {evento.resultado}
                          </Badge>
                        </td>
                        <td>
                          <small>{evento.ip}</small>
                          <br />
                          <small className="text-muted">{evento.dispositivo}</small>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-3">No se encontraron registros con los filtros seleccionados.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {isAdmin && (
          <Col lg={3}>
            {/* 5. Panel de acciones del administrador */}
            <Card className="mb-4">
              <Card.Header as="h5" className="fw-bold">Acciones del Administrador</Card.Header>
              <Card.Body>
                <Alert variant="info">
                  Estas acciones solo están disponibles para usuarios con rol de administrador.
                </Alert>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => handleExportRecords('CSV')}>
                    Exportar registros (CSV)
                  </Button>
                  <Button variant="outline-primary" size="sm" onClick={() => handleExportRecords('PDF')}>
                    Exportar registros (PDF)
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={handleDeleteOldRecords}>
                    Eliminar registros antiguos
                  </Button>
                  <Button 
                    variant={auditoriaActiva ? 'outline-warning' : 'outline-success'} 
                    size="sm" 
                    onClick={handleToggleAuditoria}
                  >
                    {auditoriaActiva ? 'Desactivar' : 'Activar'} auditoría
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={handleConfigureAlerts}>
                    Configurar alertas automáticas
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* 6. Panel de estadísticas de actividad */}
      {showStats && (
        <Card className="mt-4">
          <Card.Header as="h5" className="fw-bold">Estadísticas de Actividad</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <h6>Total de operaciones registradas</h6>
                <h3 className="text-primary">{estadisticas.totalOperaciones}</h3>
              </Col>
              <Col md={3}>
                <h6>Porcentaje de acciones exitosas / fallidas</h6>
                <div className="mb-2">
                  <ProgressBar now={estadisticas.porcentajeExitosas} label={`${estadisticas.porcentajeExitosas}%`} />
                </div>
                <small>Éxitos: {estadisticas.operacionesExitosas} | Fallidas: {estadisticas.operacionesFallidas}</small>
              </Col>
              <Col md={3}>
                <h6>Top 5 usuarios más activos</h6>
                <ul>
                  {estadisticas.topUsuarios.map((item, index) => (
                    <li key={index}>{item.usuario}: {item.count} operaciones</li>
                  ))}
                </ul>
              </Col>
              <Col md={3}>
                <h6>Módulos más modificados</h6>
                <ul>
                  {estadisticas.topModulos.map((item, index) => (
                    <li key={index}>{item.modulo}: {item.count} operaciones</li>
                  ))}
                </ul>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={12}>
                <h6>Último respaldo del registro de auditoría</h6>
                <p>{estadisticas.ultimoRespaldo}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 4. Detalle del evento (modal emergente) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedEvent && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Detalle del Evento de Auditoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <h6>Usuario responsable</h6>
                  <p>{selectedEvent.usuario} ({selectedEvent.rol})</p>
                </Col>
                <Col md={6}>
                  <h6>Fecha y hora exacta</h6>
                  <p>{selectedEvent.fechaHora}</p>
                </Col>
                <Col md={6}>
                  <h6>Ubicación / IP del equipo</h6>
                  <p>{selectedEvent.ip}</p>
                  <p className="text-muted">{selectedEvent.dispositivo}</p>
                </Col>
                <Col md={6}>
                  <h6>Resultado</h6>
                  <Badge bg={getResultBadge(selectedEvent.resultado)}>
                    {selectedEvent.resultado}
                  </Badge>
                </Col>
                <Col md={12}>
                  <h6>Descripción completa de la acción</h6>
                  <p>{selectedEvent.descripcion}</p>
                </Col>
                <Col md={6}>
                  <h6>Datos previos</h6>
                  <pre className="bg-light p-2 rounded">
                    {selectedEvent.datosPrevios}
                  </pre>
                </Col>
                <Col md={6}>
                  <h6>Datos posteriores</h6>
                  <pre className="bg-light p-2 rounded">
                    {selectedEvent.datosPosteriores}
                  </pre>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleDownloadLog}>
                Descargar registro (.log)
              </Button>
            </Modal.Footer>
          </>
        )}
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

export default PanelAuditoria;