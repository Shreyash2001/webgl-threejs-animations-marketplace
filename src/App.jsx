// src/App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Marketplace from "./Pages/Marketplace";
import EffectCustomizer from "./Pages/EffectCustomizer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:effectName" element={<EffectCustomizer />} />
      </Routes>
    </Router>
  );
}

export default App;
