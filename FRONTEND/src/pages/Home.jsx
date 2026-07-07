import { Link } from "react-router-dom";
import Ferrofluid from "../components/Ferrofluid/Ferrofluid";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-dark-viewport">
      <div className="background-effect">
        <Ferrofluid
          colors={["#7c3aed", "#8b5cf6", "#a855f7"]}
          speed={0.45}
          scale={1.5}
          turbulence={1}
          fluidity={0.12}
          rimWidth={0.2}
          sharpness={3}
          shimmer={1}
          glow={2}
          flowDirection="down"
          opacity={0.9}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
        />
      </div>
      
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
          Want better results in your organization? TaskApp helps teams get
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
