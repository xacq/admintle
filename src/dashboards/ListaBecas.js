import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

const initialFormState = {
  id: null,
  codigo: "",
  becario_id: "",
  tutor_id: "",
  fecha_inicio: "",
  estado: "Activa",
};

const ListaBecas = () => {
  useAuthenticatedUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({ becarios: [], tutores: [], estados: [] });
  const [form, setForm] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [becasResponse, optionsResponse] = await Promise.all([
          fetch("/api/becas", { signal: controller.signal }),
          fetch("/api/becas/options", { signal: controller.signal }),
        ]);

        if (!becasResponse.ok) {
          throw new Error(`Error ${becasResponse.status}`);
        }

        if (!optionsResponse.ok) {
          throw new Error(`Error ${optionsResponse.status}`);
        }

        const becasData = await becasResponse.json();
        const optionsData = await optionsResponse.json();

        setBecas(becasData);
        setOptions(optionsData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, []);

  const filteredBecas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return becas;
    }

    return becas.filter((beca) =>
      [
        beca.codigo,
        beca.estado,
        beca.becario?.nombre,
        beca.tutor?.nombre,
        beca.fecha_inicio,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [becas, searchTerm]);

  const openCreateModal = () => {
    setForm(initialFormState);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (beca) => {
    setForm({
      id: beca.id,
      codigo: beca.codigo,
      becario_id: String(beca.becario?.id ?? ""),
      tutor_id: String(beca.tutor?.id ?? ""),
      fecha_inicio: beca.fecha_inicio ?? "",
      estado: beca.estado,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialFormState);
    setFormError(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const syncBecaInState = (updatedBeca) => {
    setBecas((prev) => {
      const exists = prev.some((item) => item.id === updatedBeca.id);
      if (exists) {
        return prev.map((item) => (item.id === updatedBeca.id ? updatedBeca : item));
      }
      return [updatedBeca, ...prev];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const payload = {
      codigo: form.codigo.trim(),
      becario_id: Number(form.becario_id),
      tutor_id: Number(form.tutor_id),
      fecha_inicio: form.fecha_inicio,
      estado: form.estado,
    };

    try {
      const endpoint = isEditing ? `/api/becas/${form.id}` : "/api/becas";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "No se pudo guardar la beca.";
        try {
          const errorPayload = await response.json();
          message =
            errorPayload?.message ||
            Object.values(errorPayload?.errors ?? {})[0]?.[0] ||
            message;
        } catch (parseError) {
          // Ignorar errores de parseo
        }
        throw new Error(message);
      }

      const savedBeca = await response.json();
      syncBecaInState(savedBeca);
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (beca) => {
    const confirmed = window.confirm(`¿Eliminar la beca ${beca.codigo}?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/becas/${beca.id}`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) {
        throw new Error(`Error ${response.status}`);
      }
      setBecas((prev) => prev.filter((item) => item.id !== beca.id));
    } catch (err) {
      window.alert("No se pudo eliminar la beca. Intenta nuevamente.");
    }
  };

  return (
    <DashboardLayout
      title="Gestión de becas auxiliares"
      description="Administra el registro de becarios, asigna tutores y controla el estado de los apoyos de investigación."
    >
      <section className="dashboard-widget">
        <div className="becas-header">
          <div>
            <h2>Lista de becas registradas</h2>
            <p>
              Crea nuevas becas o actualiza la información existente. Los cambios se reflejan de forma
              inmediata en los paneles del director, tutores y becarios.
            </p>
          </div>
          <button className="dashboard-button" type="button" onClick={openCreateModal}>
            Nueva beca
          </button>
        </div>
        <div className="becas-toolbar">
          <input
            type="search"
            placeholder="Buscar por código, becario, tutor o estado"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        {error && <p className="dashboard-error">No se pudo cargar la información de becas.</p>}
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Becario</th>
                <th>Tutor</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="dashboard-table__empty">
                    Cargando becas…
                  </td>
                </tr>
              )}
              {!loading && filteredBecas.length === 0 && !error && (
                <tr>
                  <td colSpan="6" className="dashboard-table__empty">
                    No hay becas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                filteredBecas.map((beca) => (
                  <tr key={beca.id}>
                    <td>{beca.codigo}</td>
                    <td>{beca.becario?.nombre}</td>
                    <td>{beca.tutor?.nombre}</td>
                    <td>{beca.fecha_inicio}</td>
                    <td>
                      <span className={`badge badge--${beca.estado.toLowerCase().replace(/\s+/g, "-")}`}>
                        {beca.estado}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => openEditModal(beca)}>
                          ✏️ Editar
                        </button>
                        <button type="button" onClick={() => handleDelete(beca)} className="danger">
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <header className="modal__header">
              <h3>{isEditing ? "Editar beca" : "Nueva beca"}</h3>
              <button type="button" className="modal__close" onClick={closeModal}>
                ×
              </button>
            </header>
            <form className="modal__body" onSubmit={handleSubmit}>
              <label>
                Código de beca
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleFormChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                Becario (Investigador)
                <select
                  name="becario_id"
                  value={form.becario_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona un becario</option>
                  {options.becarios.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tutor (Evaluador)
                <select
                  name="tutor_id"
                  value={form.tutor_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona un tutor</option>
                  {options.tutores.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fecha de inicio
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Estado
                <select name="estado" value={form.estado} onChange={handleFormChange} required>
                  {options.estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>
              {formError && <p className="form-error">{formError}</p>}
              <footer className="modal__footer">
                <button type="button" className="secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Guardando…" : "Guardar"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ListaBecas;
