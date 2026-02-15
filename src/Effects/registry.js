import * as dustEngine from "./Dust/engine.js";
import * as dustConfig from "./Dust/config.js";
import * as dustControls from "./Dust/controls.js";

import * as fluidEngine from "./FlowingLiquid/engine.jsx";
import * as fluidConfig from "./FlowingLiquid/config.js";
import * as fluidControls from "./FlowingLiquid/controls.js";

export const effectsRegistry = {
  dust: {
    createEffect: dustEngine.createEffect,
    defaultConfig: dustConfig.defaultConfig,
    controls: dustControls.controls,
    previewVideo: "https://res.cloudinary.com/cqn/video/upload/v1770997163/Dust_effect_mf4yfy.mp4",
  },
  flowingLiquid: {
    createEffect: fluidEngine.createEffect,
    defaultConfig: fluidConfig.defaultConfig,
    controls: fluidControls.controls,
    previewVideo: null,
  },
};
