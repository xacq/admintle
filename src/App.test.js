import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza la pantalla de inicio de sesión', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /sistema odiseo/i });
  expect(heading).toBeInTheDocument();
});
