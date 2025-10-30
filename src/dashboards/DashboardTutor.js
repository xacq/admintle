import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import '../docente/docente.css';

const DashboardTutor = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportes, setReportes] = useState([]);
  const [reportesLoading, setReportesLoading] = useState(true);
  const [reportesError, setReportesError] = useState('');

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
        setBecas(data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la información de sus becarios.');
      } finally {
        setLoading(false);
      }
    };

    loadBecas();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadReportes = async () => {
      setReportesLoading(true);
      setReportesError('');

      try {
        const response = await fetch(`/api/reportes?tutor_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setReportes(Array.isArray(data) ? data : []);
      } catch (err) {
        setReportesError(err.message || 'No se pudo recuperar el estado de los reportes.');
      } finally {
        setReportesLoading(false);
      }
    };

    loadReportes();
  }, [user?.id]);

  const indicadores = useMemo(() => {
    const asignadas = becas.length;
    const finalizadas = becas.filter((beca) => beca.estado === 'Finalizada').length;
    const evaluacion = becas.filter((beca) => beca.estado === 'En evaluación').length;

    return {
      asignadas,
      finalizadas,
      evaluacion,
    };
  }, [becas]);

  const resumenReportes = useMemo(() => {
    const pendientes = reportes.filter((reporte) => reporte.estado === 'Pendiente').length;
    const aprobados = reportes.filter((reporte) => reporte.estado === 'Aprobado').length;
    const devueltos = reportes.filter((reporte) => reporte.estado === 'Devuelto').length;

    return {
      total: reportes.length,
      pendientes,
      aprobados,
      devueltos,
    };
  }, [reportes]);

  const pendientesPorBeca = useMemo(() => {
    return reportes.reduce((acc, reporte) => {
      if (reporte.estado === 'Pendiente') {
        acc[reporte.becaId] = (acc[reporte.becaId] || 0) + 1;
      }
      return acc;
    }, {});
  }, [reportes]);

  const getEstadoBadgeVariant = (estado) => {
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
        return 'secondary';
    }
  };

  const handleRevisarReporte = (codigo) => {
    navigate('/listaregistros', { state: { focusBecaCodigo: codigo } });
  };

  const handleAccesoDirecto = (modulo) => {
    switch (modulo) {
      case 'Revisar Reportes de Avance':
        navigate('/listaregistros');
        break;
      case 'Registrar Evaluación de Desempeño':
        navigate('/docenteconfig');
        break;
      case 'Consultar Observaciones Anteriores':
        navigate('/notificacionesanteriores');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-tutor-wrapper">
      <header className="dashboard-header text-center py-4 border-bottom">
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
              <h1 className="h3 mb-0 fw-bold">
                Panel de Seguimiento y Evaluación de Becarios Auxiliares de Investigación
              </h1>
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
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{indicadores.asignadas}</h2>
                <p className="text-muted mb-0">Becas asignadas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{becas.filter((beca) => beca.estado === 'Activa').length}</h2>
                <p className="text-muted mb-0">Becas activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-warning">{indicadores.evaluacion}</h2>
                <p className="text-muted mb-0">En evaluación</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Reportes recibidos</h6>
                <h3 className="text-primary mb-0">{resumenReportes.total}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Pendientes</h6>
                <h3 className="text-warning mb-0">{resumenReportes.pendientes}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Aprobados</h6>
                <h3 className="text-success mb-0">{resumenReportes.aprobados}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Devueltos</h6>
                <h3 className="text-danger mb-0">{resumenReportes.devueltos}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Mis becarios asignados
              </Card.Header>
              <Card.Body>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código de beca</th>
                      <th>Nombre del becario</th>
                      <th>Estado</th>
                      <th>Fecha de inicio</th>
                      <th>Fecha de finalización</th>
                      <th>Reportes pendientes</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Cargando becarios…
                        </td>
                      </tr>
                    ) : becas.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Aún no tienes becarios asignados.
                        </td>
                      </tr>
                    ) : (
                      becas.map((beca) => (
                        <tr key={beca.id}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                          <td>
                            <Badge bg={getEstadoBadgeVariant(beca.estado)}>
                              {beca.estado}
                            </Badge>
                          </td>
                          <td>{beca.fechaInicio ?? '—'}</td>
                          <td>{beca.fechaFin ?? '—'}</td>
                          <td>{pendientesPorBeca[beca.id] ?? 0}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleRevisarReporte(beca.codigo)}
                            >
                              Revisar
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
            <div className="d-flex flex-column gap-3 h-100">
              <Card className="flex-fill">
                <Card.Header as="h5" className="fw-bold">
                  Accesos Directos
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-around">
                  <Button
                    variant="primary"
                    className="mb-3 w-100"
                    onClick={() => handleAccesoDirecto('Revisar Reportes de Avance')}
                  >
                    📑 Revisar Reportes de Avance
                  </Button>
                  <Button
                    variant="info"
                    className="mb-3 w-100"
                    onClick={() => handleAccesoDirecto('Registrar Evaluación de Desempeño')}
                  >
                    📝 Registrar Evaluación de Desempeño
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => handleAccesoDirecto('Consultar Observaciones Anteriores')}
                  >
                    🗂️ Consultar Observaciones Anteriores
                  </Button>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header as="h5" className="fw-bold">
                  Estado de los reportes
                </Card.Header>
                <Card.Body>
                  {reportesError && (
                    <Alert variant="danger" className="mb-3">
                      {reportesError}
                    </Alert>
                  )}

                  {reportesLoading ? (
                    <div className="d-flex align-items-center justify-content-center py-3">
                      <Spinner animation="border" role="status" className="me-2" />
                      <span>Cargando reportes…</span>
                    </div>
                  ) : (
                    <>
                      <p className="mb-2 d-flex justify-content-between">
                        <span>Pendientes</span>
                        <strong>{resumenReportes.pendientes}</strong>
                      </p>
                      <p className="mb-2 d-flex justify-content-between">
                        <span>Aprobados</span>
                        <strong>{resumenReportes.aprobados}</strong>
                      </p>
                      <p className="mb-0 d-flex justify-content-between">
                        <span>Devueltos</span>
                        <strong>{resumenReportes.devueltos}</strong>
                      </p>
                    </>
                  )}
                </Card.Body>
              </Card>

              <Card>
                <Card.Header as="h5" className="fw-bold">
                  Resumen rápido
                </Card.Header>
                <Card.Body>
                  <p className="mb-2 d-flex justify-content-between">
                    <span>Finalizadas</span>
                    <strong>{indicadores.finalizadas}</strong>
                  </p>
                  <p className="mb-0 d-flex justify-content-between">
                    <span>Total asignado</span>
                    <strong>{indicadores.asignadas}</strong>
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardTutor;
