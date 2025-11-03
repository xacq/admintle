import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Test() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/login')
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Error al conectar'));
  }, []);

  return <h1>{message || 'Cargando...'}</h1>;
}