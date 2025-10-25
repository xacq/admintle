// src/components/FormularioBeca.js

import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './admin.css'; // Importamos los estilos personalizados

// --- DATOS ESTÁTICOS DE EJEMPLO PARA LOS DESPLEGABLES ---
// En una aplicación real, estos datos vendrían de una API.
const investigadoresData = [
  { id: 1, nombre: 'Mayra Chumacero Vargas' },
  { id: 2, nombre: 'Carlos Pérez Mamani' },
  { id: 3, nombre: 'Lucía Quispe Flores' },
  { id: 4, nombre: 'Roberto Choque' },
];

const evaluadoresData = [
  { id: 1, nombre: 'Lic. Anny Mercado Algañaz' },
  { id: 2, nombre: 'Dr. Luis Rojas' },
  { id: 3, nombre: 'MSc. Juan García' },
];

const FormBecas = () => {
  // --- ESTADO DEL FORMULARIO ---
  // Un solo objeto para manejar todos los campos del formulario.
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    investigadorId: '', // Guardaremos el ID, no el nombre
    evaluadorId: '',
    estado: 'Activo', // Valor por defecto
  });

  // --- MANEJADORES DE EVENTOS ---

  // Maneja los cambios en cualquier campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto de recargar la página
    // Aquí iría la lógica para enviar los datos al backend (POST o PUT)
    console.log('Datos del formulario a guardar:', formData);
    alert('Beca guardada con éxito (simulación). Revisa la consola para ver los datos.');
  };

  // Maneja el botón de cancelar
  const handleCancel = () => {
    // En una app real, esto usaría React Router para navegar hacia atrás.
    alert('Redirigiendo al listado de becas (simulación).');
    console.log('Acción cancelada por el usuario.');
  };

  return (
    <Container className="formulario-beca-container">
      <h2 className="mb-4">Registro de Nueva Beca</h2>
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="formTitulo">
              <Form.Label>Título del Proyecto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Análisis de Algoritmos de Optimización"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Describe los objetivos y el alcance del proyecto de investigación..."
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formFechaFin">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formInvestigador">
              <Form.Label>Investigador Asignado</Form.Label>
              <Form.Select
                name="investigadorId"
                value={formData.investigadorId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un investigador...</option>
                {investigadoresData.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEvaluador">
              <Form.Label>Evaluador o Tutor</Form.Label>
              <Form.Select
                name="evaluadorId"
                value={formData.evaluadorId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un evaluador...</option>
                {evaluadoresData.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-4" controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="En Evaluación">En Evaluación</option>
            <option value="Pendiente">Pendiente</option>
          </Form.Select>
        </Form.Group>

        {/* Botones de Acción */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Beca
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormBecas;