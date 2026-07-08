import { useEffect } from "react";
import { Link } from "react-router-dom";
import Ferrofluid from "../../components/Ferrofluid/Ferrofluid";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("overflow", "hidden", "important");
    document.body.style.setProperty("overflow", "hidden", "important");

    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
    };
  }, []);

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
        <div className="framer-badge">
          <span className="badge-sparkle">✦</span> Made for Developers
        </div>

        <h1 className="hero-title">
          <span>The best platform for</span> <br />
          cross-functional work.
        </h1>

        <p className="hero-subtitle">
          Want better results in your organization? TaskApp helps teams get
          clarity, achieve greater impact, and scale to meet company goals.
        </p>

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