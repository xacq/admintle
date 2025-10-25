import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const estadisticas = {
  totalBecas: 38,
  totalReportes: 124,
  totalUsuarios: 85
};

const becasActivasData = [
  { codigo: 'PI-UATF-041', becario: 'Ana Guzmán', tutor: 'Lic. Cárdenas', estado: 'Activa' },
  { codigo: 'PI-UATF-042', becario: 'Luis Mamani', tutor: 'Ing. Rodríguez', estado: 'Activa' },
  { codigo: 'PI-UATF-043', becario: 'José Flores', tutor: 'Lic. Rojas', estado: 'En Evaluación' },
  { codigo: 'PI-UATF-044', becario: 'María Choque', tutor: 'Dr. Fernández', estado: 'Activa' },
  { codigo: 'PI-UATF-045', becario: 'Carlos Vargas', tutor: 'Mg. Soliz', estado: 'Pendiente de Documentación' }
];

const DashboardAdmin = () => {
  const navigate = useNavigate();

  // --- MANEJADORES DE EVENTOS ---
  const handleVerDetalles = (codigo) => {
    // Redirige al formulario o vista de detalles de la beca
    navigate(`/admin/becas/${codigo}`);
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
      {/* 1. Encabezado institucional */}
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
              <h1 className="h3 mb-0 fw-bold">Sistema de Becas Auxiliares de Investigación</h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span><br/>
              <strong>Administrador</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        {/* 2. Panel de control general */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{estadisticas.totalBecas}</h2>
                <p className="text-muted mb-0">Becas Registradas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{estadisticas.totalReportes}</h2>
                <p className="text-muted mb-0">Reportes Generados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-info">{estadisticas.totalUsuarios}</h2>
                <p className="text-muted mb-0">Usuarios Activos</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* 3. Listado de becas activas */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Becas Activas</Card.Header>
              <Card.Body>
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
                    {becasActivasData.map((beca) => (
                      <tr key={beca.codigo}>
                        <td>{beca.codigo}</td>
                        <td>{beca.becario}</td>
                        <td>{beca.tutor}</td>
                        <td>
                          <Badge 
                            bg={
                              beca.estado === 'Activa' ? 'success' : 
                              beca.estado === 'En Evaluación' ? 'warning' : 'secondary'
                            }
                          >
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
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* 4. Accesos directos */}
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Accesos Directos</Card.Header>
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
          </Col>
        </Row>
      </Container>

      {/* 5. Pie de página */}
      <footer className="dashboard-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 – {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default DashboardAdmin;
