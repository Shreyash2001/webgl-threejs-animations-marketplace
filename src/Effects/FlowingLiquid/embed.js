// fluid-embed.js
import { createEffect } from "./engine.jsx";

// 1. Standard export for manual control
window.LiquidText = {
  init(options) {
    const target =
      typeof options.target === "string"
        ? document.getElementById(options.target)
        : options.target;

    if (!target) return console.error("LiquidText: Target not found");
    return createEffect({ container: target, config: options });
  },
};

// 2. SELF-EXECUTION LOGIC
(function autoInit() {
  const script = document.currentScript;
  if (!script) return;

  const configRaw = script.getAttribute("data-config");
  if (configRaw) {
    try {
      const config = JSON.parse(configRaw);

      // Auto-create a background container
      let target = document.getElementById(config.target);
      if (!target && !config.target) {
        target = document.createElement("div");
        target.id = "liquid-text-auto-container";
        Object.assign(target.style, {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          pointerEvents: "none", 
        });
        document.body.prepend(target);
      }

      window.LiquidText.init({ ...config, target });
    } catch (e) {
      console.error("LiquidText: Failed to parse data-config", e);
    }
  }
})();
