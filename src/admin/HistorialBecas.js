// src/components/HistorialBecas.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Form, Button, Table, Badge, Modal, ListGroup, Row, Col } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const historialData = [
  {
    id: 1,
    codigo: 'PI-UATF-015',
    becario: 'Carlos Vargas',
    tutor: 'Mg. Soliz',
    proyecto: 'Modelo predictivo de enfermedades en cultivos de quinua',
    fechaInicio: '2021-03-10',
    fechaFin: '2021-11-25',
    fechaArchivo: '2022-01-15',
    calificacionFinal: 9.5,
    observacionesFinales: 'Investigación sobresaliente con resultados de alto impacto para el sector agrícola.',
    reportes: [
      { nombre: 'Informe Inicial', fecha: '2021-06-15' },
      { nombre: 'Avance de Medio Término', fecha: '2021-09-20' },
      { nombre: 'Informe Final', fecha: '2021-11-25' }
    ]
  },
  {
    id: 2,
    codigo: 'PI-UATF-012',
    becario: 'María Choque',
    tutor: 'Dr. Fernández',
    proyecto: 'Aplicación de blockchain en la trazabilidad de productos agrícolas',
    fechaInicio: '2021-05-15',
    fechaFin: '2022-01-20',
    fechaArchivo: '2022-02-10',
    calificacionFinal: 7.8,
    observacionesFinales: 'Trabajo innovador con enfoque tecnológico actual. Se requieren ajustes en la implementación del prototipo.',
    reportes: [
      { nombre: 'Avance Q1', fecha: '2021-08-15' },
      { nombre: 'Avance Q3', fecha: '2021-11-20' },
      { nombre: 'Informe Final', fecha: '2022-01-20' }
    ]
  },
  {
    id: 3,
    codigo: 'PI-UATF-008',
    becario: 'José Flores',
    tutor: 'Lic. Rojas',
    proyecto: 'Estudio de impacto ambiental de minería artesanal',
    fechaInicio: '2022-02-20',
    fechaFin: '2022-10-30',
    fechaArchivo: '2022-11-05',
    calificacionFinal: null,
    observacionesFinales: 'El proyecto fue concluido pero no se presentó el informe final para evaluación.',
    reportes: [
      { nombre: 'Avance 1', fecha: '2022-05-20' },
      { nombre: 'Avance 2', fecha: '2022-08-30' }
    ]
  }
];

const HistorialBecas = () => {
  // --- ESTADO DEL COMPONENTE ---
  const [archivedScholarships, setArchivedScholarships] = useState(historialData);
  const [filters, setFilters] = useState({ search: '', year: 'todos', tutor: 'todos' });
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [userRole, setUserRole] = useState('Director'); // Simular rol: 'Director' o 'Administrador'

  // --- LÓGICA DE FILTRADO ---
  const filteredScholarships = useMemo(() => {
    return archivedScholarships.filter(scholarship => {
      const searchMatch = filters.search === '' || 
        scholarship.codigo.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.becario.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.tutor.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.proyecto.toLowerCase().includes(filters.search.toLowerCase());

      const yearMatch = filters.year === 'todos' || new Date(scholarship.fechaFin).getFullYear().toString() === filters.year;
      const tutorMatch = filters.tutor === 'todos' || scholarship.tutor === filters.tutor;

      return searchMatch && yearMatch && tutorMatch;
    });
  }, [archivedScholarships, filters]);

  // --- MANEJADORES DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedScholarship(null);
  };

  const handleRestore = (id) => {
    if (window.confirm('¿Está seguro de que desea restaurar esta beca al listado activo?')) {
      alert(`Beca ${id} restaurada (simulación)`);
      // Aquí iría la lógica para mover la beca de vuelta a la lista activa
    }
  };

  return (
    <div className="historial-becas-wrapper">
      {/* 1. Encabezado */}
      <header className="historial-becas-header">
        <Container>
          <Row className="align-items-center">
            <Col xs={3} className="text-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="50"
                height="50"
                className="d-inline-block align-top"
                alt="Logo UATF"
              />
            </Col>
            <Col xs={6} className="text-center">
              <h1 className="h4 mb-0 fw-bold">Historial de Becas Archivadas</h1>
            </Col>
            <Col xs={3} className="text-end">
              <span className="d-block text-muted small">{userRole}</span>
              <strong>Nombre del Usuario</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <main className="historial-becas-main">
        <Container>
          {/* 2. Filtros */}
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label>Buscar (código, becario, tutor o proyecto)</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Ingrese término de búsqueda..."
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label>Año/Gestión</Form.Label>
                    <Form.Select name="year" value={filters.year} onChange={handleFilterChange}>
                      <option value="todos">Todos</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label>Tutor</Form.Label>
                    <Form.Select name="tutor" value={filters.tutor} onChange={handleFilterChange}>
                      <option value="todos">Todos</option>
                      <option value="Mg. Soliz">Mg. Soliz</option>
                      <option value="Dr. Fernández">Dr. Fernández</option>
                      <option value="Lic. Rojas">Lic. Rojas</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control plaintext readOnly defaultValue="Archivada" />
                  </Col>
                  <Col md={1}>
                    <Button variant="primary" className="w-100">Aplicar filtros</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* 3. Tabla principal (solo lectura) */}
          <Card>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Becario</th>
                  <th>Tutor</th>
                  <th>Proyecto</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Fecha de archivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredScholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td>{scholarship.codigo}</td>
                    <td>{scholarship.becario}</td>
                    <td>{scholarship.tutor}</td>
                    <td>{scholarship.proyecto}</td>
                    <td>{scholarship.fechaInicio}</td>
                    <td>{scholarship.fechaFin}</td>
                    <td>{scholarship.fechaArchivo}</td>
                    <td>
                      <Badge bg="secondary">Archivada</Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(scholarship)}>
                        Ver detalles
                      </Button>
                      {userRole === 'Administrador' && (
                        <Button variant="outline-warning" size="sm" className="ms-1" onClick={() => handleRestore(scholarship.id)}>
                          Restaurar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </main>

      {/* 4. Modal / Visor de detalles (solo lectura) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedScholarship && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedScholarship.codigo} (Archivada)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Becario:</strong> {selectedScholarship.becario}</p>
                  <p><strong>Tutor:</strong> {selectedScholarship.tutor}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Fecha de Inicio:</strong> {selectedScholarship.fechaInicio}</p>
                  <p><strong>Fecha de Fin:</strong> {selectedScholarship.fechaFin}</p>
                </Col>
              </Row>
              <hr />
              <p><strong>Proyecto:</strong> {selectedScholarship.proyecto}</p>
              <p><strong>Fecha de Archivo:</strong> {selectedScholarship.fechaArchivo}</p>
              <hr />
              <h6>Resumen de Evaluación Final</h6>
              {selectedScholarship.calificacionFinal !== null ? (
                <>
                  <p><strong>Calificación:</strong> {selectedScholarship.calificacionFinal} / 10</p>
                  <p><strong>Observaciones:</strong> {selectedScholarship.observacionesFinales}</p>
                </>
              ) : (
                <p className="text-muted">No se registró una evaluación final para esta beca.</p>
              )}
              <hr />
              <h6>Vínculos de Reportes</h6>
              <ListGroup>
                {selectedScholarship.reportes.map((reporte, index) => (
                  <ListGroup.Item key={index}>
                    {reporte.nombre} - {reporte.fecha}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              {userRole === 'Administrador' && (
                <Button variant="warning" onClick={() => handleRestore(selectedScholarship.id)}>
                  Restaurar
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* 5. Pie institucional */}
      <footer className="historial-becas-footer">
        <Container>
          <p className="mb-0 text-center">
            Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
          </p>
          <p className="text-center small text-muted">
            {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default HistorialBecas;