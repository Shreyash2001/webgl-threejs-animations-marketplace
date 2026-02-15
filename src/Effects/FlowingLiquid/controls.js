export const controls = [
  { type: "text", key: "text", label: "Text Content" },
  { type: "range", key: "size", min: 0.5, max: 10, step: 0.1, label: "Font Size" },
  { type: "range", key: "height", min: 0.01, max: 1, step: 0.01, label: "Thickness" },
  { type: "range", key: "speed", min: 0.0, max: 5.0, step: 0.1, label: "Flow Speed" },
  { type: "range", key: "distortion", min: 0.0, max: 1.0, step: 0.01, label: "Wave Amplitude" },
  { type: "color", key: "color1", label: "Color 1 (Start)" },
  { type: "color", key: "color2", label: "Color 2 (Mid)" },
  { type: "color", key: "color3", label: "Color 3 (Mid)" },
  { type: "color", key: "color4", label: "Color 4 (End)" },
];
