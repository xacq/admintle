// src/components/RevisarReportes.js

import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import '.docente.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const reportesData = [
  {
    id: 1,
    codigoProyecto: 'PI-UATF-041',
    becario: 'Ana Guzmán',
    fechaEnvio: '2024-09-15',
    estado: 'Pendiente',
    descripcion: 'Avance correspondiente al tercer trimestre. Se incluyen los resultados preliminares de las pruebas de rendimiento.',
    archivoAdjunto: 'avance_trimestre3.pdf',
    observaciones: ''
  },
  {
    id: 2,
    codigoProyecto: 'PI-UATF-042',
    becario: 'Luis Mamani',
    fechaEnvio: '2024-09-14',
    estado: 'Aprobado',
    descripcion: 'Informe final del proyecto con conclusiones y recomendaciones.',
    archivoAdjunto: 'informe_final.pdf',
    observaciones: 'Excelente trabajo. Conclusiones muy bien fundamentadas.'
  },
  {
    id: 3,
    codigoProyecto: 'PI-UATF-043',
    becario: 'José Flores',
    fechaEnvio: '2024-09-16',
    estado: 'Devuelto',
    descripcion: 'Avance del segundo trimestre.',
    archivoAdjunto: 'avance_t2.pdf',
    observaciones: 'Faltan los gráficos comparativos. Por favor, incluirlos en la próxima versión.'
  }
];

const RevisarReportes = () => {
  // --- ESTADO DEL COMPONENTE ---
  const [reportes, setReportes] = useState(reportesData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    observaciones: '',
    estado: 'Pendiente'
  });

  // --- FUNCIONES AUXILIARES ---
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Devuelto':
        return 'danger';
      case 'Pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // --- MANEJADORES DE EVENTOS ---
  const handleRevisar = (reporte) => {
    setSelectedReport(reporte);
    setFormData({
      observaciones: reporte.observaciones || '',
      estado: reporte.estado
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGuardarRevision = () => {
    if (!selectedReport) return;

    // Actualizar el reporte en la lista
    setReportes(reportes.map(reporte => 
      reporte.id === selectedReport.id 
        ? { ...reporte, estado: formData.estado, observaciones: formData.observaciones }
        : reporte
    ));

    alert('Revisión guardada correctamente.');
    handleCloseModal();
  };

  const handleDescargarArchivo = (archivo) => {
    alert(`Descargando archivo: ${archivo} (simulación)`);
  };

  return (
    <div className="revisar-reportes-wrapper">
      {/* Encabezado */}
      <header className="revisar-reportes-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">Revisión de Reportes de Avance</h1>
          <p className="text-muted">Listado de reportes enviados por los becarios asignados</p>
        </Container>
      </header>

      <Container className="py-4">
        {/* 1. Tabla de reportes recibidos */}
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Código del proyecto</th>
                  <th>Becario</th>
                  <th>Fecha de envío</th>
                  <th>Estado actual</th>
                  <th>Archivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte) => (
                  <tr key={reporte.id}>
                    <td>{reporte.codigoProyecto}</td>
                    <td>{reporte.becario}</td>
                    <td>{reporte.fechaEnvio}</td>
                    <td>
                      <Badge bg={getEstadoVariant(reporte.estado)}>
                        {reporte.estado}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => handleDescargarArchivo(reporte.archivoAdjunto)}
                      >
                        📎 {reporte.archivoAdjunto}
                      </Button>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleRevisar(reporte)}
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
      </Container>

      {/* 2. Panel de revisión (Modal) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedReport && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Revisar Reporte - {selectedReport.codigoProyecto}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Becario:</strong></Form.Label>
                  <p>{selectedReport.becario}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Fecha de envío:</strong></Form.Label>
                  <p>{selectedReport.fechaEnvio}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Descripción del reporte:</strong></Form.Label>
                  <p>{selectedReport.descripcion}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Archivo adjunto:</strong></Form.Label>
                  <p>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => handleDescargarArchivo(selectedReport.archivoAdjunto)}
                    >
                      📎 {selectedReport.archivoAdjunto}
                    </Button>
                  </p>
                </Form.Group>
                <hr />
                <Form.Group className="mb-3">
                  <Form.Label><strong>Observaciones para el becario:</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleFormChange}
                    placeholder="Escriba aquí sus comentarios y sugerencias..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Seleccionar estado:</strong></Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleFormChange}
                  >
                    <option value="Pendiente">🕓 Pendiente</option>
                    <option value="Aprobado">✅ Aprobado</option>
                    <option value="Devuelto">⚠️ Devuelto</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarRevision}>
                Guardar revisión
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Pie de página institucional */}
      <footer className="revisar-reportes-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 – {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default RevisarReportes;