// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');

    const BrowserRouter = ({ children }) => (
      <div data-testid="mock-browser-router">{children}</div>
    );

    const Routes = ({ children }) => <>{children}</>;

    const Route = ({ element }) => element ?? null;

    const Link = ({ to, children, ...props }) => (
      <a href={typeof to === 'string' ? to : '#'} {...props}>
        {children}
      </a>
    );

    const useNavigate = () => () => {};

    return {
      __esModule: true,
      BrowserRouter,
      Routes,
      Route,
      Link,
      useNavigate,
    };
  },
  { virtual: true }
);
