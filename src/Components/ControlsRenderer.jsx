import { Slider } from '@mui/material';

export default function ControlsRenderer({ controls, config, setConfig }) {
  return (
    <>
      {controls.map((control) => {
        if (control.type === "text") {
          return (
            <div key={control.key} className="control-item">
              <label className="control-label">{control.label || control.key}</label>
              <input
                type="text"
                className="styled-input"
                value={config[control.key]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [control.key]: e.target.value,
                  })
                }
              />
            </div>
          );
        }

        if (control.type === "range") {
          return (
            <div key={control.key} className="control-item">
              <label className="control-label">{control.label || control.key}</label>
              <Slider
                value={config[control.key]}
                min={control.min}
                max={control.max}
                step={control.step || 1}
                onChange={(e, newValue) =>
                  setConfig({
                    ...config,
                    [control.key]: newValue,
                  })
                }
                sx={{
                    color: 'white',
                    height: 6,
                    '& .MuiSlider-thumb': {
                        width: 16,
                        height: 16,
                        backgroundColor: 'black',
                        border: '2px solid white',
                        '&:hover': {
                            boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                        },
                         '&.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                         },
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'white',
                        border: 'none',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: 'grey.700', // Dark grey
                        opacity: 0.5,
                    },
                }}
              />
            </div>
          );
        }

        if (control.type === "color") {
          return (
            <div key={control.key} className="control-item">
              <label className="control-label">{control.label || control.key}</label>
              <input
                type="color"
                className="styled-input styled-color"
                value={config[control.key]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [control.key]: e.target.value,
                  })
                }
              />
            </div>
          );
        }

        return null;
      })}
    </>
  );
}
