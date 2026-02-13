import React from 'react';
import { Link } from 'react-router-dom';
import { effectsRegistry } from '../Effects/registry';
import Silk from '../Components/Background/Silk';
import './Marketplace.css';

export default function Marketplace() {
  const effects = Object.keys(effectsRegistry);

  return (
    <>
    <Silk />
    <div className="marketplace-container">
      <h1 className="effect-title">Explore Effects</h1>
      <div className="effects-grid">
        {effects.map((effectKey) => {
          const effect = effectsRegistry[effectKey];
          return (
            <div key={effectKey} className="effect-card">
              <div className="effect-video-placeholder">
                {effect.previewVideo ? (
                  <video
                    src={effect.previewVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="effect-video-preview"
                  />
                ) : (
                  <div className="video-overlay">
                    <span>Preview Video</span>
                  </div>
                )}
              </div>
              <div className="effect-card-content">
                <h3>{effectKey.charAt(0).toUpperCase() + effectKey.slice(1)} Effect</h3>
                <Link to={`/marketplace/${effectKey}`}>
                  <button className="customize-btn">Customize Effect</button>
                </Link>
              </div>
            </div>
          );
        })}
        {/* Placeholder for future effects to show grid layout better */}
        <div className="effect-card coming-soon">
            <div className="effect-video-placeholder">
               <div className="video-overlay">
                <span>Coming Soon</span>
              </div>
            </div>
             <div className="effect-card-content">
              <h3>More Effects</h3>
              <button className="customize-btn" disabled>Coming Soon</button>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
