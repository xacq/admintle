import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import '../director/evaluador.css';

const DashboardDirector = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBecas = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas');
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

  const indicadores = useMemo(() => {
    const activas = becas.filter((beca) => beca.estado === 'Activa').length;
    const finalizadas = becas.filter((beca) => beca.estado === 'Finalizada').length;
    const evaluacion = becas.filter((beca) => beca.estado === 'En evaluación').length;

    return {
      activas,
      finalizadas,
      evaluacion,
    };
  }, [becas]);

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'success';
      case 'En evaluación':
        return 'warning';
      case 'Finalizada':
        return 'secondary';
      default:
        return 'primary';
    }
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
      </header>

      <Container className="py-4">
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{becas.length}</h2>
                <p className="text-muted mb-0">Becas en seguimiento</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{indicadores.activas}</h2>
                <p className="text-muted mb-0">Becas activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-secondary">{indicadores.finalizadas}</h2>
                <p className="text-muted mb-0">Becas finalizadas</p>
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
            <Card className="h-100">
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
                  📁 Revisar Becas Finalizadas
                </Button>
              </Card.Body>
            </Card>
            <Card className="mt-3">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="dashboard-footer text-center py-3 mt-4 border-top">
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
      </footer>
    </div>
  );
};

export default DashboardDirector;
