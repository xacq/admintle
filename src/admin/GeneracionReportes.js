import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Row, Col, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import './admin.css';

const formatNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('es-BO') : '—';

const formatAverage = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'Sin registros';

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : `${date.toLocaleDateString('es-BO')} ${date.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
};

const estadoBadgeVariant = {
  Pendiente: 'warning',
  Aprobado: 'success',
  Devuelto: 'danger',
  Observado: 'info',
};

const GeneracionReportes = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResumen = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reportes-institucionales/resumen');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      setResumen(payload);
    } catch (err) {
      setError(err.message || 'No se pudo recuperar la información institucional.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumen();
  }, []);

  const tarjetasResumen = useMemo(() => {
    if (!resumen) {
      return [];
    }

    return [
      {
        titulo: 'Becas activas',
        valor: formatNumber(resumen.becas?.activas ?? 0),
        descripcion: 'Programas en ejecución con becarios asignados.',
      },
      {
        titulo: 'Becas finalizadas',
        valor: formatNumber(resumen.becas?.finalizadas ?? 0),
        descripcion: 'Procesos concluidos y archivados.',
      },
      {
        titulo: 'En evaluación',
        valor: formatNumber(resumen.becas?.enEvaluacion ?? 0),
        descripcion: 'Becas en etapa de revisión de resultados.',
      },
      {
        titulo: 'Promedio general',
        valor: formatAverage(resumen.evaluaciones?.promedioGeneral),
        descripcion: 'Calificación final promedio otorgada por los tutores.',
      },
    ];
  }, [resumen]);

  const topTutores = resumen?.tutores?.top ?? [];
  const reportesRecientes = resumen?.reportes?.recientes ?? [];
  const reportesPorEstado = resumen?.reportes?.porEstado ?? {};
  const evaluacionesPorEstado = resumen?.evaluaciones?.porEstado ?? {};

  return (
    <div className="generacion-reportes-wrapper">
      <Container className="py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="h3 fw-bold mb-1">Reportes Institucionales del Programa de Becas</h1>
            <p className="text-muted mb-0">
              Visualización consolidada para directores y coordinadores DyCIT.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={loadResumen} disabled={loading}>
              🔄 Actualizar datos
            </Button>
            <Button variant="outline-secondary" size="sm" disabled>
              📄 Exportar PDF
            </Button>
            <Button variant="outline-secondary" size="sm" disabled>
              📊 Exportar Excel
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Row className="g-4 mb-4">
              {tarjetasResumen.map((tarjeta) => (
                <Col key={tarjeta.titulo} xs={12} md={6} xl={3}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title className="text-uppercase text-muted fs-6 fw-semibold">
                        {tarjeta.titulo}
                      </Card.Title>
                      <h2 className="display-6 fw-bold mb-2">{tarjeta.valor}</h2>
                      <Card.Text className="text-muted small mb-0">{tarjeta.descripcion}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row className="g-4">
              <Col lg={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Header as="h5" className="fw-semibold">Tutores con más becas asignadas</Card.Header>
                  <Card.Body>
                    {topTutores.length === 0 ? (
                      <p className="text-muted mb-0">No hay tutores registrados en el sistema.</p>
                    ) : (
                      <Table responsive hover size="sm" className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">#</th>
                            <th>Nombre</th>
                            <th className="text-end">Becas asignadas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topTutores.map((tutor) => (
                            <tr key={tutor.id}>
                              <td className="text-center fw-semibold">{tutor.posicion}</td>
                              <td>{tutor.nombre}</td>
                              <td className="text-end">{formatNumber(tutor.becasAsignadas)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Header as="h5" className="fw-semibold">Estado global de evaluaciones finales</Card.Header>
                  <Card.Body>
                    {Object.keys(evaluacionesPorEstado).length === 0 ? (
                      <p className="text-muted mb-0">No existen evaluaciones registradas todavía.</p>
                    ) : (
                      <Table responsive size="sm" className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Estado</th>
                            <th className="text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(evaluacionesPorEstado).map(([estado, total]) => (
                            <tr key={estado}>
                              <td>{estado}</td>
                              <td className="text-end">{formatNumber(total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mt-1">
              <Col lg={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Header as="h5" className="fw-semibold">Actividad reciente de reportes</Card.Header>
                  <Card.Body>
                    {reportesRecientes.length === 0 ? (
                      <p className="text-muted mb-0">No se registran envíos recientes de reportes.</p>
                    ) : (
                      <Table responsive hover size="sm" className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Fecha de envío</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportesRecientes.map((reporte) => (
                            <tr key={reporte.id}>
                              <td>
                                <div className="fw-semibold">{reporte.titulo}</div>
                                <div className="text-muted small">
                                  {reporte.becario || 'Becario no asignado'}
                                  {reporte.tutor ? ` · Tutor: ${reporte.tutor}` : ''}
                                </div>
                              </td>
                              <td>
                                <Badge bg={estadoBadgeVariant[reporte.estado] ?? 'secondary'}>
                                  {reporte.estado}
                                </Badge>
                              </td>
                              <td>{formatDateTime(reporte.fechaEnvio)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Header as="h5" className="fw-semibold">Reportes por estado</Card.Header>
                  <Card.Body>
                    {Object.keys(reportesPorEstado).length === 0 ? (
                      <p className="text-muted mb-0">No existen reportes registrados.</p>
                    ) : (
                      <Table responsive size="sm" className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Estado</th>
                            <th className="text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(reportesPorEstado).map(([estado, total]) => (
                            <tr key={estado}>
                              <td>{estado}</td>
                              <td className="text-end">{formatNumber(total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default GeneracionReportes;

