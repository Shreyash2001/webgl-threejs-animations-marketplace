import { useState, useEffect } from "react";
import { effectsRegistry } from "../Effects/registry";
import PreviewCanvas from "../Components/PreviewCanvas";
import ControlsRenderer from "../Components/ControlsRenderer";
import { generateEmbedCode } from "../utils/generateEmbed";

export default function Marketplace() {
  const [selectedEffect, setSelectedEffect] = useState("dust");
  const effectModule = effectsRegistry[selectedEffect];

  const [config, setConfig] = useState(effectModule.defaultConfig);

  useEffect(() => {
    setConfig(effectModule.defaultConfig);
  }, [selectedEffect]);

  const [exportCode, setExportCode] = useState("");

  return (
    <div>
      <h2>WebGL Effects Marketplace</h2>

      <PreviewCanvas effectModule={effectModule} config={config} />

      <ControlsRenderer
        controls={effectModule.controls}
        config={config}
        setConfig={setConfig}
      />

      <button
        onClick={() => setExportCode(generateEmbedCode(selectedEffect, config))}
      >
        Export
      </button>

      {exportCode && <pre>{exportCode}</pre>}
    </div>
  );
}
