// src/components/PanelAuditoria.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Modal,
  Alert,
  ProgressBar,
  Spinner,
} from 'react-bootstrap';
import './admin.css';

const PanelAuditoria = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [auditoriaActiva, setAuditoriaActiva] = useState(true);
  const [filters, setFilters] = useState({
    usuario: '',
    accion: '',
    modulo: '',
    fechaDesde: '',
    fechaHasta: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRegistros = async (abortSignal) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (filters.usuario) {
      params.append('usuario', filters.usuario);
    }
    if (filters.accion) {
      params.append('accion', filters.accion);
    }
    if (filters.modulo) {
      params.append('modulo', filters.modulo);
    }
    if (filters.fechaDesde && filters.fechaHasta) {
      params.append('fecha_desde', filters.fechaDesde);
      params.append('fecha_hasta', filters.fechaHasta);
    }

    try {
      const response = await fetch(`/api/audit-logs?${params.toString()}`, { signal: abortSignal });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;

      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.id,
        fechaHora: item.eventAt ? new Date(item.eventAt) : null,
        usuario: item.usuario ?? 'Desconocido',
        rol: item.rol ?? '—',
        accion: item.accion ?? 'Evento',
        modulo: item.modulo ?? '—',
        resultado: item.resultado ?? 'Información',
        ip: item.ip ?? '—',
        dispositivo: item.dispositivo ?? '—',
        descripcion: item.descripcion ?? 'Sin descripción proporcionada.',
        datosPrevios: item.datosPrevios ?? {},
        datosPosteriores: item.datosPosteriores ?? {},
      }));

      setRegistros(mapped);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError(err.message || 'No se pudieron recuperar los registros de auditoría.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadRegistros(controller.signal);

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.usuario, filters.accion, filters.modulo, filters.fechaDesde, filters.fechaHasta]);

  const filteredEvents = useMemo(() => registros, [registros]);

  const totalsPorResultado = useMemo(() => {
    return filteredEvents.reduce((acc, evento) => {
      const key = evento.resultado || 'Sin resultado';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [filteredEvents]);

  const resultadoStats = useMemo(() => {
    const totalEventos = filteredEvents.length || 1;

    return Object.entries(totalsPorResultado)
      .sort(([, totalA], [, totalB]) => totalB - totalA)
      .map(([resultado, total]) => ({
        resultado,
        total,
        variant: getResultBadge(resultado),
        porcentaje: Math.round((total / totalEventos) * 100),
      }));
  }, [filteredEvents.length, totalsPorResultado]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ usuario: '', accion: '', modulo: '', fechaDesde: '', fechaHasta: '' });
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
    alert('Descargando registro de auditoría consolidado (simulación).');
  };

  const handleExportRecords = (format) => {
    alert(`Exportando registros en formato ${format} (simulación).`);
  };

  const handleDeleteOldRecords = () => {
    if (window.confirm('¿Está seguro de eliminar los registros antiguos? Esta acción no se puede deshacer.')) {
      alert('Registros antiguos eliminados (simulación).');
    }
  };

  const handleToggleAuditoria = () => {
    setAuditoriaActiva((prev) => !prev);
    alert(`Auditoría en tiempo real ${!auditoriaActiva ? 'activada' : 'desactivada'} (simulación).`);
  };

  const handleConfigureAlerts = () => {
    alert('Configuración de alertas automáticas en desarrollo.');
  };

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

  return (
    <Container fluid className="panel-auditoria-wrapper">
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold">📋 Panel de Auditoría y Registro de Cambios del Sistema</h1>
        <p className="lead text-muted">
          Seguimiento en tiempo real de acciones críticas y eventos registrados en la plataforma institucional.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header as="h5" className="fw-bold">Filtros avanzados</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={filters.usuario}
                    onChange={handleFilterChange}
                    placeholder="Ej: admin_dycit"
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Acción</Form.Label>
                  <Form.Control
                    type="text"
                    name="accion"
                    value={filters.accion}
                    onChange={handleFilterChange}
                    placeholder="Crear usuario"
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Módulo</Form.Label>
                  <Form.Control
                    type="text"
                    name="modulo"
                    value={filters.modulo}
                    onChange={handleFilterChange}
                    placeholder="Configuración"
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Rango de fechas</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="date"
                      name="fechaDesde"
                      value={filters.fechaDesde}
                      onChange={handleFilterChange}
                    />
                    <Form.Control
                      type="date"
                      name="fechaHasta"
                      value={filters.fechaHasta}
                      onChange={handleFilterChange}
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3 gap-2">
                <Button variant="outline-secondary" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
                <Button variant="primary" onClick={() => loadRegistros()} disabled={loading}>
                  {loading ? 'Actualizando…' : 'Aplicar filtros'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h5" className="fw-bold">Acciones rápidas</Card.Header>
            <Card.Body className="d-grid gap-2">
              <Button variant="outline-primary" onClick={handleDownloadLog}>
                Descargar log completo
              </Button>
              <Button variant="outline-success" onClick={() => handleExportRecords('CSV')}>
                Exportar en CSV
              </Button>
              <Button variant="outline-info" onClick={() => handleExportRecords('PDF')}>
                Exportar en PDF
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteOldRecords}>
                Eliminar registros antiguos
              </Button>
              <Button variant={auditoriaActiva ? 'outline-warning' : 'outline-success'} onClick={handleToggleAuditoria}>
                {auditoriaActiva ? 'Pausar auditoría en tiempo real' : 'Reanudar auditoría'}
              </Button>
              <Button variant="outline-secondary" onClick={handleConfigureAlerts}>
                Configurar alertas automáticas
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>Resumen de eventos registrados</span>
              <Button variant="link" onClick={() => setShowStats((prev) => !prev)}>
                {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
              </Button>
            </Card.Header>
            {showStats && (
              <Card.Body>
                {resultadoStats.length === 0 ? (
                  <p className="text-muted mb-0">No existen eventos suficientes para generar estadísticas.</p>
                ) : (
                  <Row>
                    {resultadoStats.map((item) => (
                      <Col key={item.resultado} md={6} lg={4} className="mb-3">
                        <h6 className="text-muted">{item.resultado}</h6>
                        <ProgressBar
                          now={item.total}
                          max={filteredEvents.length || 1}
                          variant={item.variant}
                        />
                        <p className="small mt-1">
                          {item.total} registros ({item.porcentaje}%)
                        </p>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header as="h5" className="fw-bold d-flex align-items-center justify-content-between">
          <span>Historial de auditoría</span>
          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span className="small text-muted">Cargando…</span>
            </div>
          )}
        </Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Resultado</th>
                <th>IP</th>
                <th>Dispositivo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.fechaHora ? evento.fechaHora.toLocaleString('es-BO') : '—'}</td>
                    <td>{evento.usuario}</td>
                    <td>{evento.rol}</td>
                    <td>{evento.accion}</td>
                    <td>{evento.modulo}</td>
                    <td>
                      <Badge bg={getResultBadge(evento.resultado)}>{evento.resultado}</Badge>
                    </td>
                    <td>{evento.ip}</td>
                    <td>{evento.dispositivo}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleSelectEvent(evento)}>
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">
                    No existen registros que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Fecha y hora:</strong> {selectedEvent.fechaHora ? selectedEvent.fechaHora.toLocaleString('es-BO') : '—'}
                </Col>
                <Col md={6}>
                  <strong>Usuario:</strong> {selectedEvent.usuario} ({selectedEvent.rol})
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Acción:</strong> {selectedEvent.accion}
                </Col>
                <Col md={6}>
                  <strong>Módulo:</strong> {selectedEvent.modulo}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Resultado:</strong>{' '}
                  <Badge bg={getResultBadge(selectedEvent.resultado)}>{selectedEvent.resultado}</Badge>
                </Col>
                <Col md={6}>
                  <strong>IP:</strong> {selectedEvent.ip}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Descripción:</strong>
                  <p className="mb-0">{selectedEvent.descripcion}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Datos previos:</strong>
                  <pre className="bg-light p-3 rounded small">
                    {JSON.stringify(selectedEvent.datosPrevios ?? {}, null, 2)}
                  </pre>
                </Col>
                <Col md={6}>
                  <strong>Datos posteriores:</strong>
                  <pre className="bg-light p-3 rounded small">
                    {JSON.stringify(selectedEvent.datosPosteriores ?? {}, null, 2)}
                  </pre>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PanelAuditoria;
