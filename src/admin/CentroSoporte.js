// src/components/CentroSoporte.js

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
  Spinner,
} from 'react-bootstrap';
import useSessionUser from '../hooks/useSessionUser';
import './admin.css';

const emptyTicketForm = {
  category: '',
  description: '',
  attachmentName: '',
};

const CentroSoporte = () => {
  const user = useSessionUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState(emptyTicketForm);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [techniciansError, setTechniciansError] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSaving, setCommentSaving] = useState(false);
  const [resolving, setResolving] = useState(false);

  const isSupportStaff = useMemo(() => {
    if (!user?.role) {
      return false;
    }

    return ['admin', 'director'].includes(user.role);
  }, [user?.role]);

  const loadTickets = async (signal) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/support-tickets', { signal });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;

      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError(err.message || 'No se pudieron recuperar los tickets de soporte.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicians = async (signal) => {
    try {
      const response = await fetch('/api/users', { signal });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;

      const admins = (Array.isArray(data) ? data : [])
        .filter((item) => item.role?.name === 'admin')
        .map((item) => ({ id: item.id, name: item.name }));

      setTechnicians(admins);
      setTechniciansError('');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setTechniciansError('No se pudieron cargar los técnicos disponibles.');
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadTickets(controller.signal);
    loadTechnicians(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCommentText(ticket.supportComment ?? '');
    setAssignmentFeedback('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!assigning && !commentSaving && !resolving) {
      setShowModal(false);
      setSelectedTicket(null);
      setAssignmentFeedback('');
    }
  };

  const handleTicketChange = (event) => {
    const { name, value } = event.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      alert('No se pudo identificar al usuario actual.');
      return;
    }

    setCreatingTicket(true);

    try {
      const response = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: user.id,
          category: newTicket.category,
          description: newTicket.description,
          attachmentName: newTicket.attachmentName || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo crear el ticket.');
      }

      const ticket = data?.data ?? data;
      setTickets((prev) => [ticket, ...prev]);
      setNewTicket(emptyTicketForm);
      alert(`Ticket #${ticket.id} creado correctamente.`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo crear el ticket.');
    } finally {
      setCreatingTicket(false);
    }
  };

  const updateTicket = (ticketId, updatedTicket) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? updatedTicket : ticket)));
    setSelectedTicket((current) => (current?.id === ticketId ? updatedTicket : current));
  };

  const handleAssignTechnician = async (event) => {
    event.preventDefault();

    if (!selectedTicket) {
      return;
    }

    const formData = new FormData(event.target);
    const technicianId = formData.get('technicianId');

    if (!technicianId) {
      setAssignmentFeedback('Seleccione un técnico antes de guardar.');
      return;
    }

    setAssigning(true);
    setAssignmentFeedback('');

    try {
      const response = await fetch(`/api/support-tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId: Number(technicianId), status: 'En revisión' }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo asignar el ticket.');
      }

      const updated = data?.data ?? data;
      updateTicket(selectedTicket.id, updated);
      setAssignmentFeedback('Técnico asignado correctamente.');
    } catch (err) {
      console.error(err);
      setAssignmentFeedback(err.message || 'No se pudo asignar el ticket.');
    } finally {
      setAssigning(false);
    }
  };

  const handleSaveComment = async () => {
    if (!selectedTicket) {
      return;
    }

    setCommentSaving(true);

    try {
      const response = await fetch(`/api/support-tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supportComment: commentText }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo actualizar el comentario.');
      }

      const updated = data?.data ?? data;
      updateTicket(selectedTicket.id, updated);
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo actualizar el comentario.');
    } finally {
      setCommentSaving(false);
    }
  };

  const handleMarkAsResolved = async () => {
    if (!selectedTicket) {
      return;
    }

    setResolving(true);

    try {
      const response = await fetch(`/api/support-tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resuelto' }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo actualizar el ticket.');
      }

      const updated = data?.data ?? data;
      updateTicket(selectedTicket.id, updated);
      alert(`Ticket #${selectedTicket.id} marcado como resuelto.`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo marcar el ticket como resuelto.');
    } finally {
      setResolving(false);
    }
  };

  const ticketsDelUsuario = useMemo(() => {
    if (!user?.id) {
      return [];
    }

    return tickets.filter((ticket) => ticket.reporter?.id === user.id);
  }, [tickets, user?.id]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resuelto':
        return 'success';
      case 'En revisión':
        return 'warning';
      case 'Error crítico':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Container fluid className="centro-soporte-wrapper">
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold">🛠️ Centro de Soporte Institucional</h1>
        <p className="lead text-muted">
          Gestiona incidencias, sugerencias y solicitudes técnicas registradas por los usuarios del sistema de becas.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>Tickets registrados</span>
              {loading && (
                <div className="d-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" />
                  <span className="small text-muted">Actualizando…</span>
                </div>
              )}
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Usuario</th>
                    <th>Técnico asignado</th>
                    <th>Actualizado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.category}</td>
                        <td>
                          <Badge bg={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                        </td>
                        <td>{ticket.reporter?.name ?? '—'}</td>
                        <td>{ticket.technician?.name ?? 'Sin asignar'}</td>
                        <td>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString('es-BO') : '—'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleSelectTicket(ticket)}>
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        No existen tickets registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">Crear nuevo ticket</Card.Header>
            <Card.Body>
              <Form onSubmit={handleCreateTicket}>
                <Form.Group className="mb-3" controlId="ticketCategory">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="category"
                    value={newTicket.category}
                    onChange={handleTicketChange}
                    required
                  >
                    <option value="">Seleccione una categoría…</option>
                    <option value="Acceso">Acceso</option>
                    <option value="Reporte">Reporte</option>
                    <option value="Sugerencia">Sugerencia</option>
                    <option value="Incidencia">Incidencia</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="ticketDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={newTicket.description}
                    onChange={handleTicketChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="ticketAttachment">
                  <Form.Label>Nombre del archivo adjunto (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="attachmentName"
                    value={newTicket.attachmentName}
                    onChange={handleTicketChange}
                    placeholder="captura_error.png"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" disabled={creatingTicket}>
                    {creatingTicket ? 'Enviando…' : 'Registrar ticket'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5" className="fw-bold">Mis tickets recientes</Card.Header>
            <Card.Body>
              {ticketsDelUsuario.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {ticketsDelUsuario.slice(0, 5).map((ticket) => (
                    <li key={ticket.id} className="mb-2">
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        #{ticket.id} · {ticket.category} ·{' '}
                        <Badge bg={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">Aún no registraste tickets de soporte.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del ticket #{selectedTicket?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div className="ticket-detail">
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Categoría:</strong> {selectedTicket.category}
                </Col>
                <Col md={6}>
                  <strong>Estado:</strong>{' '}
                  <Badge bg={getStatusVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Reportado por:</strong> {selectedTicket.reporter?.name ?? '—'}
                </Col>
                <Col md={6}>
                  <strong>Técnico asignado:</strong> {selectedTicket.technician?.name ?? 'Sin asignar'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Creado:</strong> {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString('es-BO') : '—'}
                </Col>
                <Col md={6}>
                  <strong>Actualizado:</strong> {selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString('es-BO') : '—'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Descripción:</strong>
                  <p>{selectedTicket.description}</p>
                </Col>
              </Row>
              {selectedTicket.attachmentName && (
                <Row className="mb-3">
                  <Col>
                    <strong>Archivo adjunto:</strong> {selectedTicket.attachmentName}
                  </Col>
                </Row>
              )}

              {isSupportStaff && (
                <Form onSubmit={handleAssignTechnician} className="mb-3 p-3 border rounded bg-light">
                  <Form.Label className="fw-bold">Asignación de técnico</Form.Label>
                  <Row className="align-items-end g-2">
                    <Col md={8}>
                      <Form.Select name="technicianId" defaultValue={selectedTicket.technician?.id ?? ''}>
                        <option value="">Seleccionar técnico…</option>
                        {technicians.map((technician) => (
                          <option key={technician.id} value={technician.id}>
                            {technician.name}
                          </option>
                        ))}
                      </Form.Select>
                      {techniciansError && (
                        <Form.Text className="text-danger">{techniciansError}</Form.Text>
                      )}
                    </Col>
                    <Col md={4} className="d-grid">
                      <Button type="submit" disabled={assigning}>
                        {assigning ? 'Guardando…' : 'Guardar'}
                      </Button>
                    </Col>
                  </Row>
                  {assignmentFeedback && (
                    <Alert variant="info" className="mt-3 mb-0">
                      {assignmentFeedback}
                    </Alert>
                  )}
                </Form>
              )}

              <Form.Group className="mb-3" controlId="supportComment">
                <Form.Label>Comentarios de soporte</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                />
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <Button variant="outline-primary" onClick={handleSaveComment} disabled={commentSaving}>
                    {commentSaving ? 'Guardando…' : 'Guardar comentario'}
                  </Button>
                  {isSupportStaff && (
                    <Button variant="outline-success" onClick={handleMarkAsResolved} disabled={resolving}>
                      {resolving ? 'Actualizando…' : 'Marcar como resuelto'}
                    </Button>
                  )}
                </div>
              </Form.Group>
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

export default CentroSoporte;
