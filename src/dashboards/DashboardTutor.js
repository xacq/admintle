// src/components/DashboardTutor.js

import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // 👈 agregado para navegación
import '../docente/docente.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const indicadoresPersonales = {
  becariosAsignados: 5,
  reportesRevisados: 12,
  evaluacionesPendientes: 2
};

const becariosAsignadosData = [
  {
    codigo: 'PI-UATF-041',
    nombre: 'Ana Guzmán',
    ultimoReporte: 'Avance de Septiembre',
    estado: 'Pendiente de Revisión',
    fechaEntrega: '2024-09-15'
  },
  {
    codigo: 'PI-UATF-042',
    nombre: 'Luis Mamani',
    ultimoReporte: 'Avance de Septiembre',
    estado: 'Aprobado',
    fechaEntrega: '2024-09-14'
  },
  {
    codigo: 'PI-UATF-043',
    nombre: 'José Flores',
    ultimoReporte: 'Avance de Agosto',
    estado: 'Devuelto',
    fechaEntrega: '2024-08-31'
  },
  {
    codigo: 'PI-UATF-044',
    nombre: 'María Choque',
    ultimoReporte: 'Avance de Septiembre',
    estado: 'Pendiente de Revisión',
    fechaEntrega: '2024-09-16'
  },
  {
    codigo: 'PI-UATF-045',
    nombre: 'Carlos Vargas',
    ultimoReporte: 'Informe Final',
    estado: 'Pendiente de Revisión',
    fechaEntrega: '2024-09-20'
  }
];

const DashboardTutor = () => {
  const navigate = useNavigate(); // 👈 para navegación entre rutas

  // --- MANEJADORES DE EVENTOS (MODIFICADOS) ---
  const handleRevisarReporte = (codigo, nombre) => {
    // Navega al historial del estudiante seleccionado
    navigate(`/tutor/estudiante/${codigo}`);
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

  // Función para asignar color al badge de estado
  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Pendiente de Revisión':
        return 'warning';
      case 'Devuelto':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="dashboard-tutor-wrapper">
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
              <h1 className="h3 mb-0 fw-bold">Panel de Seguimiento y Evaluación de Becarios Auxiliares de Investigación</h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span><br/>
              <strong>Lic. Anny Mercado Algarañaz</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        {/* 2. Panel de indicadores personales */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{indicadoresPersonales.becariosAsignados}</h2>
                <p className="text-muted mb-0">Becarios Asignados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{indicadoresPersonales.reportesRevisados}</h2>
                <p className="text-muted mb-0">Reportes Revisados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-danger">{indicadoresPersonales.evaluacionesPendientes}</h2>
                <p className="text-muted mb-0">Evaluaciones Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* 3. Listado de becarios asignados */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Mis Becarios Asignados</Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código de beca</th>
                      <th>Nombre del becario</th>
                      <th>Último reporte recibido</th>
                      <th>Estado</th>
                      <th>Fecha de entrega</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {becariosAsignadosData.map((becario) => (
                      <tr key={becario.codigo}>
                        <td>{becario.codigo}</td>
                        <td>{becario.nombre}</td>
                        <td>{becario.ultimoReporte}</td>
                        <td>
                          <Badge bg={getEstadoBadgeVariant(becario.estado)}>
                            {becario.estado}
                          </Badge>
                        </td>
                        <td>{becario.fechaEntrega}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleRevisarReporte(becario.codigo, becario.nombre)}
                          >
                            Revisar
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
                  onClick={() => handleAccesoDirecto('Revisar Reportes de Avance')}
                >
                  📄 Revisar Reportes de Avance
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
                  💬 Consultar Observaciones Anteriores
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
          {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default DashboardTutor;
