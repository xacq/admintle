// src/components/DashboardDirector.js

import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // 👈 agregado para navegación
import './evaluador.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const indicadores = {
  becasActivas: 38,
  becasFinalizadas: 12,
  evaluacionesRegistradas: 85
};

const becasEnCursoData = [
  {
    codigo: 'PI-UATF-041',
    becario: 'Ana Guzmán',
    tutor: 'Lic. Cárdenas',
    estado: 'Activa',
    fechaInicio: '2024-03-15'
  },
  {
    codigo: 'PI-UATF-042',
    becario: 'Luis Mamani',
    tutor: 'Ing. Rodríguez',
    estado: 'En Evaluación',
    fechaInicio: '2024-04-10'
  },
  {
    codigo: 'PI-UATF-043',
    becario: 'José Flores',
    tutor: 'Lic. Rojas',
    estado: 'Activa',
    fechaInicio: '2024-02-20'
  },
  {
    codigo: 'PI-UATF-044',
    becario: 'María Choque',
    tutor: 'Dr. Fernández',
    estado: 'Pendiente de Documentación',
    fechaInicio: '2024-05-01'
  },
  {
    codigo: 'PI-UATF-045',
    becario: 'Carlos Vargas',
    tutor: 'Mg. Soliz',
    estado: 'Activa',
    fechaInicio: '2024-03-10'
  }
];

const DashboardDirector = () => {
  const navigate = useNavigate(); // 👈 para redirecciones entre rutas

  // --- MANEJADORES DE EVENTOS (actualizados) ---
  const handleVerDetalles = (codigo) => {
    navigate(`/director/beca/${codigo}`); // 👈 lleva a la vista DetalleBeca.js
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

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'success';
      case 'En Evaluación':
        return 'warning';
      case 'Pendiente de Documentación':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="dashboard-director-wrapper">
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
              <h1 className="h3 mb-0 fw-bold">
                Panel de Supervisión del Programa de Becas Auxiliares de Investigación
              </h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span><br/>
              <strong>Director</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        {/* 2. Panel de indicadores generales */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{indicadores.becasActivas}</h2>
                <p className="text-muted mb-0">Becas Activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{indicadores.becasFinalizadas}</h2>
                <p className="text-muted mb-0">Becas Finalizadas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-info">{indicadores.evaluacionesRegistradas}</h2>
                <p className="text-muted mb-0">Evaluaciones Registradas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* 3. Listado de becas en curso */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Becas en Curso</Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Becario</th>
                      <th>Tutor</th>
                      <th>Estado</th>
                      <th>Fecha de inicio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {becasEnCursoData.map((beca) => (
                      <tr key={beca.codigo}>
                        <td>{beca.codigo}</td>
                        <td>{beca.becario}</td>
                        <td>{beca.tutor}</td>
                        <td>
                          <Badge bg={getEstadoBadgeVariant(beca.estado)}>
                            {beca.estado}
                          </Badge>
                        </td>
                        <td>{beca.fechaInicio}</td>
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
                  onClick={() => handleAccesoDirecto('Consultar Reportes Institucionales')}
                >
                  📊 Consultar Reportes Institucionales
                </Button>
                <Button 
                  variant="info" 
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Visualizar Evaluaciones de Tutores')}
                >
                  📋 Visualizar Evaluaciones de Tutores
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-100"
                  onClick={() => handleAccesoDirecto('Revisar Becas Finalizadas')}
                >
                  ✅ Revisar Becas Finalizadas
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

export default DashboardDirector;
