// src/components/DetalleBeca.js

import React, { useState } from 'react';
import { Modal, Card, Row, Col, Badge, Table, Button } from 'react-bootstrap';
import './admin.css';

const DetalleBeca = ({ show, onHide, beca, userRole }) => {
  // ESTADO DEL COMPONENTE
  // Asegúrate de que el nombre aquí sea 'expandedObservation'
  const [expandedObservation, setExpandedObservation] = useState(null);

  // Si no hay beca seleccionada, no renderizar nada
  if (!beca) {
    return null;
  }

  // --- FUNCIONES AUXILIARES ---
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Finalizada':
        return 'primary';
      case 'Archivada':
        return 'secondary';
      case 'Activa':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getReporteEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Devuelto':
        return 'danger';
      case 'En revisión':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleToggleObservation = (id) => {
    // Y también aquí, asegúrate de usar 'expandedObservation'
    setExpandedObservation(expandedObservation === id ? null : id);
  };

  const handleArchive = () => {
    if (window.confirm(`¿Está seguro de que desea archivar la beca ${beca.codigo}?`)) {
      alert(`Beca ${beca.codigo} archivada (simulación)`);
      onHide();
    }
  };

  const handleRestore = () => {
    if (window.confirm(`¿Está seguro de que desea restaurar la beca ${beca.codigo}?`)) {
      alert(`Beca ${beca.codigo} restaurada (simulación)`);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de la Beca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 2️⃣ Datos principales de la beca */}
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-2">
              <Col sm={4} className="field-label"><strong>Código de beca:</strong></Col>
              <Col sm={8}>{beca.codigo}</Col>

              <Col sm={4} className="field-label"><strong>Título del proyecto:</strong></Col>
              <Col sm={8}>{beca.tituloProyecto}</Col>

              <Col sm={4} className="field-label"><strong>Becario:</strong></Col>
              <Col sm={8}>{beca.becario}</Col>

              <Col sm={4} className="field-label"><strong>Tutor asignado:</strong></Col>
              <Col sm={8}>{beca.tutorAsignado}</Col>

              <Col sm={4} className="field-label"><strong>Fecha de inicio:</strong></Col>
              <Col sm={8}>{beca.fechaInicio}</Col>

              <Col sm={4} className="field-label"><strong>Fecha de fin:</strong></Col>
              <Col sm={8}>{beca.fechaFin}</Col>

              <Col sm={4} className="field-label"><strong>Estado actual:</strong></Col>
              <Col sm={8}>
                <Badge bg={getEstadoVariant(beca.estado)}>
                  {beca.estado === 'Finalizada' && '🔵 '}
                  {beca.estado === 'Archivada' && '⚪ '}
                  {beca.estado}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 3️⃣ Bloque de evaluación final (si existe) */}
        <Card className="mb-3 evaluation-card">
          <Card.Body>
            <Card.Title as="h6">Evaluación Final del Tutor</Card.Title>
            {beca.evaluacionFinal ? (
              <>
                <p><strong>Calificación:</strong> {beca.evaluacionFinal.calificacion} / 10</p>
                <p><strong>Estado de la beca:</strong>
                  <Badge bg={beca.evaluacionFinal.estado === 'Aprobada' ? 'success' : 'danger'} className="ms-2">
                    {beca.evaluacionFinal.estado === 'Aprobada' ? '✅ Aprobada' : '❌ Reprobada'}
                  </Badge>
                </p>
                <p><strong>Observaciones:</strong></p>
                <p>{beca.evaluacionFinal.observaciones}</p>
              </>
            ) : (
              <p className="text-muted">Sin evaluación registrada.</p>
            )}
          </Card.Body>
        </Card>

        {/* 4️⃣ Listado de reportes enviados */}
        <Card>
          <Card.Body>
            <Card.Title as="h6">Listado de Reportes Enviados</Card.Title>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>N.º</th>
                  <th>Fecha de envío</th>
                  <th>Estado</th>
                  <th>Observaciones del tutor</th>
                </tr>
              </thead>
              <tbody>
                {beca.reportes.map((reporte) => (
                  <tr key={reporte.numero}>
                    <td>{reporte.numero}</td>
                    <td>{reporte.fechaEnvio}</td>
                    <td>
                      <Badge bg={getReporteEstadoVariant(reporte.estado)}>
                        {reporte.estado === 'Aprobado' && '✅ '}
                        {reporte.estado === 'Devuelto' && '⚠️ '}
                        {reporte.estado === 'En revisión' && '🟡 '}
                        {reporte.estado}
                      </Badge>
                    </td>
                    <td>
                      {reporte.observaciones.length > 50 ? (
                        <>
                          {/* Aquí también se usa 'expandedObservation' */}
                          {expandedObservation === reporte.numero
                            ? reporte.observaciones
                            : `${reporte.observaciones.substring(0, 50)}...`}
                          <Button variant="link" size="sm" onClick={() => handleToggleObservation(reporte.numero)}>
                            {expandedObservation === reporte.numero ? 'Ver menos' : 'Ver más'}
                          </Button>
                        </>
                      ) : (
                        reporte.observaciones
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Modal.Body>

      {/* 5️⃣ Acciones (según rol) */}
      <Modal.Footer>
        {userRole === 'Administrador' ? (
          <>
            {beca.estado === 'Finalizada' && (
              <Button variant="warning" onClick={handleArchive}>
                Archivar Beca
              </Button>
            )}
            {beca.estado === 'Archivada' && (
              <Button variant="success" onClick={handleRestore}>
                Restaurar
              </Button>
            )}
            <Button variant="secondary" onClick={onHide} className="ms-auto">
              Cerrar
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onHide}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleBeca;