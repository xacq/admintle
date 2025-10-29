import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import '../docente/docente.css';

const DashboardTutor = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'success';
      case 'En evaluación':
        return 'warning';
      case 'Finalizada':
        return 'secondary';
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          Cargando becarios…
                        </td>
                      </tr>
                    ) : becas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
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
            <Card className="h-100">
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
            <Card className="mt-3">
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardTutor;
