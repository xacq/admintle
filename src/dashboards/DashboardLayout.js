import { Link } from "react-router-dom";
import "./dashboards.css";

const DashboardLayout = ({ title, description, children }) => (
  <div className="dashboard-page">
    <header className="dashboard-page__header">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>

    <main className="dashboard-page__content">
      {children}
    </main>

    <footer className="dashboard-page__footer">
      <Link to="/">Cerrar sesión</Link>
    </footer>
  </div>
);

export default DashboardLayout;
