import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import '../becario/estudiante.css';

const DashboardBecario = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [beca, setBeca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadBeca = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/becas?becario_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setBeca(Array.isArray(data) ? data[0] ?? null : null);
      } catch (err) {
        setError(err.message || 'No se pudo obtener la información de tu beca.');
      } finally {
        setLoading(false);
      }
    };

    loadBeca();
  }, [user?.id]);

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

  const handleAccesoDirecto = (modulo) => {
    switch (modulo) {
      case 'Subir Nuevo Reporte de Avance':
        navigate('/subirreporte');
        break;
      case 'Revisar Observaciones del Tutor':
        navigate('/observaciones');
        break;
      case 'Ver Calificaciones Finales':
        navigate('/calificaciones');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-becario-wrapper">
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
              <h1 className="h3 mb-0 fw-bold">Panel del Becario Auxiliar de Investigación</h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span>
              <br />
              <strong>{user?.name ?? 'Becario'}</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold">
            Información de mi beca
          </Card.Header>
          <Card.Body>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <p className="mb-0">Cargando información…</p>
            ) : !beca ? (
              <p className="mb-0">
                Aún no tienes una beca registrada. Contacta a tu tutor para más detalles.
              </p>
            ) : (
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Código o título del proyecto:</strong>
                  </p>
                  <p className="mb-0">{beca.codigo}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Tutor asignado:</strong>
                  </p>
                  <p className="mb-0">{beca.tutor?.nombre ?? 'Sin asignar'}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Estado actual:</strong>
                  </p>
                  <Badge bg={getEstadoBadgeVariant(beca.estado)}>{beca.estado}</Badge>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h5 className="text-muted">Fecha de inicio</h5>
                <h2 className="text-primary">{beca?.fechaInicio ?? '—'}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h5 className="text-muted">Fecha de finalización</h5>
                <h2 className="text-success">{beca?.fechaFin ?? '—'}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Resumen de mi proyecto
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tutor</th>
                      <th>Estado</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Cargando datos…
                        </td>
                      </tr>
                    ) : !beca ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Sin registros disponibles.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>{beca.codigo}</td>
                        <td>{beca.tutor?.nombre ?? 'Sin asignar'}</td>
                        <td>
                          <Badge bg={getEstadoBadgeVariant(beca.estado)}>{beca.estado}</Badge>
                        </td>
                        <td>{beca.fechaInicio ?? '—'}</td>
                        <td>{beca.fechaFin ?? '—'}</td>
                      </tr>
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
                  onClick={() => handleAccesoDirecto('Subir Nuevo Reporte de Avance')}
                  disabled={!beca}
                >
                  📤 Subir Nuevo Reporte de Avance
                </Button>
                <Button
                  variant="info"
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Revisar Observaciones del Tutor')}
                  disabled={!beca}
                >
                  🗒️ Revisar Observaciones del Tutor
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => handleAccesoDirecto('Ver Calificaciones Finales')}
                  disabled={!beca}
                >
                  📊 Ver Calificaciones Finales
                </Button>
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

export default DashboardBecario;
