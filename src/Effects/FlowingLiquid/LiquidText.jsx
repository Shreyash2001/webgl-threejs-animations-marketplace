import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
uniform float uSpeed;
uniform float uDistortion;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;
  
  vec3 pos = position;
  
  // Organic wave motion
  // Use lower frequency for large details, higher for surface texture
  float t = uTime * uSpeed;
  
  float wave1 = sin(pos.x * 0.5 + t) * 0.5;
  float wave2 = sin(pos.y * 0.3 + t * 0.8) * 0.5;
  float wave3 = sin(pos.x * 2.0 + pos.y * 2.0 + t * 2.0) * 0.1;
  
  float elevation = (wave1 + wave2 + wave3) * uDistortion;
  
  // Apply displacement along normal to keep volume
  // Or just distort Z for "liquid surface" look on text face
  pos.z += elevation;
  // Also slightly warp x/y for gooey feel
  pos.x += sin(pos.y * 1.0 + t) * uDistortion * 0.2;
  pos.y += cos(pos.x * 1.0 + t) * uDistortion * 0.2;
  
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Animate gradient
  float t = uTime * 0.2;
  
  // Create a plasma-like pattern for colors
  float plasma = sin(vPosition.x * 0.2 + t) + sin(vPosition.y * 0.2 - t) + sin((vPosition.x + vPosition.y) * 0.1 + t);
  float mixFactor = plasma * 0.5 + 0.5;
  
  // Mix colors based on UV and plasma
  vec3 colorA = mix(uColor1, uColor2, vUv.x);
  vec3 colorB = mix(uColor3, uColor4, vUv.y);
  
  vec3 baseColor = mix(colorA, colorB, mixFactor);
  
  // Add some emissive glow based on elevation - peaks are brighter
  float glow = smoothstep(-0.5, 1.0, vElevation) * 0.4;
  
  // Fresnel-ish rim light
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = dot(viewDir, vNormal);
  fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
  fresnel = pow(fresnel, 2.0);
  
  vec3 finalColor = baseColor + vec3(glow) + fresnel * 0.5 * uColor1;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function LiquidText({
  text,
  size,
  height,
  speed,
  distortion,
  color1,
  color2,
  color3,
  color4,
}) {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uDistortion: { value: distortion },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
      uColor4: { value: new THREE.Color(color4) },
    }),
    [],
  );

  // Safely update uniforms
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value =
        state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uSpeed.value = speed;
      meshRef.current.material.uniforms.uDistortion.value = distortion;
      meshRef.current.material.uniforms.uColor1.value.set(color1);
      meshRef.current.material.uniforms.uColor2.value.set(color2);
      meshRef.current.material.uniforms.uColor3.value.set(color3);
      meshRef.current.material.uniforms.uColor4.value.set(color4);
    }
  });

  let fontUrl = "/fonts/helvetiker_bold.typeface.json";

  if (typeof document !== "undefined") {
    const script = document.currentScript;
    if (script && script.src.includes("/dist/")) {
      const base = script.src.split("/dist/")[0];
      fontUrl = `${base}/fonts/helvetiker_bold.typeface.json`;
    }
  }

  return (
    <Center>
      <Text3D
        ref={meshRef}
        font={fontUrl}
        size={size || 1}
        height={height || 0.2}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={10}
      >
        {text}
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </Text3D>
    </Center>
  );
}
