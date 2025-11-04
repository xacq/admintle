const buildManagementLabels = (summary, loading) => {
  if (loading) {
    return {
      gestion: 'Cargando gestión…',
      periodo: 'Cargando periodo…',
    };
  }

  const gestion = summary.yearLabel ? `Gestión ${summary.yearLabel}` : 'Gestión no definida';
  const periodo = summary.periodLabel || 'Periodo no definido';

  return { gestion, periodo };
};

export default buildManagementLabels;
