import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import './estudiante.css';

const estadoVariant = {
  Pendiente: 'warning',
  Firmado: 'success',
  Observado: 'danger',
};

const MisReportes = () => {
  const user = useSessionUser();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrimestre, setSelectedTrimestre] = useState('todos');

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const loadReportes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/reportes-avance?becario_id=${user.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        const ordered = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const dateA = new Date(a.fechaReporte ?? a.createdAt ?? 0);
              const dateB = new Date(b.fechaReporte ?? b.createdAt ?? 0);
              return dateB - dateA;
            })
          : [];
        setReportes(ordered);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'No se pudo cargar el historial de reportes.');
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    loadReportes();

    return () => controller.abort();
  }, [user?.id]);

  const resumen = useMemo(() => {
    if (!reportes.length) {
      return { total: 0, promedioAvance: 0, firmados: 0 };
    }

    const total = reportes.length;
    const promedio = Math.round(
      reportes.reduce((acc, reporte) => acc + (reporte.porcentajeAvance ?? 0), 0) / total,
    );
    const firmados = reportes.filter(
      (reporte) => reporte.firmadoTutor && reporte.firmadoBecario && reporte.firmadoDirector,
    ).length;

    return { total, promedioAvance: promedio, firmados };
  }, [reportes]);

  const filteredReportes = useMemo(() => {
    if (selectedTrimestre === 'todos') {
      return reportes;
    }

    return reportes.filter((reporte) => String(reporte.trimestre) === selectedTrimestre);
  }, [reportes, selectedTrimestre]);

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }

    return new Date(value).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="mis-reportes-wrapper">
      <Header />
      <section className="text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">Mis reportes institucionales</h1>
          <p className="text-muted mb-0">
            Consulta el seguimiento trimestral generado por tu tutor y las observaciones registradas por el
            director del programa.
          </p>
        </Container>
      </section>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h2 className="text-primary">{resumen.total}</h2>
                <p className="text-muted mb-0">Reportes registrados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h2 className="text-success">{resumen.promedioAvance}%</h2>
                <p className="text-muted mb-0">Promedio de avance</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h2 className="text-info">{resumen.firmados}</h2>
                <p className="text-muted mb-0">Reportes con firmas completas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h5 className="mb-2 mb-md-0 fw-bold">Historial trimestral</h5>
            <Form.Select
              aria-label="Filtrar por trimestre"
              value={selectedTrimestre}
              onChange={(event) => setSelectedTrimestre(event.target.value)}
              style={{ maxWidth: '240px' }}
            >
              <option value="todos">Todos los trimestres</option>
              {[1, 2, 3, 4].map((option) => (
                <option key={option} value={option}>
                  Trimestre {option}
                </option>
              ))}
            </Form.Select>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando reportes…</span>
              </div>
            ) : filteredReportes.length === 0 ? (
              <p className="mb-0">Aún no tienes reportes para el trimestre seleccionado.</p>
            ) : (
              filteredReportes.map((reporte) => (
                <Card key={reporte.id} className="mis-reportes-card mb-3">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                      <div>
                        <h5 className="mb-1">
                          {reporte.proyecto}{' '}
                          <Badge bg={estadoVariant[reporte.estado] ?? 'secondary'}>{reporte.estado}</Badge>
                        </h5>
                        <small className="text-muted">
                          Trimestre {reporte.trimestre} · Fecha de registro: {formatDate(reporte.fechaReporte)}
                        </small>
                      </div>
                      <div className="text-md-end mt-3 mt-md-0">
                        <span className="text-muted d-block">Porcentaje de avance</span>
                        <strong className="text-primary fs-4">{reporte.porcentajeAvance ?? 0}%</strong>
                      </div>
                    </div>

                    <Row className="g-3 mb-3">
                      <Col md={4}>
                        <p className="text-muted mb-1">Carrera</p>
                        <p className="fw-semibold mb-0">{reporte.carrera}</p>
                      </Col>
                      <Col md={4}>
                        <p className="text-muted mb-1">Estudiante</p>
                        <p className="fw-semibold mb-0">{reporte.universitario}</p>
                      </Col>
                      <Col md={4}>
                        <p className="text-muted mb-1">Tutor responsable</p>
                        <p className="fw-semibold mb-0">{reporte.tutor?.nombre ?? '—'}</p>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <Table responsive size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>No</th>
                            <th>Fecha</th>
                            <th>Actividad</th>
                            <th>Resultado del avance (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(reporte.actividades ?? []).map((actividad, index) => (
                            <tr key={`${reporte.id}-${actividad.numero ?? index}`}> 
                              <td>{actividad.numero ?? index + 1}</td>
                              <td>{formatDate(actividad.fecha)}</td>
                              <td>{actividad.actividad}</td>
                              <td>{actividad.resultado}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {reporte.observaciones && (
                      <Alert variant="light" className="border-start border-4 border-primary">
                        <strong>Observaciones:</strong> {reporte.observaciones}
                      </Alert>
                    )}

                    <div className="d-flex flex-wrap signature-pill-group">
                      <div className={`signature-pill ${reporte.firmadoTutor ? 'signed' : ''}`}>
                        Tutor: {reporte.firmadoTutor ? 'Firmado' : 'Pendiente'}
                      </div>
                      <div className={`signature-pill ${reporte.firmadoBecario ? 'signed' : ''}`}>
                        Becario: {reporte.firmadoBecario ? 'Firmado' : 'Pendiente'}
                      </div>
                      <div className={`signature-pill ${reporte.firmadoDirector ? 'signed' : ''}`}>
                        Director: {reporte.firmadoDirector ? 'Firmado' : 'Pendiente'}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MisReportes;
