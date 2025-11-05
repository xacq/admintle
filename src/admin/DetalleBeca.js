import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './admin.css';

const getEstadoBadge = (estado) => {
  switch (estado) {
    case 'Activa':
      return 'success';
    case 'En evaluación':
      return 'warning';
    case 'Finalizada':
      return 'secondary';
    case 'Archivada':
      return 'dark';
    default:
      return 'primary';
  }
};

const formatFecha = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const DetalleBeca = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { becaId } = useParams();

  const [beca, setBeca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!becaId) {
      setError('Identificador de beca no válido.');
      setLoading(false);
      return;
    }

    const loadDetalle = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    loadDetalle();
  }, [becaId]);

  const evaluacion = useMemo(() => beca?.evaluacionFinal ?? null, [beca]);

  const handleVolver = () => {
    if (location.state?.fromHistorial) {
      navigate('/historialbecas');
      return;
    }

    if (location.state?.fromListado) {
      navigate('/listabecas');
      return;
    }

    navigate(-1);
  };

  return (
    <div className="archivo-historico-wrapper">
      <Container>
        <Button variant="link" className="px-0 mb-3" onClick={handleVolver}>
          &larr; Volver
        </Button>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="me-2" />
            Cargando detalle de la beca...
          </div>
        ) : !beca ? (
          <div className="text-center py-5 text-muted">
            No se encontró la información solicitada.
          </div>
        ) : (
          <Row className="g-4">
            <Col xl={8}>
              <Card>
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
                      <div>{formatFecha(beca.fechaInicio)}</div>
                    </Col>
                    <Col md={6}>
                      <div className="text-muted">Fecha de finalización</div>
                      <div>{formatFecha(beca.fechaFin)}</div>
                    </Col>
                    <Col md={6}>
                      <div className="text-muted">Fecha de archivo</div>
                      <div>{formatFecha(beca.fechaArchivo ?? beca.fechaCierre)}</div>
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

              <Card className="mt-4">
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
                          {evaluacion.calificacionFinal !== null &&
                          evaluacion.calificacionFinal !== undefined
                            ? `${Number(evaluacion.calificacionFinal).toFixed(2)} / 10`
                            : 'Sin registro'}
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-muted">Registrada</div>
                        <div>{formatFecha(evaluacion.fechaRegistro)}</div>
                      </Col>
                      <Col xs={12}>
                        <div className="text-muted">Observaciones</div>
                        <p className="mb-0">
                          {evaluacion.observacionesFinales ?? 'Sin observaciones registradas.'}
                        </p>
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
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <div className="text-muted">Becario</div>
                      <div className="fw-semibold">{beca.becario?.nombre ?? 'Sin asignar'}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="text-muted">Tutor</div>
                      <div className="fw-semibold">{beca.tutor?.nombre ?? 'Sin asignar'}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="text-muted">Cierre registrado por</div>
                      <div className="fw-semibold">{beca.cerradaPor?.nombre ?? 'No registrado'}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="text-muted">Última actualización</div>
                      <div>{formatFecha(beca.updatedAt)}</div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DetalleBeca;
