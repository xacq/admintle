import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const DetalleBeca = ({ show, onHide, beca, userRole }) => {
  // ESTADO DEL COMPONENTE
  // Asegúrate de que el nombre aquí sea 'expandedObservation'
  const [expandedObservation, setExpandedObservation] = useState(null);

  // Si no hay beca seleccionada, no renderizar nada
  if (!beca) {
    return null;
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
  const [retryFlag, setRetryFlag] = useState(0);

  const loadDetalle = useCallback(
    async (options = {}) => {
      if (!becaId) {
        setError('Identificador de beca no válido.');
        setBeca(null);
        setLoading(false);
        return;
      }

      const { signal } = options;

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/becas/${becaId}?include_archived=1`, { signal });
        if (!response.ok) {
          const message = `Error ${response.status}`;
          throw new Error(message);
        }

        const payload = await response.json();
        const data = payload?.data ?? payload;
        if (!signal?.aborted) {
          setBeca(data);
        }
      } catch (err) {
        if (signal?.aborted) {
          return;
        }
        setBeca(null);
        setError(err.message || 'No se pudo cargar el detalle de la beca.');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [becaId]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadDetalle({ signal: controller.signal });

    return () => controller.abort();
  }, [loadDetalle, retryFlag]);

  const evaluacion = useMemo(() => beca?.evaluacionFinal ?? null, [beca]);
  const archivada = Boolean(beca?.archivada || beca?.estado === 'Archivada');

  const handleVolver = () => {
    if (location.state?.fromHistorial) {
      navigate('/historialbecas');
      return;
    }
  };

  const handleToggleObservation = (id) => {
    // Y también aquí, asegúrate de usar 'expandedObservation'
    setExpandedObservation(expandedObservation === id ? null : id);
  };

  const handleArchive = () => {
    if (window.confirm(`¿Está seguro de que desea archivar la beca ${beca.codigo}?`)) {
      alert(`Beca ${beca.codigo} archivada (simulación)`);
      onHide();
    }
  };

  const handleRestore = () => {
    if (window.confirm(`¿Está seguro de que desea restaurar la beca ${beca.codigo}?`)) {
      alert(`Beca ${beca.codigo} restaurada (simulación)`);
      onHide();
    }
  };

  const handleRetry = () => {
    setRetryFlag((prev) => prev + 1);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de la Beca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 2️⃣ Datos principales de la beca */}
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2">
              <Col sm={4} className="field-label"><strong>Código de beca:</strong></Col>
              <Col sm={8}>{beca.codigo}</Col>

        {error && (
          <Alert variant="danger" className="mb-4 d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button variant="outline-light" size="sm" onClick={handleRetry} disabled={loading}>
              Reintentar
            </Button>
          </Alert>
        )}

              <Col sm={4} className="field-label"><strong>Becario:</strong></Col>
              <Col sm={8}>{beca.becario}</Col>

              <Col sm={4} className="field-label"><strong>Tutor asignado:</strong></Col>
              <Col sm={8}>{beca.tutorAsignado}</Col>

              <Col sm={4} className="field-label"><strong>Fecha de inicio:</strong></Col>
              <Col sm={8}>{beca.fechaInicio}</Col>

              <Col sm={4} className="field-label"><strong>Fecha de fin:</strong></Col>
              <Col sm={8}>{beca.fechaFin}</Col>

              <Col sm={4} className="field-label"><strong>Estado actual:</strong></Col>
              <Col sm={8}>
                <Badge bg={getEstadoVariant(beca.estado)}>
                  {beca.estado === 'Finalizada' && '🔵 '}
                  {beca.estado === 'Archivada' && '⚪ '}
                  {beca.estado}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 3️⃣ Bloque de evaluación final (si existe) */}
        <Card className="mb-3 evaluation-card">
          <Card.Body>
            <Card.Title as="h6">Evaluación Final del Tutor</Card.Title>
            {beca.evaluacionFinal ? (
              <>
                <p><strong>Calificación:</strong> {beca.evaluacionFinal.calificacion} / 10</p>
                <p><strong>Estado de la beca:</strong>
                  <Badge bg={beca.evaluacionFinal.estado === 'Aprobada' ? 'success' : 'danger'} className="ms-2">
                    {beca.evaluacionFinal.estado === 'Aprobada' ? '✅ Aprobada' : '❌ Reprobada'}
                  </Badge>
                </p>
                <p><strong>Observaciones:</strong></p>
                <p>{beca.evaluacionFinal.observaciones}</p>
              </>
            ) : (
              <p className="text-muted">Sin evaluación registrada.</p>
            )}
          </Card.Body>
        </Card>

        {/* 4️⃣ Listado de reportes enviados */}
        <Card>
          <Card.Body>
            <Card.Title as="h6">Listado de Reportes Enviados</Card.Title>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>N.º</th>
                  <th>Fecha de envío</th>
                  <th>Estado</th>
                  <th>Observaciones del tutor</th>
                </tr>
              </thead>
              <tbody>
                {beca.reportes.map((reporte) => (
                  <tr key={reporte.numero}>
                    <td>{reporte.numero}</td>
                    <td>{reporte.fechaEnvio}</td>
                    <td>
                      <Badge bg={getReporteEstadoVariant(reporte.estado)}>
                        {reporte.estado === 'Aprobado' && '✅ '}
                        {reporte.estado === 'Devuelto' && '⚠️ '}
                        {reporte.estado === 'En revisión' && '🟡 '}
                        {reporte.estado}
                      </Badge>
                    </td>
                    <td>
                      {reporte.observaciones.length > 50 ? (
                        <>
                          {/* Aquí también se usa 'expandedObservation' */}
                          {expandedObservation === reporte.numero
                            ? reporte.observaciones
                            : `${reporte.observaciones.substring(0, 50)}...`}
                          <Button variant="link" size="sm" onClick={() => handleToggleObservation(reporte.numero)}>
                            {expandedObservation === reporte.numero ? 'Ver menos' : 'Ver más'}
                          </Button>
                        </>
                      ) : (
                        reporte.observaciones
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Modal.Body>

      {/* 5️⃣ Acciones (según rol) */}
      <Modal.Footer>
        {userRole === 'Administrador' ? (
          <>
            {beca.estado === 'Finalizada' && (
              <Button variant="warning" onClick={handleArchive}>
                Archivar Beca
              </Button>
            )}
            {beca.estado === 'Archivada' && (
              <Button variant="success" onClick={handleRestore}>
                Restaurar
              </Button>
            )}
            <Button variant="secondary" onClick={onHide} className="ms-auto">
              Cerrar
            </Button>
          </>
        ) : (
          <Row className="g-4">
            <Col xl={8}>
              {archivada && (
                <Alert variant="info" className="mb-4">
                  Esta beca fue archivada el {formatFecha(beca?.fechaArchivo ?? beca?.fechaCierre)}
                  {beca?.cerradaPor?.nombre ? ` por ${beca.cerradaPor.nombre}` : ''}. Todos sus
                  datos se conservan para consulta histórica.
                </Alert>
              )}
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
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleBeca;