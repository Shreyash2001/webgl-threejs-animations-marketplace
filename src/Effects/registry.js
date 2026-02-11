import { createEffect } from "./Dust/engine.js";
import { defaultConfig } from "./Dust/config.js";
import { controls } from "./Dust/controls.js";

export const effectsRegistry = {
  dust: {
    createEffect,
    defaultConfig,
    controls,
  },
};
