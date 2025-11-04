// src/components/CentroNotificaciones.js

import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Row, Col, Form, Button, ListGroup, Badge, Alert, InputGroup } from 'react-bootstrap';
import './admin.css';

const mapCategoryBadge = (categoria) => {
  switch (categoria) {
    case 'actual':
      return { icono: '🟢', variant: 'success', label: 'Actual' };
    case 'anterior':
      return { icono: '🕓', variant: 'warning', label: 'Anterior' };
    case 'registro':
      return { icono: '📘', variant: 'primary', label: 'Registro' };
    default:
      return { icono: '🔔', variant: 'secondary', label: categoria ?? 'Otro' };
  }
};

const CentroNotificaciones = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [filters, setFilters] = useState({ tipo: 'todos', estado: 'todos' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/notificaciones');
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;

        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          numero: item.numero,
          categoria: item.categoria ?? 'otros',
          titulo: item.titulo ?? 'Notificación del sistema',
          detalle: item.descripcion ?? 'Sin descripción disponible.',
          fecha: item.hasta ?? null,
          leida: false,
        }));

        setNotifications(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudieron recuperar las notificaciones.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const tipoMatch = filters.tipo === 'todos' || notif.categoria === filters.tipo;
      const estadoMatch =
        filters.estado === 'todos' ||
        (filters.estado === 'leidas' && notif.leida) ||
        (filters.estado === 'no-leidas' && !notif.leida);

      return tipoMatch && estadoMatch;
    });
  }, [notifications, filters]);

  const unreadCount = useMemo(() => notifications.filter((notif) => !notif.leida).length, [notifications]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);

    if (!notification.leida) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? { ...item, leida: true } : item))
      );
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, leida: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setSelectedNotification((current) => (current?.id === id ? null : current));
  };

  const handleGoToLink = () => {
    if (!selectedNotification) {
      return;
    }

    alert('Funcionalidad de navegación en desarrollo.');
  };

  return (
    <Container fluid className="centro-notificaciones-wrapper">
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          🛎️ Centro de Notificaciones y Alertas del Sistema de Becas DyCIT
          {unreadCount > 0 && <Badge bg="danger" className="ms-2">{unreadCount}</Badge>}
        </h1>
        <p className="lead text-muted">
          Gestión de recordatorios automáticos y avisos del programa de becas auxiliares de investigación
        </p>
        <p className="text-muted small">
          Este módulo “mantiene una comunicación constante entre los actores del proceso, optimizando el flujo de trabajo”
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              Filtros de Notificaciones
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>Tipo de notificación</Form.Label>
                  <Form.Select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    <option value="actual">Actuales</option>
                    <option value="anterior">Anteriores</option>
                    <option value="registro">Registro histórico</option>
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

          <Card>
            <Card.Header as="h5" className="fw-bold">
              Bandeja de Entrada
            </Card.Header>
            <ListGroup variant="flush" className="notification-list">
              {loading ? (
                <div className="p-3 text-center text-muted">Cargando notificaciones…</div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => {
                  const badge = mapCategoryBadge(notif.categoria);

                  return (
                    <ListGroup.Item
                      key={notif.id}
                      action
                      onClick={() => handleSelectNotification(notif)}
                      className={`d-flex justify-content-between align-items-start ${!notif.leida ? 'unread' : ''}`}
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">
                          {badge.icono} {notif.titulo}
                        </div>
                        <small className="text-muted">
                          {notif.fecha ? new Date(notif.fecha).toLocaleDateString('es-BO') : 'Sin fecha definida'}
                        </small>
                      </div>
                      <Badge bg={badge.variant} pill>
                        {badge.label}
                      </Badge>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <div className="p-3 text-center text-muted">No hay notificaciones que coincidan con los filtros.</div>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={4}>
          {selectedNotification && (
            <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
              <Card.Header as="h5" className="fw-bold d-flex justify-content-between">
                <span>Detalle de Notificación</span>
                <Badge bg={mapCategoryBadge(selectedNotification.categoria).variant}>
                  {mapCategoryBadge(selectedNotification.categoria).label}
                </Badge>
              </Card.Header>
              <Card.Body>
                <h5 className="fw-bold">{selectedNotification.titulo}</h5>
                <p className="text-muted small">
                  Recibida el{' '}
                  {selectedNotification.fecha
                    ? new Date(selectedNotification.fecha).toLocaleString('es-BO')
                    : '—'}
                </p>
                <p>{selectedNotification.detalle}</p>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="primary" onClick={handleGoToLink}>
                    Abrir
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteNotification(selectedNotification.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              Configuración de Avisos
            </Card.Header>
            <Card.Body>
              <Button
                variant="outline-primary"
                className="w-100 mb-3"
                onClick={() => setShowConfig((prev) => !prev)}
              >
                {showConfig ? 'Ocultar ajustes avanzados' : 'Mostrar ajustes avanzados'}
              </Button>

              {showConfig && (
                <div className="notification-config">
                  <Form.Check
                    type="switch"
                    id="notif-email"
                    label="Enviar resumen diario por correo"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="notif-reminder"
                    label="Recordar reportes pendientes"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check
                    type="switch"
                    id="notif-alerts"
                    label="Alertas automáticas al cerrar evaluaciones"
                    className="mb-3"
                  />
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Programar envío</InputGroup.Text>
                    <Form.Control type="datetime-local" />
                  </InputGroup>
                  <Form.Check
                    type="switch"
                    label="Activar notificaciones push internas"
                    defaultChecked
                  />
                </div>
              )}
            </Card.Body>
          </Card>

          <Alert variant="info">
            Las notificaciones provienen de los registros institucionales gestionados en el backend. Este módulo permite revisarlas y definir acciones para cada una.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default CentroNotificaciones;
