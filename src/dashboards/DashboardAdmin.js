import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import '../admin/admin.css';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError(err.message || 'No se pudo cargar la información de becas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBecas();
  }, []);

  const estadisticas = useMemo(() => {
    const total = becas.length;
    const activas = becas.filter((beca) => beca.estado === 'Activa').length;
    const evaluacion = becas.filter((beca) => beca.estado === 'En evaluación').length;
    const finalizadas = becas.filter((beca) => beca.estado === 'Finalizada').length;
    const archivadas = becas.filter((beca) => beca.estado === 'Archivada').length;

    return {
      total,
      activas,
      evaluacion,
      finalizadas,
      archivadas,
    };
  }, [becas]);

  const becasDestacadas = useMemo(() => {
    return becas
      .filter((beca) => beca.estado === 'Activa' || beca.estado === 'En evaluación')
      .slice(0, 5);
  }, [becas]);

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

  const handleVerDetalles = (codigo) => {
    navigate('/listabecas', { state: { focusBecaCodigo: codigo } });
  };

  const handleAccesoDirecto = (modulo) => {
    switch (modulo) {
      case 'Gestión de Becas':
        navigate('/listabecas');
        break;
      case 'Reportes Institucionales':
        navigate('/generacionreportes');
        break;
      case 'Configuración del Sistema':
        navigate('/panelconfiguracion');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-admin-wrapper">
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
                Sistema de Becas Auxiliares de Investigación
              </h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span>
              <br />
              <strong>{user?.name ?? 'Administrador'}</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{estadisticas.total}</h2>
                <p className="text-muted mb-0">Becas registradas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{estadisticas.activas}</h2>
                <p className="text-muted mb-0">Becas activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-warning">{estadisticas.evaluacion}</h2>
                <p className="text-muted mb-0">En evaluación</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-dark">{estadisticas.archivadas}</h2>
                <p className="text-muted mb-0">Becas en archivo histórico</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {estadisticas.finalizadas > 0 && (
          <Row className="mb-4">
            <Col>
              <div className="alert alert-info mb-0" role="alert">
                {estadisticas.finalizadas === 1
                  ? 'Existe 1 beca finalizada pendiente de archivo.'
                  : `Existen ${estadisticas.finalizadas} becas finalizadas pendientes de archivo.`}
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Becas destacadas
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Cargando información…
                        </td>
                      </tr>
                    ) : becasDestacadas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No hay becas registradas todavía.
                        </td>
                      </tr>
                    ) : (
                      becasDestacadas.map((beca) => (
                        <tr key={beca.id}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                          <td>{beca.tutor?.nombre ?? 'Sin asignar'}</td>
                          <td>
                            <Badge bg={getEstadoBadgeVariant(beca.estado)}>
                              {beca.estado}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleVerDetalles(beca.codigo)}
                            >
                              Ver
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
                  onClick={() => handleAccesoDirecto('Gestión de Becas')}
                >
                  📋 Gestión de Becas
                </Button>
                <Button
                  variant="info"
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Reportes Institucionales')}
                >
                  📊 Reportes Institucionales
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => handleAccesoDirecto('Configuración del Sistema')}
                >
                  ⚙️ Configuración del Sistema
                </Button>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Header as="h5" className="fw-bold">
                Resumen de estados
              </Card.Header>
              <Card.Body>
                <p className="mb-2 d-flex justify-content-between">
                  <span>Becas finalizadas</span>
                  <strong>{estadisticas.finalizadas}</strong>
                </p>
                <p className="mb-0 d-flex justify-content-between">
                  <span>Total gestionado</span>
                  <strong>{estadisticas.total}</strong>
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

export default DashboardAdmin;
