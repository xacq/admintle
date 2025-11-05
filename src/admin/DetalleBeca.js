import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import './admin.css';

const ARCHIVED_STATE = 'Archivada';
const FINALIZADA_STATE = 'Finalizada';

const ESTADO_BADGES = {
  Activa: 'bg-success',
  'En evaluación': 'bg-warning text-dark',
  [FINALIZADA_STATE]: 'bg-secondary',
  [ARCHIVED_STATE]: 'bg-dark',
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('es-BO');
};

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('es-BO');
};

const getEstadoBadge = (estado) => ESTADO_BADGES[estado] ?? 'bg-primary';

const DetalleBeca = () => {
  const { becaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = useSessionUser();

  const [beca, setBeca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [archiving, setArchiving] = useState(false);

  const loadBeca = useCallback(async () => {
    if (!becaId) {
      setError('Identificador de beca no válido.');
      setBeca(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/becas/${becaId}?include_archived=1`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = payload?.data ?? payload;
      setBeca(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el detalle de la beca.');
      setBeca(null);
    } finally {
      setLoading(false);
    }
  }, [becaId]);

  useEffect(() => {
    loadBeca();
  }, [loadBeca]);

  const archivada = useMemo(
    () => Boolean(beca?.archivada || beca?.estado === ARCHIVED_STATE),
    [beca]
  );

  const puedeArchivar = useMemo(() => {
    if (!beca) {
      return false;
    }

    const rol = sessionUser?.role?.toLowerCase?.() ?? '';
    const autorizado = rol === 'administrador' || rol === 'director';
    const completada = beca.estado === FINALIZADA_STATE;

    return autorizado && completada && !archivada && Boolean(beca.evaluacionFinal);
  }, [archivada, beca, sessionUser]);

  const handleVolver = () => {
    if (location.state?.fromHistorial) {
      navigate('/historialbeca');
      return;
    }

    if (location.state?.fromList) {
      navigate('/listabecas');
      return;
    }

    navigate(-1);
  };

  const handleArchive = async () => {
    if (!beca?.id) {
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas archivar la beca ${beca.codigo}? Esta acción moverá el registro al archivo histórico.`
    );

    if (!confirmed) {
      return;
    }

    setArchiving(true);
    setFeedback({ type: '', message: '' });

    const payload = sessionUser?.id ? { cerradaPorId: sessionUser.id } : {};

    try {
      const response = await fetch(`/api/becas/${beca.id}/archivar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let body = null;
      try {
        body = await response.json();
      } catch (parseError) {
        body = null;
      }

      if (!response.ok) {
        throw new Error(body?.message || 'No se pudo archivar la beca.');
      }

      setBeca(body?.data ?? body ?? beca);
      setFeedback({
        type: 'success',
        message: `La beca ${beca.codigo} se archivó correctamente.`,
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'No se pudo archivar la beca.',
      });
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
        <Button variant="outline-secondary" onClick={handleVolver}>
          Volver
        </Button>
      </Container>
    );
  }

  if (!beca) {
    return null;
  }

  const evaluacion = beca.evaluacionFinal ?? null;

  return (
    <Container className="py-4 detalle-beca-page">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Detalle de la beca {beca.codigo}</h1>
          <p className="text-muted mb-0">Consulta la trazabilidad completa de la beca seleccionada.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleVolver}>
            Volver
          </Button>
          {puedeArchivar && (
            <Button variant="dark" onClick={handleArchive} disabled={archiving}>
              {archiving ? 'Archivando…' : 'Archivar beca'}
            </Button>
          )}
          {archivada && (
            <Badge bg="secondary" className="align-self-center">
              Archivada
            </Badge>
          )}
        </div>
      </div>

      {feedback.message && (
        <Alert variant={feedback.type || 'info'} className="mb-4">
          {feedback.message}
        </Alert>
      )}

      {archivada && (
        <Alert variant="info" className="mb-4">
          Esta beca fue archivada el {formatDateTime(beca.fechaArchivo ?? beca.fechaCierre)}
          {beca.cerradaPor?.nombre ? ` por ${beca.cerradaPor.nombre}` : ''}. Todos los datos se conservan para consulta histórica.
        </Alert>
      )}

      <Row className="gy-4">
        <Col xl={8}>
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-semibold">
              Información general
            </Card.Header>
            <Card.Body>
              <Row className="gy-3">
                <Col md={6}>
                  <div className="text-muted">Código</div>
                  <div className="fw-semibold">{beca.codigo}</div>
                </Col>
                <Col md={6} className="text-md-end">
                  <Badge bg={getEstadoBadge(beca.estado)}>{beca.estado}</Badge>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Título del proyecto</div>
                  <div className="fw-semibold">{beca.tituloProyecto ?? 'No registrado'}</div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Área de investigación</div>
                  <div>{beca.areaInvestigacion ?? 'Sin área declarada'}</div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Fecha de inicio</div>
                  <div>{formatDate(beca.fechaInicio)}</div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Fecha de finalización</div>
                  <div>{formatDate(beca.fechaFin)}</div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Fecha de archivo</div>
                  <div>{formatDateTime(beca.fechaArchivo ?? beca.fechaCierre)}</div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Promedio de reportes</div>
                  <div>
                    {beca.promedioReportes !== null && beca.promedioReportes !== undefined
                      ? `${Number(beca.promedioReportes).toFixed(2)} / 10`
                      : 'No registrado'}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5" className="fw-semibold">
              Evaluación final
            </Card.Header>
            <Card.Body>
              {!evaluacion ? (
                <p className="text-muted mb-0">No se registró la evaluación final.</p>
              ) : (
                <Row className="gy-3">
                  <Col md={4}>
                    <div className="text-muted">Estado</div>
                    <Badge bg={getEstadoBadge(evaluacion.estadoFinal ?? '')}>
                      {evaluacion.estadoFinal ?? 'Sin estado'}
                    </Badge>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted">Calificación</div>
                    <div>
                      {evaluacion.calificacionFinal !== null && evaluacion.calificacionFinal !== undefined
                        ? `${Number(evaluacion.calificacionFinal).toFixed(2)} / 10`
                        : 'Sin registro'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted">Registrada</div>
                    <div>{formatDateTime(evaluacion.fechaRegistro)}</div>
                  </Col>
                  <Col xs={12}>
                    <div className="text-muted">Observaciones</div>
                    <p className="mb-0">{evaluacion.observacionesFinales ?? 'Sin observaciones registradas.'}</p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4}>
          <Card className="h-100">
            <Card.Header as="h5" className="fw-semibold">
              Participantes y responsables
            </Card.Header>
            <Card.Body>
              <Row className="gy-3">
                <Col xs={12}>
                  <div className="text-muted">Becario</div>
                  <div className="fw-semibold">{beca.becario?.nombre ?? 'Sin asignar'}</div>
                </Col>
                <Col xs={12}>
                  <div className="text-muted">Tutor</div>
                  <div className="fw-semibold">{beca.tutor?.nombre ?? 'Sin asignar'}</div>
                </Col>
                <Col xs={12}>
                  <div className="text-muted">Cierre registrado por</div>
                  <div className="fw-semibold">{beca.cerradaPor?.nombre ?? 'No registrado'}</div>
                </Col>
                <Col xs={12}>
                  <div className="text-muted">Última actualización</div>
                  <div>{formatDateTime(beca.updatedAt)}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header as="h5" className="fw-semibold">
              Accesos rápidos
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/listabecas" variant="outline-primary">
                  Volver a la gestión de becas
                </Button>
                <Button as={Link} to="/historialbeca" variant="outline-secondary">
                  Ver archivo histórico
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleBeca;
