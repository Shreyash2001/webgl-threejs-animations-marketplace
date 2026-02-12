// src/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import PrismaticBurst from "../Components/Background/PrismaticBurst";

const Home = () => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <PrismaticBurst
          intensity={2}
          speed={0.5}
          animationType="rotate3d"
          distort={0}
          mixBlendMode="lighten"
          // Add other props as needed for customization
        />
      </div>
      <div className="homepage-container">
        <h1 className="homepage-title">
          Interactive Effects for Creative Developers.
          <br />
          Export and Use in Seconds.
        </h1>
        <p className="homepage-subtitle">
          Highly customizable WebGL effects you can preview, tweak, export, and
          use directly in your website or React project.
        </p>
        <Link to="/marketplace">
          <button className="homepage-button">Try the Demo for free</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
