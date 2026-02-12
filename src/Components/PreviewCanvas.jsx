import { useEffect, useRef } from "react";

export default function PreviewCanvas({ effectModule, config }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !effectModule) return;

    if (instanceRef.current) {
      instanceRef.current.destroy();
    }
    instanceRef.current = effectModule.createEffect({
      container: ref.current,
      config: config,
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [effectModule]); 

  useEffect(() => {
    if (instanceRef.current) {
      if (instanceRef.current.update) {
        instanceRef.current.update(config);
      } else {
        console.warn("Effect module does not support update method.");
      }
    }
  }, [config]);

  return (
    <div
      ref={ref}
      style={{
        height: "500px",
        width: "100%",
        background: "#050505",
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
