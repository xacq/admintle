// src/tutor/EvaluacionFinal.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
} from 'react-bootstrap';
import useSessionUser from '../hooks/useSessionUser';
import './docente.css';

const estadoEvaluacionVariant = {
  Aprobado: 'success',
  Reprobado: 'danger',
  Concluido: 'info',
  Pendiente: 'secondary',
};

const estadoBecaVariant = {
  Activa: 'success',
  'En evaluación': 'warning',
  Finalizada: 'secondary',
  Archivada: 'dark',
};

const defaultFormData = {
  observacionesFinales: '',
  calificacionFinal: '',
  estadoFinal: 'Pendiente',
};

const EvaluacionFinal = () => {
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedBeca, setSelectedBeca] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadBecas = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/becas?tutor_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setBecas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'No se pudo obtener la lista de becarios asignados.');
      } finally {
        setLoading(false);
      }
    };

    loadBecas();
  }, [user?.id]);

  const resumen = useMemo(() => {
    const evaluadas = becas.filter((beca) => beca.evaluacionFinal);
    const totalEvaluados = evaluadas.length;
    const promedioGeneral = totalEvaluados
      ? (
          evaluadas.reduce(
            (acumulado, beca) => acumulado + (Number(beca.evaluacionFinal?.calificacionFinal) || 0),
            0,
          ) / totalEvaluados
        ).toFixed(2)
      : '—';

    const ultimaFechaRegistro = evaluadas.reduce((latest, beca) => {
      const rawDate =
        beca.evaluacionFinal?.fechaActualizacion || beca.evaluacionFinal?.fechaRegistro || null;

      if (!rawDate) {
        return latest;
      }

      const parsed = new Date(rawDate);
      if (!latest || parsed > latest) {
        return parsed;
      }

      return latest;
    }, null);

    return {
      totalEvaluados,
      promedioGeneral,
      ultimaFecha: ultimaFechaRegistro
        ? ultimaFechaRegistro.toLocaleDateString('es-BO')
        : '—',
      pendientes: becas.length - totalEvaluados,
    };
  }, [becas]);

  const resetModalState = () => {
    setSelectedBeca(null);
    setShowModal(false);
    setFormData(defaultFormData);
  };

  const handleEvaluar = (beca) => {
    setSelectedBeca(beca);
    setFormData({
      observacionesFinales: beca.evaluacionFinal?.observacionesFinales ?? '',
      calificacionFinal:
        beca.evaluacionFinal?.calificacionFinal !== null && beca.evaluacionFinal?.calificacionFinal !== undefined
          ? String(beca.evaluacionFinal.calificacionFinal)
          : '',
      estadoFinal: beca.evaluacionFinal?.estadoFinal ?? 'Pendiente',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    resetModalState();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarEvaluacion = async () => {
    if (!selectedBeca || !user?.id) {
      return;
    }

    setSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      becaId: selectedBeca.id,
      tutorId: user.id,
      observacionesFinales: formData.observacionesFinales.trim() || null,
      calificacionFinal:
        formData.calificacionFinal === '' ? null : Number(formData.calificacionFinal),
      estadoFinal: formData.estadoFinal,
    };

    const method = selectedBeca.evaluacionFinal ? 'PUT' : 'POST';
    const url = selectedBeca.evaluacionFinal
      ? `/api/evaluaciones/${selectedBeca.evaluacionFinal.id}`
      : '/api/evaluaciones';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          responseBody?.message ||
          (responseBody?.errors && Object.values(responseBody.errors).flat().join(' ')) ||
          'No se pudo registrar la evaluación final.';
        throw new Error(message);
      }

      const data = Array.isArray(responseBody?.data) ? responseBody.data : responseBody?.data ?? responseBody;

      if (data?.id) {
        setBecas((prev) =>
          prev.map((beca) => (beca.id === data.id ? { ...beca, ...data } : beca)),
        );
      }

      setFeedback({ type: 'success', message: 'Evaluación final registrada correctamente.' });
      resetModalState();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'No se pudo registrar la evaluación final.',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatPromedio = (value) => {
    if (value === null || value === undefined) {
      return '—';
    }

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue.toFixed(2) : '—';
  };

  const formatCalificacionFinal = (evaluacion) => {
    if (!evaluacion || evaluacion.calificacionFinal === null || evaluacion.calificacionFinal === undefined) {
      return 'Sin registrar';
    }

    const numberValue = Number(evaluacion.calificacionFinal);
    if (!Number.isFinite(numberValue)) {
      return 'Sin registrar';
    }

    return `${numberValue.toFixed(2)} / 10`;
  };

  return (
    <div className="evaluacion-final-wrapper">
      <header className="evaluacion-final-header text-center py-4 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="Logo UATF"
              />
            </Col>
            <Col md={6}>
              <h1 className="h3 mb-0 fw-bold">Consolidación de Evaluaciones Finales</h1>
              <p className="text-muted small mb-0">
                Registro y emisión de resultados finales de desempeño de los becarios auxiliares de investigación.
              </p>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span>
              <br />
              <strong>{user?.name ?? 'Tutor'}</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {feedback.message && !error && (
          <Alert variant={feedback.type === 'danger' ? 'danger' : 'success'} className="mb-3">
            {feedback.message}
          </Alert>
        )}

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <h6 className="text-muted mb-1">Becarios evaluados</h6>
                <h3 className="text-success mb-0">{resumen.totalEvaluados}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <h6 className="text-muted mb-1">Promedio general</h6>
                <h3 className="text-primary mb-0">{resumen.promedioGeneral}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <h6 className="text-muted mb-1">Pendientes</h6>
                <h3 className="text-warning mb-0">{resumen.pendientes}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4">
            <Card>
              <Card.Header as="h5" className="fw-bold">
                Becarios asignados
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código de Beca</th>
                      <th>Nombre del Becario</th>
                      <th>Calificación Promedio de Reportes</th>
                      <th>Estado</th>
                      <th>Evaluación Final</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <Spinner animation="border" role="status" className="me-2" />
                          <span>Cargando becarios…</span>
                        </td>
                      </tr>
                    ) : becas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No se registraron becarios a su cargo todavía.
                        </td>
                      </tr>
                    ) : (
                      becas.map((beca) => (
                        <tr key={beca.id}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                          <td>{formatPromedio(beca.promedioReportes)}</td>
                          <td>
                            <Badge bg={estadoBecaVariant[beca.estado] ?? 'secondary'}>{beca.estado}</Badge>
                          </td>
                          <td>
                            {beca.evaluacionFinal ? (
                              <div className="d-flex flex-column">
                                <span className="fw-semibold">{formatCalificacionFinal(beca.evaluacionFinal)}</span>
                                <Badge bg={estadoEvaluacionVariant[beca.evaluacionFinal.estadoFinal] ?? 'secondary'}>
                                  {beca.evaluacionFinal.estadoFinal}
                                </Badge>
                              </div>
                            ) : (
                              <Badge bg="secondary">Pendiente</Badge>
                            )}
                          </td>
                          <td>
                            <Button variant="primary" size="sm" onClick={() => handleEvaluar(beca)}>
                              {beca.evaluacionFinal ? 'Editar' : 'Evaluar'}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Panel resumen
              </Card.Header>
              <Card.Body>
                <p>
                  <strong>Total de becarios evaluados:</strong> {resumen.totalEvaluados}
                </p>
                <p>
                  <strong>Promedio general de calificaciones:</strong> {resumen.promedioGeneral}
                </p>
                <p>
                  <strong>Última fecha de registro:</strong> {resumen.ultimaFecha}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop={saving ? 'static' : true}>
        {selectedBeca && (
          <>
            <Modal.Header closeButton={!saving}>
              <Modal.Title>Evaluación Final - {selectedBeca.becario?.nombre ?? 'Becario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <h6 className="fw-bold">Datos del Becario</h6>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBeca.becario?.nombre ?? '—'} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Código de Beca</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBeca.codigo} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Promedio de reportes</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={formatPromedio(selectedBeca.promedioReportes)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Estado actual de la beca</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBeca.estado} />
                  </Col>
                </Row>
                <hr />
                <Form.Group className="mb-3">
                  <Form.Label>Observaciones finales</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacionesFinales"
                    value={formData.observacionesFinales}
                    onChange={handleFormChange}
                    placeholder="Ingrese sus comentarios finales sobre el desempeño del becario..."
                    disabled={saving}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Calificación Final (0-10)</Form.Label>
                    <Form.Control
                      type="number"
                      name="calificacionFinal"
                      value={formData.calificacionFinal}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                      disabled={saving}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Estado Final</Form.Label>
                    <Form.Select
                      name="estadoFinal"
                      value={formData.estadoFinal}
                      onChange={handleFormChange}
                      disabled={saving}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Reprobado">Reprobado</option>
                      <option value="Concluido">Concluido</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarEvaluacion} disabled={saving}>
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Guardar evaluación'
                )}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <footer className="evaluacion-final-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default EvaluacionFinal;
