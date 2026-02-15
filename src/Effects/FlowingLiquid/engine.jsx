import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import LiquidText from './LiquidText';

// This function bridges the gap between the vanilla JS "createEffect" pattern
// and the React-Three-Fiber component.
export function createEffect({ container, config }) {
  // Config defaults if not provided
  let currentConfig = {
    ...config
  };

  // Create a React root on the container
  const root = createRoot(container);

  function render() {
    root.render(
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          {/* Add some lights though shader handles most lighting via colors */}
          <pointLight position={[10, 10, 10]} />
          
          <LiquidText {...currentConfig} />
          
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
    );
  }

  // Initial render
  render();

  return {
    update(newConfig) {
      currentConfig = { ...currentConfig, ...newConfig };
      render();
    },
    destroy() {
      root.unmount();
    },
  };
}
