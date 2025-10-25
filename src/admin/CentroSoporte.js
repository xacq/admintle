// src/components/CentroSoporte.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Modal, Alert, ListGroup } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const ticketsData = [
  {
    id: 1234,
    fecha: '2025-09-21',
    categoria: 'Acceso',
    estado: 'En revisión',
    tecnicoAsignado: 'Soporte 01',
    usuario: 'juan.perez',
    rol: 'Tutor',
    descripcion: 'No puedo acceder al sistema con mi contraseña habitual. He intentado restablecerla pero no recibo el correo.',
    archivoAdjunto: null,
    comentariosSoporte: 'Estamos verificando el servidor de correo. Por favor, espere unos minutos.',
    fechaEstimadaResolucion: '2025-09-22'
  },
  {
    id: 1235,
    fecha: '2025-09-22',
    categoria: 'Reporte',
    estado: 'Resuelto',
    tecnicoAsignado: 'Soporte 02',
    usuario: 'ana.guzman',
    rol: 'Becaria',
    descripcion: 'El sistema no me permite subir mi informe de avance. Me aparece un error de "archivo no válido".',
    archivoAdjunto: 'captura_error.png',
    comentariosSoporte: 'El problema ha sido resuelto. El formato PDF ahora es compatible con el sistema. Intente nuevamente.',
    fechaEstimadaResolucion: '2025-09-22'
  },
  {
    id: 1236,
    fecha: '2025-09-23',
    categoria: 'Sugerencia',
    estado: 'Pendiente',
    tecnicoAsignado: null,
    usuario: 'carlos.rojas',
    rol: 'Director',
    descripcion: 'Sugiero agregar una función de notificación por correo cuando un reporte es aprobado.',
    archivoAdjunto: null,
    comentariosSoporte: 'Gracias por su sugerencia. La evaluaremos para futuras actualizaciones.',
    fechaEstimadaResolucion: 'Por definir'
  }
];

const CentroSoporte = () => {
  const [tickets, setTickets] = useState(ticketsData);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSupportOrAdmin, setIsSupportOrAdmin] = useState(true); // Simular rol de soporte o administrador
  const [currentUser] = useState({
    nombre: 'Juan Pérez',
    rol: 'Tutor',
    correo: 'juan.perez@uatf.edu.bo'
  });
  
  const [newTicket, setNewTicket] = useState({
    categoria: '',
    descripcion: '',
    archivo: null
  });

  // --- LÓGICA DE FILTRADO ---
  const userTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.usuario === currentUser.correo.split('@')[0]);
  }, [tickets, currentUser]);

  // --- MANEJADORES DE EVENTOS ---
  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTicket({ ...newTicket, archivo: file.name });
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    
    if (!newTicket.categoria || !newTicket.descripcion) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    
    const newId = Math.max(...tickets.map(t => t.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const ticket = {
      id: newId,
      fecha: today,
      categoria: newTicket.categoria,
      estado: 'Pendiente',
      tecnicoAsignado: null,
      usuario: currentUser.correo.split('@')[0],
      rol: currentUser.rol,
      descripcion: newTicket.descripcion,
      archivoAdjunto: newTicket.archivo,
      comentariosSoporte: '',
      fechaEstimadaResolucion: 'Por definir'
    };
    
    setTickets([...tickets, ticket]);
    alert(`Ticket #${newId} creado correctamente. Nos pondremos en contacto pronto.`);
    
    // Resetear formulario
    setNewTicket({
      categoria: '',
      descripcion: '',
      archivo: null
    });
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const handleMarkAsResolved = () => {
    if (selectedTicket) {
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, estado: 'Resuelto' }
          : ticket
      ));
      alert('Ticket marcado como resuelto. Gracias por su paciencia.');
      handleCloseModal();
    }
  };

  const handleAssignTechnician = (ticketId, technician) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, tecnicoAsignado: technician, estado: 'En revisión' }
        : ticket
    ));
    alert(`Técnico ${technician} asignado al ticket #${ticketId}`);
  };

  const handleAddComment = (ticketId, comment) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, comentariosSoporte: comment }
        : ticket
    ));
    alert('Comentario añadido correctamente.');
  };

  const handleGenerateReport = () => {
    alert('Generando reporte de incidencias recurrentes (simulación)');
  };

  // --- FUNCIONES AUXILIARES ---
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Resuelto':
        return 'success';
      case 'En revisión':
        return 'warning';
      case 'Error crítico':
        return 'danger';
      case 'Pendiente':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Resuelto':
        return '🟢';
      case 'En revisión':
        return '🟡';
      case 'Error crítico':
        return '🔴';
      case 'Pendiente':
        return '⚪';
      default:
        return '⚪';
    }
  };

  return (
    <Container fluid className="centro-soporte-wrapper">
      {/* 1. Encabezado principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          🛠️ Centro de Soporte y Asistencia Técnica – Sistema de Becas DyCIT
        </h1>
        <p className="lead text-muted">Canal de comunicación y gestión de incidencias del sistema institucional</p>
        <p className="text-muted small">
          Este módulo materializa las funciones de soporte técnico descritas en la estructura organizativa de la DyCIT:
          "Brinda apoyo en tareas de documentación, digitalización y mantenimiento del sistema de información institucional."
        </p>
      </div>

      <Row>
        <Col lg={isSupportOrAdmin ? 8 : 12}>
          {/* 2. Panel de contacto y reporte de incidencias */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">Reportar Nueva Incidencia</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitTicket}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Nombre del usuario</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.nombre}
                      readOnly
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Rol en el sistema</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.rol}
                      readOnly
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Categoría del problema</Form.Label>
                    <Form.Select
                      name="categoria"
                      value={newTicket.categoria}
                      onChange={handleTicketChange}
                      required
                    >
                      <option value="">Seleccione una categoría...</option>
                      <option value="Error técnico">Error técnico (plataforma o base de datos)</option>
                      <option value="Acceso">Problemas de acceso o contraseña</option>
                      <option value="Reporte">Error en registro o evaluación</option>
                      <option value="Sugerencia">Sugerencia de mejora</option>
                    </Form.Select>
                  </Col>
                  <Col md={12}>
                    <Form.Label>Descripción del incidente</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="descripcion"
                      value={newTicket.descripcion}
                      onChange={handleTicketChange}
                      placeholder="Describa detalladamente el problema o sugerencia..."
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Adjuntar archivo o captura de pantalla (opcional)</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" className="w-100">
                      Enviar solicitud de soporte
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* 3. Panel de seguimiento de tickets */}
          <Card>
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>Mis Solicitudes de Soporte</span>
              {isSupportOrAdmin && (
                <Button variant="outline-secondary" size="sm" onClick={() => setShowAdminPanel(!showAdminPanel)}>
                  {showAdminPanel ? 'Ocultar' : 'Mostrar'} panel administrativo
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Nº Ticket</th>
                    <th>Fecha</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Técnico asignado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {userTickets.length > 0 ? (
                    userTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.fecha}</td>
                        <td>{ticket.categoria}</td>
                        <td>
                          <Badge bg={getEstadoBadge(ticket.estado)}>
                            {getEstadoIcon(ticket.estado)} {ticket.estado}
                          </Badge>
                        </td>
                        <td>{ticket.tecnicoAsignado || '—'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewTicket(ticket)}>
                            🔍 Ver
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3">No tiene solicitudes de soporte registradas.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {isSupportOrAdmin && (
          <Col lg={4}>
            {/* 5. Panel administrativo (solo soporte y administrador) */}
            {showAdminPanel && (
              <Card className="mb-4">
                <Card.Header as="h5" className="fw-bold">Panel Administrativo de Soporte</Card.Header>
                <Card.Body>
                  <Alert variant="info">
                    Este panel solo es visible para el equipo de soporte técnico o el administrador DyCIT.
                  </Alert>
                  <div className="d-grid gap-2 mb-3">
                    <Button variant="outline-primary" size="sm">
                      Ver todas las solicitudes del sistema
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={handleGenerateReport}>
                      Generar reporte de incidencias recurrentes
                    </Button>
                  </div>
                  
                  <h6 className="mt-3">Tickets pendientes de asignación</h6>
                  <ListGroup>
                    {tickets.filter(t => !t.tecnicoAsignado).map(ticket => (
                      <ListGroup.Item key={ticket.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>#{ticket.id}</strong> - {ticket.categoria}
                          <br />
                          <small>{ticket.usuario} ({ticket.rol})</small>
                        </div>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleAssignTechnician(ticket.id, 'Soporte 01')}
                        >
                          Asignar
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            )}

            {/* 6. Sección de ayuda y documentación */}
            <Card className="mb-4">
              <Card.Header as="h5" className="fw-bold">Ayuda y Documentación</Card.Header>
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item action href="#manual">
                    📖 Manual del usuario
                  </ListGroup.Item>
                  <ListGroup.Item action href="#guide">
                    📋 Guía del administrador
                  </ListGroup.Item>
                  <ListGroup.Item action href="#faq">
                    ❓ Preguntas frecuentes (FAQ)
                  </ListGroup.Item>
                  <ListGroup.Item action href="#tutorials">
                    🎥 Video tutoriales
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            {/* 7. Canales de comunicación */}
            <Card>
              <Card.Header as="h5" className="fw-bold">Canales de Comunicación</Card.Header>
              <Card.Body>
                <p><strong>Correo institucional:</strong> soporte.dycit@uatf.edu.bo</p>
                <p><strong>Chat interno:</strong> Disponible en el sistema (esquina inferior derecha)</p>
                <p><strong>Teléfono de asistencia:</strong> Extensión DyCIT (4521)</p>
                <p><strong>Horario de atención:</strong> Lunes a Viernes, 8:00 - 16:00</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* 4. Detalle del ticket (modal emergente) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedTicket && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Detalle del Ticket #{selectedTicket.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <h6>Fecha de creación</h6>
                  <p>{selectedTicket.fecha}</p>
                </Col>
                <Col md={6}>
                  <h6>Categoría</h6>
                  <p>{selectedTicket.categoria}</p>
                </Col>
                <Col md={6}>
                  <h6>Usuario y rol</h6>
                  <p>{selectedTicket.usuario} ({selectedTicket.rol})</p>
                </Col>
                <Col md={6}>
                  <h6>Estado</h6>
                  <Badge bg={getEstadoBadge(selectedTicket.estado)}>
                    {getEstadoIcon(selectedTicket.estado)} {selectedTicket.estado}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6>Técnico asignado</h6>
                  <p>{selectedTicket.tecnicoAsignado || 'Sin asignar'}</p>
                </Col>
                <Col md={6}>
                  <h6>Fecha estimada de resolución</h6>
                  <p>{selectedTicket.fechaEstimadaResolucion}</p>
                </Col>
                <Col md={12}>
                  <h6>Descripción del problema</h6>
                  <p>{selectedTicket.descripcion}</p>
                </Col>
                {selectedTicket.archivoAdjunto && (
                  <Col md={12}>
                    <h6>Archivo adjunto</h6>
                    <p>
                      <Button variant="outline-primary" size="sm">
                        📎 {selectedTicket.archivoAdjunto}
                      </Button>
                    </p>
                  </Col>
                )}
                <Col md={12}>
                  <h6>Comentarios del equipo de soporte</h6>
                  <p>{selectedTicket.comentariosSoporte || 'Sin comentarios aún.'}</p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              {selectedTicket.estado !== 'Resuelto' && selectedTicket.usuario === currentUser.correo.split('@')[0] && (
                <Button variant="success" onClick={handleMarkAsResolved}>
                  Marcar como resuelto
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
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

export default CentroSoporte;