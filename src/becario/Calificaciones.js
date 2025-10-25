// src/components/VerCalificaciones.js

import React from 'react';
import { Container, Card, Badge, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './estudiante.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const infoBeca = {
  tutorEvaluador: 'Lic. Anny Mercado Algarañaz',
  proyecto: 'Análisis de Algoritmos de Optimización para Big Data',
  estadoActual: 'Activa'
};

const calificacionesData = [
  {
    id: 1,
    periodo: 'Julio – Septiembre 2024',
    fechaEntrega: '30/09/2024',
    calificacion: 8.5,
    estado: 'Aprobado',
    observaciones: 'Buen avance técnico y coherencia metodológica.'
  },
  {
    id: 2,
    periodo: 'Octubre – Diciembre 2024',
    fechaEntrega: '20/12/2024',
    calificacion: 9.0,
    estado: 'Aprobado',
    observaciones: 'Excelente consolidación del proyecto.'
  },
  {
    id: 3,
    periodo: 'Enero – Marzo 2025',
    fechaEntrega: '15/03/2025',
    calificacion: null,
    estado: 'Pendiente',
    observaciones: 'En revisión por el tutor.'
  }
];

const Calificaciones = () => {
  const navigate = useNavigate();

  // --- LÓGICA PARA EL PROMEDIO ---
  const calificacionesValidas = calificacionesData.filter(c => c.calificacion !== null);
  const promedioGeneral = calificacionesValidas.length > 0
    ? (calificacionesValidas.reduce((sum, c) => sum + c.calificacion, 0) / calificacionesValidas.length).toFixed(2)
    : '—';

  // --- FUNCIONES AUXILIARES ---
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Pendiente':
        return 'secondary';
      case 'Devuelto':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return '✅';
      case 'Pendiente':
        return '🕓';
      case 'Devuelto':
        return '🔁';
      default:
        return '❓';
    }
  };

  return (
    <div className="ver-calificaciones-wrapper">
      {/* 1. Encabezado principal */}
      <header className="ver-calificaciones-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">📊 Calificaciones del Becario</h1>
          <p className="text-muted">Consulta tus calificaciones obtenidas en cada reporte y tu promedio general.</p>
        </Container>
      </header>

      <Container className="py-4 d-flex justify-content-center">
        <Card className="calificaciones-card" style={{ width: '800px' }}>
          <Card.Body>
            {/* 2. Resumen general de la beca (bloque superior) */}
            <div className="contexto-beca mb-4">
              <p><strong>Tutor evaluador:</strong> {infoBeca.tutorEvaluador}</p>
              <p><strong>Proyecto:</strong> {infoBeca.proyecto}</p>
              <p><strong>Estado actual:</strong> <Badge bg="success">{infoBeca.estadoActual}</Badge></p>
            </div>
            <hr />

            {/* 3. Tabla de calificaciones (bloque principal) */}
            {calificacionesData.length > 0 ? (
              <Table responsive hover className="calificaciones-table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Fecha de Entrega</th>
                    <th>Calificación</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {calificacionesData.map((calif) => (
                    <tr key={calif.id}>
                      <td>{calif.periodo}</td>
                      <td>{calif.fechaEntrega}</td>
                      <td>
                        {calif.calificacion !== null ? (
                          <span>⭐ {calif.calificacion} / 10</span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={getEstadoVariant(calif.estado)}>
                          {getEstadoIcon(calif.estado)} {calif.estado}
                        </Badge>
                      </td>
                      <td>{calif.observaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted">Aún no existen calificaciones registradas para tus reportes.</p>
            )}

            {/* 4. Promedio final (bloque inferior) */}
            <div className="promedio-final mt-4 p-3 rounded text-center">
              <h4 className="mb-1">Promedio General: ⭐ {promedioGeneral} / 10</h4>
              <small className="text-muted">Resultado acumulado de los reportes evaluados.</small>
            </div>

            {/* 5. Botones o navegación inferior */}
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" onClick={() => navigate('/dashboardbecario')} className="me-3">
                ⬅️ Volver al Panel Principal
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/observaciones')}>
                🗒️ Ver Observaciones del Tutor
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Pie de página institucional */}
      <footer className="ver-calificaciones-footer text-center py-3 mt-4 border-top">
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

export default Calificaciones;