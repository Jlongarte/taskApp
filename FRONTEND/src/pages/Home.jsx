import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-dark-viewport">
      {/* 🔮 El destello de fondo animado */}
      <div className="purple-glow-bg"></div>

      <section className="home-hero-container">
        {/* Pequeña insignia superior 'Made by Framer' style */}
        <div className="framer-badge">
          <span className="badge-sparkle">✦</span> Made for Developers
        </div>

        {/* Título Principal */}
        <h1 className="hero-title">
          The best platform for <br />
          <span>cross-functional work.</span>
        </h1>

        {/* Subtítulo descriptivo */}
        <p className="hero-subtitle">
          Want better results in your organization? DoIt helps teams get
          clarity, achieve greater impact, and scale to meet company goals.
        </p>

        {/* Botones de acción principales */}
        <div className="hero-cta-group">
          <Link to="/register" className="cta-btn cta-primary">
            Get started
          </Link>
          <Link to="/login" className="cta-btn cta-secondary">
            See how it works
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
