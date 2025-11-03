// src/components/EvaluacionFinalForm.js

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import './docente.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const becariosAsignadosData = [
  { id: 1, nombre: 'Ana Guzmán', proyecto: 'Análisis de Algoritmos de Optimización para Big Data' },
  { id: 2, nombre: 'Luis Mamani', proyecto: 'Sistema de Monitoreo Hídrico' },
  { id: 3, nombre: 'José Flores', proyecto: 'Impacto de Minería Artesanal en Ecosistemas' },
  { id: 4, nombre: 'María Choque', proyecto: 'Aplicación de Blockchain en Trazabilidad Agrícola' }
];

const EvaluacionFinalForm = () => {
  // --- ESTADO DEL COMPONENTE ---
  const [becarios, setBecarios] = useState(becariosAsignadosData);
  const [selectedBecarioId, setSelectedBecarioId] = useState('');
  const [formData, setFormData] = useState({
    tituloProyecto: '',
    calificacionFinal: '',
    observacionesFinales: '',
    estadoFinal: 'Aprobado' // Valor por defecto
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // --- EFECTO PARA LLENAR EL TÍTULO AUTOMÁTICAMENTE ---
  useEffect(() => {
    if (selectedBecarioId) {
      const becario = becarios.find(b => b.id.toString() === selectedBecarioId);
      if (becario) {
        setFormData(prev => ({ ...prev, tituloProyecto: becario.proyecto }));
      }
    } else {
      setFormData(prev => ({ ...prev, tituloProyecto: '' }));
    }
  }, [selectedBecarioId, becarios]);

  // --- MANEJADORES DE EVENTOS ---
  const handleBecarioChange = (e) => {
    const { value } = e.target;
    setSelectedBecarioId(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simple
    if (!selectedBecarioId || !formData.calificacionFinal) {
      alert('Por favor, seleccione un becario e ingrese una calificación.');
      return;
    }

    // Simulación de guardado
    console.log('Evaluación a guardar:', {
      becarioId: selectedBecarioId,
      ...formData
    });

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    // Opcional: Resetear el formulario después de guardar
    // setSelectedBecarioId('');
    // setFormData({ tituloProyecto: '', calificacionFinal: '', observacionesFinales: '', estadoFinal: 'Aprobado' });
  };

  const handleCancel = () => {
    // Resetear el formulario
    setSelectedBecarioId('');
    setFormData({ tituloProyecto: '', calificacionFinal: '', observacionesFinales: '', estadoFinal: 'Aprobado' });
    setShowSuccessMessage(false);
  };

  return (
    <div className="evaluacion-form-wrapper">
      {/* 1️⃣ Encabezado */}
      <header className="evaluacion-form-header">
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
              <h1 className="h4 mb-0 fw-bold">Consolidación de Evaluaciones Finales</h1>
            </Col>
            <Col xs={3} className="text-end">
              <span className="d-block text-muted small">Tutor Evaluador</span>
              <strong>Lic. Anny Mercado Algarañaz</strong>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <Container className="mt-3">
          <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
            ✅ Evaluación final registrada con éxito.
          </Alert>
        </Container>
      )}

      {/* 2️⃣ Formulario principal */}
      <main className="evaluacion-form-main flex-grow-1 d-flex align-items-center">
        <Container>
          <Card className="evaluacion-form-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar becario</Form.Label>
                  <Form.Select
                    name="becarioId"
                    value={selectedBecarioId}
                    onChange={handleBecarioChange}
                    required
                  >
                    <option value="">-- Elija una opción --</option>
                    {becarios.map(becario => (
                      <option key={becario.id} value={becario.id}>
                        {becario.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Título del proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    name="tituloProyecto"
                    value={formData.tituloProyecto}
                    readOnly
                    plaintext
                    className="form-control-plaintext"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Calificación final (0-100)</Form.Label>
                      <Form.Control
                        type="number"
                        name="calificacionFinal"
                        value={formData.calificacionFinal}
                        onChange={handleInputChange}
                        placeholder="Ej: 85"
                        min="0"
                        max="100"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado de la beca</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="✅ Aprobado"
                          name="estadoFinal"
                          value="Aprobado"
                          checked={formData.estadoFinal === 'Aprobado'}
                          onChange={handleInputChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="❌ Reprobado"
                          name="estadoFinal"
                          value="Reprobado"
                          checked={formData.estadoFinal === 'Reprobado'}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Observaciones finales del desempeño</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="observacionesFinales"
                    value={formData.observacionesFinales}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Ingrese aquí sus comentarios cualitativos sobre el desempeño general del becario..."
                  />
                </Form.Group>

                {/* 3️⃣ Zona de acciones */}
                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit" className="me-3 px-5">
                    Guardar evaluación
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="px-5">
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </main>

      {/* 4️⃣ Pie de página */}
      <footer className="evaluacion-form-footer">
        <Container>
          <p className="mb-0">
            Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
          </p>
          <small className="text-muted">
            {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </small>
        </Container>
      </footer>
    </div>
  );
};

export default EvaluacionFinalForm;