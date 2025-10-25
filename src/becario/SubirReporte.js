// src/components/SubirReporte.js

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import './estudiante.css';

const SubirReporte = () => {
  const navigate = useNavigate();
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    periodo: '',
    resumen: '',
    archivo: null
  });

  // Estado para controlar el mensaje de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  // --- MANEJADORES DE EVENTOS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación simple de tamaño y tipo
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no debe superar los 10 MB.');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos en formato PDF.');
        return;
      }
      setFormData({
        ...formData,
        archivo: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.periodo || !formData.resumen || !formData.archivo) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }

    // Simulación de envío exitoso
    console.log('Datos del reporte a enviar:', formData);
    setShowSuccess(true);

    // Redirigir al dashboard después de un breve retraso
    setTimeout(() => {
      navigate('/becario');
    }, 3000);
  };

  const handleCancel = () => {
    navigate('/becario');
  };

  return (
    <div className="subir-reporte-wrapper">
      {/* 1. Encabezado */}
      <header className="subir-reporte-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">📤 Subir Nuevo Reporte de Avance</h1>
          <p className="text-muted">Complete los siguientes campos para registrar su informe mensual o trimestral de avance.</p>
        </Container>
      </header>

      <Container className="py-4 d-flex justify-content-center">
        {/* 2. Cuerpo principal del formulario */}
        <Card className="form-card" style={{ width: '600px' }}>
          <Card.Body>
            {showSuccess && (
              <Alert variant="success" className="mb-4">
                ✅ Reporte enviado correctamente. Quedará pendiente de revisión por el tutor.
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              {/* Bloque 1: Periodo del Reporte */}
              <Form.Group className="mb-4">
                <Form.Label>Periodo o Fecha del Reporte</Form.Label>
                <Form.Select 
                  name="periodo" 
                  value={formData.periodo} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un periodo...</option>
                  <option value="Primer Trimestre 2025">Primer Trimestre 2025</option>
                  <option value="Segundo Trimestre 2025">Segundo Trimestre 2025</option>
                  <option value="Tercer Trimestre 2025">Tercer Trimestre 2025</option>
                  <option value="Cuarto Trimestre 2025">Cuarto Trimestre 2025</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Seleccione el mes o periodo correspondiente al informe.
                </Form.Text>
              </Form.Group>

              {/* Bloque 2: Resumen del Contenido */}
              <Form.Group className="mb-4">
                <Form.Label>Resumen del Reporte (breve descripción del avance)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="resumen"
                  value={formData.resumen}
                  onChange={handleChange}
                  placeholder="Ejemplo: Se completó la fase de análisis de datos y se inició la implementación del modelo…"
                  required
                />
              </Form.Group>

              {/* Bloque 3: Archivo PDF del Informe */}
              <Form.Group className="mb-4">
                <Form.Label>Archivo del Reporte (formato PDF, máximo 10 MB)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {formData.archivo && (
                  <div className="mt-2">
                    <span>📄 {formData.archivo.name}</span>
                  </div>
                )}
              </Form.Group>

              {/* 4. Botones inferiores */}
              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="me-3 px-4">
                  📤 Subir Reporte
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="px-4">
                  ↩️ Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* 5. Pie de página institucional */}
      <footer className="subir-reporte-footer text-center py-3 mt-4 border-top">
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

export default SubirReporte;