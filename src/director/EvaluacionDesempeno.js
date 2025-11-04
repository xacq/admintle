// src/components/EvaluacionDesempeno.js

import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Row, Col, Badge, Form, Table, Alert, Spinner } from 'react-bootstrap';
import './evaluador.css';

const EvaluacionDesempeno = () => {
  const [becas, setBecas] = useState([]);
  const [selectedBecaId, setSelectedBecaId] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluacionesLoading, setEvaluacionesLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluacionesError, setEvaluacionesError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadBecas = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/becas?include_archived=1', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setBecas(Array.isArray(data) ? data : []);
        setSelectedBecaId((prev) => prev || (Array.isArray(data) && data[0] ? String(data[0].id) : ''));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.message || 'No se pudieron recuperar las becas disponibles.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBecas();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedBecaId) {
      setEvaluaciones([]);
      return;
    }

    const controller = new AbortController();

    const loadEvaluaciones = async () => {
      setEvaluacionesLoading(true);
      setEvaluacionesError('');

      try {
        const response = await fetch(`/api/evaluaciones?beca_id=${selectedBecaId}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setEvaluaciones(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setEvaluacionesError(err.message || 'No se pudieron recuperar las evaluaciones registradas.');
        }
      } finally {
        setEvaluacionesLoading(false);
      }
    };

    loadEvaluaciones();

    return () => {
      controller.abort();
    };
  }, [selectedBecaId]);

  const selectedBeca = useMemo(() => becas.find((beca) => String(beca.id) === String(selectedBecaId)), [becas, selectedBecaId]);

  const resumenEvaluacion = useMemo(() => {
    if (!selectedBeca?.evaluacionFinal) {
      return null;
    }

    const evaluacion = selectedBeca.evaluacionFinal;
    return {
      estadoFinal: evaluacion.estadoFinal,
      calificacion: evaluacion.calificacionFinal != null ? Number(evaluacion.calificacionFinal).toFixed(2) : null,
      observaciones: evaluacion.observacionesFinales ?? 'Sin observaciones registradas.',
    };
  }, [selectedBeca]);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'primary';
      case 'En evaluación':
        return 'warning';
      case 'Finalizada':
        return 'success';
      case 'Archivada':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getEstadoEvaluacionBadge = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Reprobado':
        return 'danger';
      case 'Concluido':
        return 'info';
      case 'Pendiente':
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="evaluacion-desempeno-container">
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold">Evaluación del Desempeño de Becarios</h1>
        <p className="lead text-muted">
          Consulta el estado actual de las becas y las evaluaciones finales registradas por los tutores asignados.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">Selecciona una beca</Card.Header>
        <Card.Body>
          <Form.Select value={selectedBecaId} onChange={(event) => setSelectedBecaId(event.target.value)} disabled={loading || becas.length === 0}>
            <option value="">Selecciona una beca…</option>
            {becas.map((beca) => (
              <option key={beca.id} value={beca.id}>
                {beca.codigo} · {beca.becario?.nombre ?? beca.becario?.name ?? 'Becario sin nombre'}
              </option>
            ))}
          </Form.Select>
          {loading && (
            <div className="d-flex align-items-center gap-2 mt-3">
              <Spinner animation="border" size="sm" />
              <span className="text-muted">Cargando becas…</span>
            </div>
          )}
        </Card.Body>
      </Card>

      {selectedBeca && (
        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold">Información de la beca</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6} lg={4} className="fw-bold text-secondary">
                Código de beca
              </Col>
              <Col md={6} lg={8}>{selectedBeca.codigo}</Col>

              <Col md={6} lg={4} className="fw-bold text-secondary">
                Becario/a
              </Col>
              <Col md={6} lg={8}>{selectedBeca.becario?.nombre ?? selectedBeca.becario?.name ?? '—'}</Col>

              <Col md={6} lg={4} className="fw-bold text-secondary">
                Tutor asignado
              </Col>
              <Col md={6} lg={8}>{selectedBeca.tutor?.nombre ?? selectedBeca.tutor?.name ?? 'Sin asignar'}</Col>

              <Col md={6} lg={4} className="fw-bold text-secondary">
                Estado actual
              </Col>
              <Col md={6} lg={8}>
                <Badge bg={getEstadoBadge(selectedBeca.estado)}>{selectedBeca.estado}</Badge>
              </Col>

              <Col md={6} lg={4} className="fw-bold text-secondary">
                Fecha de inicio
              </Col>
              <Col md={6} lg={8}>
                {selectedBeca.fechaInicio ? new Date(selectedBeca.fechaInicio).toLocaleDateString('es-BO') : '—'}
              </Col>

              <Col md={6} lg={4} className="fw-bold text-secondary">
                Fecha de finalización
              </Col>
              <Col md={6} lg={8}>
                {selectedBeca.fechaFin ? new Date(selectedBeca.fechaFin).toLocaleDateString('es-BO') : '—'}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {resumenEvaluacion ? (
        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold">Resumen de evaluación final</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4} className="fw-bold text-secondary">
                Estado final
              </Col>
              <Col md={8}>
                <Badge bg={getEstadoEvaluacionBadge(resumenEvaluacion.estadoFinal)}>
                  {resumenEvaluacion.estadoFinal}
                </Badge>
              </Col>

              <Col md={4} className="fw-bold text-secondary">
                Calificación final
              </Col>
              <Col md={8}>
                {resumenEvaluacion.calificacion ? `${resumenEvaluacion.calificacion} / 10` : 'Sin calificación registrada'}
              </Col>

              <Col md={4} className="fw-bold text-secondary">
                Observaciones finales
              </Col>
              <Col md={8}>{resumenEvaluacion.observaciones}</Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        selectedBecaId && !loading && (
          <Alert variant="info">La beca seleccionada aún no cuenta con una evaluación final registrada.</Alert>
        )
      )}

      <Card>
        <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
          <span>Historial de evaluaciones</span>
          {evaluacionesLoading && (
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
                <th>Fecha de registro</th>
                <th>Tutor</th>
                <th>Estado final</th>
                <th>Calificación</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {evaluacionesError ? (
                <tr>
                  <td colSpan={5} className="text-center text-danger py-4">
                    {evaluacionesError}
                  </td>
                </tr>
              ) : evaluaciones.length > 0 ? (
                evaluaciones.map((evaluacion) => (
                  <tr key={evaluacion.id}>
                    <td>{evaluacion.createdAt ? new Date(evaluacion.createdAt).toLocaleString('es-BO') : '—'}</td>
                    <td>{evaluacion.tutor?.nombre ?? evaluacion.tutor?.name ?? '—'}</td>
                    <td>
                      <Badge bg={getEstadoEvaluacionBadge(evaluacion.estadoFinal)}>
                        {evaluacion.estadoFinal}
                      </Badge>
                    </td>
                    <td>
                      {evaluacion.calificacionFinal != null
                        ? `${Number(evaluacion.calificacionFinal).toFixed(2)} / 10`
                        : 'Sin calificación'}
                    </td>
                    <td>{evaluacion.observacionesFinales ?? 'Sin observaciones.'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay evaluaciones registradas para la beca seleccionada.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default EvaluacionDesempeno;
