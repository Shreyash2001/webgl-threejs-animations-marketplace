import { createEffect } from "./Dust/engine.js";
import { defaultConfig } from "./Dust/config.js";
import { controls } from "./Dust/controls.js";

export const effectsRegistry = {
  dust: {
    createEffect,
    defaultConfig,
    controls,
    previewVideo: "https://res.cloudinary.com/cqn/video/upload/v1770997163/Dust_effect_mf4yfy.mp4",
  },
};
