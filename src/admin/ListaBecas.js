// src/components/ListadoBecas.js

import React, { useState } from 'react';
import './admin.css';

const ListadoBecas = () => {
  // 1. Datos estáticos (arreglo temporal)
  const [becas] = useState([
    {
      id: 1,
      titulo: 'Desarrollo de un Sistema de Alerta Temprana',
      investigador: 'Mayra Chumacero Vargas',
      tutor: 'Lic. Anny Mercado Algañaz',
      fechaInicio: '2024-02-15',
      fechaFin: '2024-11-30',
      estado: 'Activa'
    },
    {
      id: 2,
      titulo: 'Análisis de Algoritmos de Optimización',
      investigador: 'Carlos Pérez Mamani',
      tutor: 'Dr. Luis Rojas',
      fechaInicio: '2023-09-01',
      fechaFin: '2024-06-30',
      estado: 'Finalizada'
    },
    {
      id: 3,
      titulo: 'Aplicación de IoT en la Agricultura',
      investigador: 'Lucía Quispe Flores',
      tutor: 'MSc. Juan García',
      fechaInicio: '2024-03-10',
      fechaFin: '2024-12-20',
      estado: 'En Evaluación'
    },
    {
      id: 4,
      titulo: 'Modelado de Procesos de Negocio con UML',
      investigador: 'Roberto Choque',
      tutor: 'Lic. Anny Mercado Algañaz',
      fechaInicio: '2024-01-20',
      fechaFin: '2024-10-15',
      estado: 'Activa'
    }
  ]);

  // Función para dar estilo al estado (badge)
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-success';
      case 'Finalizada':
        return 'bg-secondary';
      case 'En Evaluación':
        return 'bg-warning text-dark';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="listado-becas-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Listado de Becas de Investigación</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nueva Beca
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Título de Beca</th>
              <th scope="col">Investigador</th>
              <th scope="col">Tutor</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Fin</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {becas.map((beca) => (
              <tr key={beca.id}>
                <td>{beca.titulo}</td>
                <td>{beca.investigador}</td>
                <td>{beca.tutor}</td>
                <td>{beca.fechaInicio}</td>
                <td>{beca.fechaFin}</td>
                <td>
                  <span className={`badge ${getEstadoBadge(beca.estado)}`}>
                    {beca.estado}
                  </span>
                </td>
                <td className="text-center">
                  <div className="btn-group" role="group">
                    <button className="btn btn-sm btn-outline-primary" title="Ver Detalles">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" title="Editar">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoBecas;