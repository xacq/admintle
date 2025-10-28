import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../becario/estudiante.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const infoGeneral = {
  nombreTutor: 'Lic. Anny Mercado Algarañaz',
  tituloProyecto: 'Análisis de Algoritmos de Optimización para Big Data',
  estadoBeca: 'Activa'
};

const indicadoresPersonales = {
  reportesEnviados: 3,
  reportesPendientes: 1,
  calificacionPromedio: 8.7
};

const reportesEnviadosData = [
  {
    numero: 1,
    fechaEnvio: '2024-07-15',
    estado: 'Aprobado',
    observaciones: 'Buen avance inicial. Sugerir ampliar la sección de metodología.'
  },
  {
    numero: 2,
    fechaEnvio: '2024-08-15',
    estado: 'Devuelto',
    observaciones: 'Faltan los gráficos de rendimiento. Por favor, adjuntarlos.'
  },
  {
    numero: 3,
    fechaEnvio: '2024-09-15',
    estado: 'Pendiente de Revisión',
    observaciones: 'Enviado para revisión del tutor.'
  }
];

const DashboardBecario = () => {
  const navigate = useNavigate();

  // --- MANEJADORES DE NAVEGACIÓN ---
  const handleVerDetalles = (numeroReporte) => {
    navigate(`/becario/reportes/${numeroReporte}`);
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

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Devuelto':
        return 'danger';
      case 'Pendiente de Revisión':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="dashboard-becario-wrapper">
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
              <h1 className="h3 mb-0 fw-bold">Panel del Becario Auxiliar de Investigación</h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span><br/>
              <strong>Juan Pérez Mamani</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        {/* 2. Panel de información general */}
        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold">Información de mi Beca</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <p className="mb-1"><strong>Nombre del tutor asignado:</strong></p>
                <p>{infoGeneral.nombreTutor}</p>
              </Col>
              <Col md={5}>
                <p className="mb-1"><strong>Código o título del proyecto:</strong></p>
                <p>{infoGeneral.tituloProyecto}</p>
              </Col>
              <Col md={3}>
                <p className="mb-1"><strong>Estado actual de la beca:</strong></p>
                <p>
                  <Badge bg="success">
                    {infoGeneral.estadoBeca}
                  </Badge>
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 3. Panel de avance personal */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{indicadoresPersonales.reportesEnviados}</h2>
                <p className="text-muted mb-0">Reportes Enviados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-warning">{indicadoresPersonales.reportesPendientes}</h2>
                <p className="text-muted mb-0">Reportes Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{indicadoresPersonales.calificacionPromedio}</h2>
                <p className="text-muted mb-0">Calificación Promedio</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* 4. Listado de reportes enviados */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Mis Reportes Enviados</Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>N.º de reporte</th>
                      <th>Fecha de envío</th>
                      <th>Estado</th>
                      <th>Observaciones del tutor</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesEnviadosData.map((reporte) => (
                      <tr key={reporte.numero}>
                        <td>{reporte.numero}</td>
                        <td>{reporte.fechaEnvio}</td>
                        <td>
                          <Badge bg={getEstadoBadgeVariant(reporte.estado)}>
                            {reporte.estado}
                          </Badge>
                        </td>
                        <td>{reporte.observaciones}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleVerDetalles(reporte.numero)}
                          >
                            Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* 5. Accesos directos */}
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Accesos Directos</Card.Header>
              <Card.Body className="d-flex flex-column justify-content-around">
                <Button 
                  variant="primary" 
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Subir Nuevo Reporte de Avance')}
                >
                  📤 Subir Nuevo Reporte de Avance
                </Button>
                <Button 
                  variant="info" 
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Revisar Observaciones del Tutor')}
                >
                  💬 Revisar Observaciones del Tutor
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-100"
                  onClick={() => handleAccesoDirecto('Ver Calificaciones Finales')}
                >
                  📊 Ver Calificaciones Finales
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 6. Pie de página */}
      <footer className="dashboard-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default DashboardBecario;
