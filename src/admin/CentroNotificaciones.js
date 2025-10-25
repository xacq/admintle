// src/components/CentroNotificaciones.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Row, Col, Form, Button, ListGroup, Badge, Alert, InputGroup } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const notificacionesData = [
  {
    id: 1,
    tipo: 'aviso',
    mensaje: 'Tu reporte de avance N°3 fue revisado y aprobado por el tutor.',
    detalle: 'Felicidades. El tutor ha revisado tu reporte y lo ha marcado como aprobado. Puedes continuar con las siguientes fases del proyecto.',
    fecha: '2025-09-10 14:30',
    leida: false,
    icono: '🟢',
    estadoColor: 'success',
    link: '/reportes/avance/3'
  },
  {
    id: 2,
    tipo: 'recordatorio',
    mensaje: 'Recuerda entregar tu próximo reporte antes del 15/09/2025.',
    detalle: 'Este es un recordatorio automático. La fecha límite para la entrega de tu próximo reporte de avance es el próximo domingo, 15 de septiembre. Asegúrate de subirlo a tiempo.',
    fecha: '2025-09-12 09:00',
    leida: false,
    icono: '🟡',
    estadoColor: 'warning',
    link: '/reportes/enviar'
  },
  {
    id: 3,
    tipo: 'cambio_estado',
    mensaje: 'El proyecto "Biotecnología Aplicada" fue marcado como finalizado.',
    detalle: 'El administrador del sistema ha cambiado el estado de tu beca a "Finalizado". Felicidades por completar tu proyecto de investigación.',
    fecha: '2025-09-11 16:45',
    leida: true,
    icono: '📢',
    estadoColor: 'primary',
    link: '/proyecto/biotecnologia-aplicada'
  },
  {
    id: 4,
    tipo: 'alerta',
    mensaje: 'Tienes una evaluación pendiente de revisión por parte del tutor.',
    detalle: 'La evaluación de desempeño correspondiente al mes de agosto aún no ha sido completada por tu tutor. Por favor, aguarda o contacta si es necesario.',
    fecha: '2025-09-05 11:20',
    leida: true,
    icono: '🔴',
    estadoColor: 'danger',
    link: '/evaluacion/detalle/2'
  },
  {
    id: 5,
    tipo: 'recordatorio',
    mensaje: 'Recordatorio: La beca "Energías Limpias" finaliza en 30 días.',
    detalle: 'Tu periodo de beca está por terminar. Asegúrate de completar todos los informes y trámites finales antes de la fecha de conclusión.',
    fecha: '2025-09-01 10:00',
    leida: true,
    icono: '🟡',
    estadoColor: 'warning',
    link: '/beca/energias-limpias'
  }
];

const CentroNotificaciones = () => {
  const [notifications, setNotifications] = useState(notificacionesData);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    estado: 'todos'
  });

  // --- LÓGICA DE FILTRADO ---
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const tipoMatch = filters.tipo === 'todos' || notif.tipo === filters.tipo;
      const estadoMatch = filters.estado === 'todos' || 
        (filters.estado === 'leidas' && notif.leida) || 
        (filters.estado === 'no-leidas' && !notif.leida);
      return tipoMatch && estadoMatch;
    });
  }, [notifications, filters]);

  const unreadCount = notifications.filter(n => !n.leida).length;

  // --- MANEJADORES DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSelectNotification = (notif) => {
    setSelectedNotification(notif);
    // Marcar como leída al seleccionarla
    if (!notif.leida) {
      setNotifications(notifications.map(n => 
        n.id === notif.id ? { ...n, leida: true } : n
      ));
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, leida: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setSelectedNotification(null);
  };

  const handleGoToLink = () => {
    if (selectedNotification && selectedNotification.link) {
      alert(`Navegando a: ${selectedNotification.link} (simulación)`);
    }
  };

  return (
    <Container fluid className="centro-notificaciones-wrapper">
      {/* 1. Encabezado principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          🛎️ Centro de Notificaciones y Alertas del Sistema de Becas DyCIT
          {unreadCount > 0 && <Badge bg="danger" className="ms-2">{unreadCount}</Badge>}
        </h1>
        <p className="lead text-muted">Gestión de recordatorios automáticos y avisos del programa de becas auxiliares de investigación</p>
        <p className="text-muted small">Este módulo “mantiene una comunicación constante entre los actores del proceso, optimizando el flujo de trabajo”</p>
      </div>

      <Row>
        {/* Columna principal: Filtros y Listado */}
        <Col lg={8}>
          {/* 2. Panel de filtros de notificaciones */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">Filtros de Notificaciones</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>Tipo de notificación</Form.Label>
                  <Form.Select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    <option value="recordatorio">Recordatorios de entrega</option>
                    <option value="aviso">Avisos de evaluación</option>
                    <option value="cambio_estado">Cambios de estado</option>
                    <option value="alerta">Alertas de cumplimiento</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select name="estado" value={filters.estado} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    <option value="no-leidas">No leídas</option>
                    <option value="leidas">Leídas</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={handleMarkAllAsRead} className="w-100">
                    Marcar todas como leídas
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 3. Listado principal de notificaciones */}
          <Card>
            <Card.Header as="h5" className="fw-bold">Bandeja de Entrada</Card.Header>
            <ListGroup variant="flush" className="notification-list">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notif => (
                  <ListGroup.Item 
                    key={notif.id} 
                    action 
                    onClick={() => handleSelectNotification(notif)}
                    className={`d-flex justify-content-between align-items-start ${!notif.leida ? 'unread' : ''}`}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{notif.icono} {notif.mensaje}</div>
                      <small className="text-muted">{notif.fecha}</small>
                    </div>
                    <Badge bg={notif.estadoColor} pill>
                      {notif.tipo}
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <div className="p-3 text-center text-muted">No hay notificaciones que coincidan con los filtros.</div>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Columna lateral: Detalle y Configuración */}
        <Col lg={4}>
          {/* 4. Detalle de la notificación (panel lateral) */}
          {selectedNotification && (
            <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
              <Card.Header as="h5" className="fw-bold d-flex justify-content-between">
                <span>Detalle de Notificación</span>
                <Button variant="close" onClick={() => setSelectedNotification(null)}></Button>
              </Card.Header>
              <Card.Body>
                <p><strong>De:</strong> Sistema DyCIT</p>
                <p><strong>Fecha:</strong> {selectedNotification.fecha}</p>
                <p><strong>Mensaje:</strong></p>
                <p>{selectedNotification.detalle}</p>
                <div className="d-grid gap-2 mt-3">
                  <Button variant="primary" onClick={handleGoToLink}>
                    Ir al módulo correspondiente
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteNotification(selectedNotification.id)}>
                    Eliminar notificación
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* 5. Panel de configuración de alertas (solo para Administrador) */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>⚙️ Configuración de Alertas</span>
              <Button variant="link" onClick={() => setShowConfig(!showConfig)}>
                {showConfig ? 'Ocultar' : 'Mostrar'}
              </Button>
            </Card.Header>
            {showConfig && (
              <Card.Body>
                <small className="text-muted d-block mb-3">Panel restringido a Administradores y Directores.</small>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia de notificaciones</Form.Label>
                    <Form.Select>
                      <option>Por evento (inmediato)</option>
                      <option>Resumen diario</option>
                      <option>Resumen semanal</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Canales de aviso</Form.Label>
                    <div>
                      <Form.Check type="checkbox" label="Correo institucional" defaultChecked />
                      <Form.Check type="checkbox" label="Notificación interna" defaultChecked />
                    </div>
                  </Form.Group>
                  <Button variant="primary" className="w-100">Guardar Configuración</Button>
                </Form>
              </Card.Body>
            )}
          </Card>

          {/* 6. Indicadores de actividad */}
          <Card>
            <Card.Header as="h5" className="fw-bold">📈 Indicadores de Actividad</Card.Header>
            <Card.Body>
              <p><strong>Total enviadas este mes:</strong> 45</p>
              <p><strong>Reportes a tiempo (tras recordatorio):</strong> 92%</p>
              <p><strong>Tiempo promedio de respuesta:</strong> 2.5 días</p>
              <p><strong>Última alerta enviada:</strong> Hace 3 horas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 7. Pie institucional */}
      <footer className="text-center py-3 mt-5 border-top">
        <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – UATF</p>
        <p className="mb-0 small text-muted">
          {new Date().toLocaleDateString()} - v1.0.3 – 2025 | 
          <a href="#privacy" className="text-decoration-none ms-1">Política de privacidad</a>
        </p>
      </footer>
    </Container>
  );
};

export default CentroNotificaciones;