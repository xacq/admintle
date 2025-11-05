import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import '../director/evaluador.css';

const estadoEvaluacionVariant = {
  Aprobado: 'success',
  Reprobado: 'danger',
  Concluido: 'info',
  Pendiente: 'secondary',
};

const DashboardDirector = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportes, setReportes] = useState([]);
  const [reportesLoading, setReportesLoading] = useState(true);
  const [reportesError, setReportesError] = useState('');

  const loadBecas = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas?include_archived=1');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      setBecas(data);
    } catch (err) {
      setError(err.message || 'No se pudo recuperar el estado del programa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBecas();
  }, []);

  useEffect(() => {
    const loadReportes = async () => {
      setReportesLoading(true);
      setReportesError('');

      try {
        const response = await fetch('/api/reportes');
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
  }, []);

  const indicadores = useMemo(() => {
    const activas = becas.filter((beca) => beca.estado === 'Activa').length;
    const finalizadas = becas.filter((beca) => beca.estado === 'Finalizada').length;
    const evaluacion = becas.filter((beca) => beca.estado === 'En evaluación').length;
    const archivadas = becas.filter((beca) => beca.estado === 'Archivada').length;

    return {
      activas,
      finalizadas,
      evaluacion,
      archivadas,
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

  const evaluacionesFinales = useMemo(() => {
    const evaluadas = becas.filter((beca) => beca.evaluacionFinal);
    const total = evaluadas.length;
    const aprobadas = evaluadas.filter((beca) => beca.evaluacionFinal.estadoFinal === 'Aprobado').length;
    const reprobadas = evaluadas.filter((beca) => beca.evaluacionFinal.estadoFinal === 'Reprobado').length;
    const concluidas = evaluadas.filter((beca) => beca.evaluacionFinal.estadoFinal === 'Concluido').length;
    const promedio = total
      ? (
          evaluadas.reduce(
            (sum, beca) => sum + (Number(beca.evaluacionFinal?.calificacionFinal) || 0),
            0,
          ) / total
        ).toFixed(2)
      : '—';

    const registrosOrdenados = [...evaluadas].sort((a, b) => {
      const fechaA = new Date(
        a.evaluacionFinal?.fechaActualizacion || a.evaluacionFinal?.fechaRegistro || 0,
      );
      const fechaB = new Date(
        b.evaluacionFinal?.fechaActualizacion || b.evaluacionFinal?.fechaRegistro || 0,
      );

      return fechaB - fechaA;
    });

    return {
      total,
      aprobadas,
      reprobadas,
      concluidas,
      promedio,
      pendientes: becas.length - total,
      registros: registrosOrdenados.slice(0, 5),
    };
  }, [becas]);

  const reportesRecientes = useMemo(() => reportes.slice(0, 5), [reportes]);

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
        return 'primary';
    }
  };

  const getEvaluacionBadgeVariant = (estado) => estadoEvaluacionVariant[estado] ?? 'secondary';

  const formatEvaluacionCalificacion = (beca) => {
    const valor = beca.evaluacionFinal?.calificacionFinal;

    if (valor === null || valor === undefined) {
      return 'Sin calificación';
    }

    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      return 'Sin calificación';
    }

    return `${numero.toFixed(2)} / 10`;
  };

  const formatEvaluacionFecha = (beca) => {
    const raw = beca.evaluacionFinal?.fechaActualizacion || beca.evaluacionFinal?.fechaRegistro;

    if (!raw) {
      return '—';
    }

    const fecha = new Date(raw);
    return Number.isNaN(fecha.getTime()) ? '—' : fecha.toLocaleDateString('es-BO');
  };

  const handleVerDetalles = (codigo) => {
    navigate('/listabecas', { state: { focusBecaCodigo: codigo } });
  };

  const handleAccesoDirecto = (modulo) => {
    switch (modulo) {
      case 'Consultar Reportes Institucionales':
        navigate('/generacionreportes');
        break;
      case 'Visualizar Evaluaciones de Tutores':
        navigate('/evaluadordesempeno');
        break;
      case 'Revisar Becas Finalizadas':
        navigate('/archivoshistoricos');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-director-wrapper">
      <Header />
      <section className="dashboard-header text-center py-4 border-bottom">
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
                Panel de Supervisión del Programa de Becas Auxiliares de Investigación
              </h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span>
              <br />
              <strong>{user?.name ?? 'Director'}</strong>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{becas.length}</h2>
                <p className="text-muted mb-0">Becas en seguimiento</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{indicadores.activas}</h2>
                <p className="text-muted mb-0">Becas activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-secondary">{indicadores.finalizadas}</h2>
                <p className="text-muted mb-0">Becas finalizadas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-dark">{indicadores.archivadas}</h2>
                <p className="text-muted mb-0">En archivo histórico</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {indicadores.finalizadas > 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="mb-0">
                {indicadores.finalizadas === 1
                  ? 'Existe 1 beca finalizada esperando confirmación de archivo.'
                  : `Existen ${indicadores.finalizadas} becas finalizadas esperando confirmación de archivo.`}
              </Alert>
            </Col>
          </Row>
        )}

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

        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Evaluaciones registradas</h6>
                <h3 className="text-primary mb-0">{evaluacionesFinales.total}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Aprobadas</h6>
                <h3 className="text-success mb-0">{evaluacionesFinales.aprobadas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Reprobadas</h6>
                <h3 className="text-danger mb-0">{evaluacionesFinales.reprobadas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Promedio final</h6>
                <h3 className="text-info mb-0">{evaluacionesFinales.promedio}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Becas registradas
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
                      <th>Código</th>
                      <th>Becario</th>
                      <th>Tutor</th>
                      <th>Estado</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Cargando becas…
                        </td>
                      </tr>
                    ) : becas.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No existen becas registradas actualmente.
                        </td>
                      </tr>
                    ) : (
                      becas.map((beca) => (
                        <tr key={beca.id}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                          <td>{beca.tutor?.nombre ?? 'Sin asignar'}</td>
                          <td>
                            <Badge bg={getEstadoBadgeVariant(beca.estado)}>
                              {beca.estado}
                            </Badge>
                          </td>
                          <td>{beca.fechaInicio ?? '—'}</td>
                          <td>{beca.fechaFin ?? '—'}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleVerDetalles(beca.codigo)}
                            >
                              Ver detalles
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
                    onClick={() => handleAccesoDirecto('Consultar Reportes Institucionales')}
                  >
                    📊 Consultar Reportes Institucionales
                  </Button>
                  <Button
                    variant="info"
                    className="mb-3 w-100"
                    onClick={() => handleAccesoDirecto('Visualizar Evaluaciones de Tutores')}
                  >
                    🧑‍🏫 Evaluaciones de Tutores
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => handleAccesoDirecto('Revisar Becas Finalizadas')}
                  >
                    📁 Revisar Archivo Histórico
                  </Button>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header as="h5" className="fw-bold">
                  Estado general de reportes
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
                      <span>Compilando información…</span>
                    </div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex justify-content-between mb-2">
                        <span>Pendientes</span>
                        <strong>{resumenReportes.pendientes}</strong>
                      </li>
                      <li className="d-flex justify-content-between mb-2">
                        <span>Aprobados</span>
                        <strong>{resumenReportes.aprobados}</strong>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Devueltos</span>
                        <strong>{resumenReportes.devueltos}</strong>
                      </li>
                    </ul>
                  )}
                </Card.Body>
              </Card>

              <Card>
                <Card.Header as="h5" className="fw-bold">
                  Reportes recientes
                </Card.Header>
                <Card.Body>
                  {reportesLoading ? (
                    <div className="d-flex align-items-center justify-content-center py-3">
                      <Spinner animation="border" role="status" className="me-2" />
                      <span>Cargando…</span>
                    </div>
                  ) : reportesRecientes.length === 0 ? (
                    <p className="mb-0">No existen envíos registrados.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {reportesRecientes.map((reporte) => (
                        <li key={reporte.id} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{reporte.becario?.nombre ?? '—'}</strong>
                              <div className="text-muted small">
                                {reporte.fechaEnvio
                                  ? new Date(reporte.fechaEnvio).toLocaleDateString('es-BO')
                                  : '—'}
                              </div>
                            </div>
                            <Badge bg={(() => {
                              switch (reporte.estado) {
                                case 'Aprobado':
                                  return 'success';
                                case 'Devuelto':
                                  return 'danger';
                                case 'Pendiente':
                                default:
                                  return 'warning';
                              }
                            })()}>
                              {reporte.estado}
                            </Badge>
                          </div>
                          <div className="small text-muted">{reporte.beca?.codigo ?? 'Sin código'}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>

              <Card>
                <Card.Header as="h5" className="fw-bold">
                  Estado del programa
                </Card.Header>
                <Card.Body>
                  <p className="mb-2 d-flex justify-content-between">
                    <span>En evaluación</span>
                    <strong>{indicadores.evaluacion}</strong>
                  </p>
                  <p className="mb-2 d-flex justify-content-between">
                    <span>Activas</span>
                    <strong>{indicadores.activas}</strong>
                  </p>
                  <p className="mb-0 d-flex justify-content-between">
                    <span>Finalizadas</span>
                    <strong>{indicadores.finalizadas}</strong>
                  </p>
                  <p className="mb-0 d-flex justify-content-between">
                    <span>Archivadas</span>
                    <strong>{indicadores.archivadas}</strong>
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Evaluaciones finales registradas
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center py-4">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando evaluaciones…</span>
                  </div>
                ) : evaluacionesFinales.total === 0 ? (
                  <p className="mb-0">Aún no se registraron evaluaciones finales.</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Código de beca</th>
                        <th>Becario</th>
                        <th>Calificación final</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluacionesFinales.registros.map((beca) => (
                        <tr key={`evaluacion-${beca.id}`}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? '—'}</td>
                          <td>{formatEvaluacionCalificacion(beca)}</td>
                          <td>
                            <Badge bg={getEvaluacionBadgeVariant(beca.evaluacionFinal?.estadoFinal)}>
                              {beca.evaluacionFinal?.estadoFinal ?? 'Pendiente'}
                            </Badge>
                          </td>
                          <td>{formatEvaluacionFecha(beca)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Resumen de estados finales
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center py-3">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Compilando evaluaciones…</span>
                  </div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex justify-content-between mb-2">
                      <span>Registradas</span>
                      <strong>{evaluacionesFinales.total}</strong>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span>Aprobadas</span>
                      <strong>{evaluacionesFinales.aprobadas}</strong>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span>Reprobadas</span>
                      <strong>{evaluacionesFinales.reprobadas}</strong>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span>Concluidas</span>
                      <strong>{evaluacionesFinales.concluidas}</strong>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span>Pendientes</span>
                      <strong>{evaluacionesFinales.pendientes}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>Promedio general</span>
                      <strong>{evaluacionesFinales.promedio}</strong>
                    </li>
                  </ul>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div className="dashboard-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 –{' '}
          {new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </small>
      </div>
    </div>
  );
};

export default DashboardDirector;
