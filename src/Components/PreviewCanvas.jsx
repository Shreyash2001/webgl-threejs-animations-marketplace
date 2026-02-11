import { useEffect, useRef } from "react";

export default function PreviewCanvas({ effectModule, config }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !effectModule) return;

    // We pass the config directly.
    // Ensure text is provided in the config object
    const instance = effectModule.createEffect({
      container: ref.current,
      config: config,
    });

    return () => {
      if (instance && instance.destroy) instance.destroy();
    };
  }, [effectModule, config]); // Re-run if config (like text or color) changes

  return (
    <div
      ref={ref}
      style={{
        height: "500px",
        width: "100%",
        background: "#050505", // Dark background makes white sand pop
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
