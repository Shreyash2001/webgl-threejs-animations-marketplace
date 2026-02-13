import * as THREE from "three";

export function createEffect({ container, config }) {
  let { text, speed, color } = config;
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

  let geometry = null;
  let material = null;
  let points = null;
  let originals = null;

  function buildScene() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff"; 
    ctx.font = `bold ${config.textSize || 120}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, container.clientWidth / 2, container.clientHeight / 2);
    const width = container.clientWidth;
    const height = container.clientHeight;
    const spacing = 2;
    const positions = [];
    
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const canvasWidth = canvas.width;

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const cx = Math.floor(x * dpr);
        const cy = Math.floor(y * dpr);
        const index = (cy * canvasWidth + cx) * 4;
        
        if (pixelData[index + 3] > 10) {
           positions.push(x - width / 2, -(y - height / 2), 0);
        }
      }
    }

    if (geometry) geometry.dispose();
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    originals = new Float32Array(positions); 

    if (material) {
        material.color.set(color);
    } else {
        material = new THREE.PointsMaterial({
            color: color,
            size: spacing * 1.5,
            transparent: true,
            opacity: 1,
        });
    }

    if (points) scene.remove(points);
    points = new THREE.Points(geometry, material);
    scene.add(points);
  }

  buildScene();

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    mouse.x = e.clientX - rect.left - width / 2;
    mouse.y = -(e.clientY - rect.top) + height / 2;
  };
  
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", () => mouse.set(-1000, -1000));

  let isVisible = true;
  let isTabVisible = !document.hidden;

  const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(container);

  const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isVisible || !isTabVisible) return;
    if (!geometry || !points) return;

    const posAttr = geometry.attributes.position;
    let needsUpdate = false;

    for (let i = 0; i < posAttr.count; i++) {
      const i3 = i * 3;
      const ox = originals[i3];
      const oy = originals[i3 + 1];
      const curX = posAttr.array[i3];
      const curY = posAttr.array[i3 + 1];

      const dx = mouse.x - curX;
      const dy = mouse.y - curY;
      const distSq = dx * dx + dy * dy;
      const radius = 40;
      const radiusSq = radius * radius;

      if (distSq < radiusSq) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / radius;
        const angle = Math.atan2(dy, dx);
        
        posAttr.array[i3] -= Math.cos(angle) * force * 15 * speed;
        posAttr.array[i3 + 1] -= Math.sin(angle) * force * 15 * speed;
        needsUpdate = true;
      } else {
        const diffX = ox - curX;
        const diffY = oy - curY;
        
        if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
            posAttr.array[i3] += diffX * 0.12;
            posAttr.array[i3 + 1] += diffY * 0.12;
            needsUpdate = true;
        } else if (curX !== ox || curY !== oy) {
             posAttr.array[i3] = ox;
             posAttr.array[i3+1] = oy;
             needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
        posAttr.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
  }

  animate();

  return {
    update(newConfig) {
        const oldText = text;
        const oldColor = color;
        
        text = newConfig.text;
        speed = newConfig.speed;
        color = newConfig.color;

        if (text !== oldText || newConfig.textSize !== config.textSize) {
             buildScene();
        } else if (color !== oldColor) {
             if (material) material.color.set(color);
        }
        config = newConfig;
    },
    destroy() {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      container.removeEventListener("mousemove", handleMouseMove);
      
      if (renderer) renderer.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
      }
    },
  };
}
