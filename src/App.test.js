import { render, screen, waitFor } from '@testing-library/react';
import Test from './Test';
import axios from 'axios';

jest.mock('axios'); // simulamos axios

test('muestra mensaje de éxito tras la llamada a la API', async () => {
  axios.get.mockResolvedValue({
    data: { message: 'Inicio de sesión exitoso' }
  });

  render(<Test />);

  // Esperamos a que aparezca el texto del mensaje
  await waitFor(() =>
    expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument()
  );
});