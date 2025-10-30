import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Row, Col, ProgressBar, Table, Badge, Alert, Button, Spinner } from 'react-bootstrap';
import useSessionUser from '../hooks/useSessionUser';
import './estudiante.css';

const ESTADO_VARIANTS = {
  Aprobado: 'success',
  Pendiente: 'warning',
  Devuelto: 'danger',
};

const ReportesAvance = () => {
  const user = useSessionUser();
  const [beca, setBeca] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const indicadores = useMemo(() => {
    const total = reportes.length;
    const aprobados = reportes.filter((reporte) => reporte.estado === 'Aprobado').length;
    const pendientes = reportes.filter((reporte) => reporte.estado === 'Pendiente').length;
    const devueltos = reportes.filter((reporte) => reporte.estado === 'Devuelto').length;

    return { total, aprobados, pendientes, devueltos };
  }, [reportes]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [becaResponse, reportesResponse] = await Promise.all([
          fetch(`/api/becas?becario_id=${user.id}`),
          fetch(`/api/reportes?becario_id=${user.id}`),
        ]);

        if (!becaResponse.ok) {
          throw new Error(`Error ${becaResponse.status}`);
        }

        if (!reportesResponse.ok) {
          throw new Error(`Error ${reportesResponse.status}`);
        }

        const becaPayload = await becaResponse.json();
        const becaData = Array.isArray(becaPayload?.data) ? becaPayload.data : becaPayload;
        setBeca(Array.isArray(becaData) ? becaData[0] ?? null : null);

        const reportesPayload = await reportesResponse.json();
        const reportesData = Array.isArray(reportesPayload?.data) ? reportesPayload.data : reportesPayload;
        setReportes(Array.isArray(reportesData) ? reportesData : []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la información de la beca.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const progreso = useMemo(() => {
    if (!reportes.length) {
      return 0;
    }

    const base = 25;
    const aprobados = indicadores.aprobados;
    return Math.min(100, base + aprobados * 15 + (reportes.length - aprobados) * 5);
  }, [indicadores.aprobados, reportes.length]);

  const handleDescargarReporte = (reporte) => {
    if (!reporte?.archivoUrl) {
      return;
    }

    window.open(reporte.archivoUrl, '_blank', 'noopener');
  };

  return (
    <div className="reportes-avance-wrapper">
      <header className="reportes-avance-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">Mis reportes de avance</h1>
          <p className="text-muted">
            Consulta el estado de los informes enviados y las observaciones registradas por tu tutor.
          </p>
        </Container>
      </header>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold">
            Información de la beca
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando información…</span>
              </div>
            ) : !beca ? (
              <p className="mb-0">Aún no tienes una beca activa registrada.</p>
            ) : (
              <Row className="g-3">
                <Col sm={6} md={3} className="fw-bold text-secondary">
                  Código o título
                </Col>
                <Col sm={6} md={9}>{beca.codigo}</Col>

                <Col sm={6} md={3} className="fw-bold text-secondary">
                  Tutor asignado
                </Col>
                <Col sm={6} md={9}>{beca.tutor?.nombre ?? 'Sin asignar'}</Col>

                <Col sm={6} md={3} className="fw-bold text-secondary">
                  Estado actual
                </Col>
                <Col sm={6} md={9}>
                  <Badge bg="info">{beca.estado}</Badge>
                </Col>

                <Col sm={6} md={3} className="fw-bold text-secondary">
                  Reportes registrados
                </Col>
                <Col sm={6} md={9}>{indicadores.total}</Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h5 className="text-muted">Total enviados</h5>
                <h2 className="text-primary">{indicadores.total}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h5 className="text-muted">Aprobados</h5>
                <h2 className="text-success">{indicadores.aprobados}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h5 className="text-muted">En revisión</h5>
                <h2 className="text-warning">{indicadores.pendientes}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h5 className="text-muted">Devueltos</h5>
                <h2 className="text-danger">{indicadores.devueltos}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4">
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Historial de reportes enviados
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando reportes…</span>
                  </div>
                ) : reportes.length === 0 ? (
                  <p className="mb-0">Aún no registraste reportes de avance.</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Fecha de envío</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Archivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportes.map((reporte) => (
                        <tr key={reporte.id}>
                          <td>{reporte.titulo}</td>
                          <td>{reporte.fechaEnvio ? new Date(reporte.fechaEnvio).toLocaleDateString('es-BO') : '—'}</td>
                          <td>
                            <Badge bg={ESTADO_VARIANTS[reporte.estado] ?? 'secondary'}>
                              {reporte.estado}
                            </Badge>
                          </td>
                          <td className="text-break" style={{ maxWidth: '260px' }}>
                            {reporte.observaciones || '—'}
                          </td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => handleDescargarReporte(reporte)}
                              disabled={!reporte.archivoUrl}
                            >
                              📎 {reporte.archivoNombre}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Progreso estimado del proyecto
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-center">
                <p className="text-muted">
                  Este indicador refleja el avance estimado considerando los reportes aprobados y revisiones registradas.
                </p>
                <div className="mb-3">
                  <ProgressBar now={progreso} className="flex-grow-1" />
                </div>
                <h2 className="text-center text-primary">{progreso}%</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="reportes-avance-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 – {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default ReportesAvance;
