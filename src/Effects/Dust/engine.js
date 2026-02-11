import * as THREE from "three";

export function createEffect({ container, config }) {
  const { text, speed, color } = config;
  let animationId;
  const mouse = new THREE.Vector2(-1000, -1000);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    container.clientWidth / -2,
    container.clientWidth / 2,
    container.clientHeight / 2,
    container.clientHeight / -2,
    1,
    1000,
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // 1. Create High-Res Texture for SOLID text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;

  ctx.scale(dpr, dpr);
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.min(container.clientWidth / 6, 120)}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, container.clientWidth / 2, container.clientHeight / 2);

  const texture = new THREE.CanvasTexture(canvas);

  // 2. Create Geometry (A dense grid of points that form the solid text)
  const width = container.clientWidth;
  const height = container.clientHeight;
  const spacing = 2; // Low spacing = Solid look
  const positions = [];
  const uvs = [];

  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      // Only add particles where the text actually is (alpha check)
      const pixelData = ctx.getImageData(x * dpr, y * dpr, 1, 1).data;
      if (pixelData[3] > 10) {
        positions.push(x - width / 2, -(y - height / 2), 0);
        uvs.push(x / width, 1 - y / height);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  const originals = new Float32Array(positions); // Memory for physics

  // 3. Material: Use a larger point size so they overlap into a solid block
  const material = new THREE.PointsMaterial({
    color: color,
    size: spacing * 1.5, // Overlap ensures no gaps/dots
    transparent: true,
    opacity: 1,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Interaction
  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left - width / 2;
    mouse.y = -(e.clientY - rect.top) + height / 2;
  };
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", () => mouse.set(-1000, -1000));

  function animate() {
    animationId = requestAnimationFrame(animate);
    const posAttr = geometry.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const i3 = i * 3;
      const ox = originals[i3];
      const oy = originals[i3 + 1];
      const curX = posAttr.array[i3];
      const curY = posAttr.array[i3 + 1];

      const dx = mouse.x - curX;
      const dy = mouse.y - curY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 40;

      if (dist < radius) {
        // "Heavy Sand" pushing away
        const force = (radius - dist) / radius;
        const angle = Math.atan2(dy, dx);
        posAttr.array[i3] -= Math.cos(angle) * force * 15 * speed;
        posAttr.array[i3 + 1] -= Math.sin(angle) * force * 15 * speed;
      } else {
        // Return to solid state with "weighted" friction
        posAttr.array[i3] += (ox - curX) * 0.12;
        posAttr.array[i3 + 1] += (oy - curY) * 0.12;
      }
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy() {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
