import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PARAMETERS = {
  academicYear: '',
  managementStartDate: '',
  managementEndDate: '',
  reportDeadline: '',
  maxReportsPerScholar: 0,
  systemStatus: '',
  periodLabel: '',
};

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('es-BO');
};

const mapResponseToParameters = (payload) => {
  const data = payload?.data ?? payload ?? {};

  return {
    academicYear: data.academicYear ?? data.academic_year ?? DEFAULT_PARAMETERS.academicYear,
    managementStartDate: data.managementStartDate ?? data.management_start_date ?? DEFAULT_PARAMETERS.managementStartDate,
    managementEndDate: data.managementEndDate ?? data.management_end_date ?? DEFAULT_PARAMETERS.managementEndDate,
    reportDeadline: data.reportDeadline ?? data.report_deadline ?? DEFAULT_PARAMETERS.reportDeadline,
    maxReportsPerScholar:
      data.maxReportsPerScholar ?? data.max_reports_per_scholar ?? DEFAULT_PARAMETERS.maxReportsPerScholar,
    systemStatus: data.systemStatus ?? data.system_status ?? DEFAULT_PARAMETERS.systemStatus,
    periodLabel: data.periodLabel ?? data.period_label ?? DEFAULT_PARAMETERS.periodLabel,
  };
};

const buildSummary = (parameters) => {
  const yearLabel = parameters.academicYear || '';

  if (parameters.periodLabel) {
    return {
      yearLabel,
      periodLabel: parameters.periodLabel,
    };
  }

  if (parameters.managementStartDate || parameters.managementEndDate) {
    const inicio = formatDate(parameters.managementStartDate);
    const fin = formatDate(parameters.managementEndDate);

    const rangeLabel = [inicio, fin].filter(Boolean).join(' – ');

    if (rangeLabel) {
      return {
        yearLabel,
        periodLabel: `Periodo: ${rangeLabel}`,
      };
    }
  }

  if (parameters.systemStatus) {
    return {
      yearLabel,
      periodLabel: `Estado: ${parameters.systemStatus}`,
    };
  }

  return {
    yearLabel,
    periodLabel: '',
  };
};

const useSystemParameters = () => {
  const [data, setData] = useState(DEFAULT_PARAMETERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadParameters = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/system-parameters', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        setData(mapResponseToParameters(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.message || 'No se pudieron recuperar los parámetros institucionales.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadParameters();

    return () => {
      controller.abort();
    };
  }, []);

  const summary = useMemo(() => buildSummary(data), [data]);

  return { data, loading, error, summary };
};

export default useSystemParameters;
