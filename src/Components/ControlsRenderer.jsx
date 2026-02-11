export default function ControlsRenderer({ controls, config, setConfig }) {
  return (
    <div>
      {controls.map((control) => {
        if (control.type === "text") {
          return (
            <input
              key={control.key}
              type="text"
              value={config[control.key]}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [control.key]: e.target.value,
                })
              }
            />
          );
        }

        if (control.type === "range") {
          return (
            <input
              key={control.key}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step || 1}
              value={config[control.key]}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [control.key]: Number(e.target.value),
                })
              }
            />
          );
        }

        if (control.type === "color") {
          return (
            <input
              key={control.key}
              type="color"
              value={config[control.key]}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [control.key]: e.target.value,
                })
              }
            />
          );
        }

        return null;
      })}
    </div>
  );
}
