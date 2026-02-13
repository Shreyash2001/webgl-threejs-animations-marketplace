import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { effectsRegistry } from "../Effects/registry";
import PreviewCanvas from "../Components/PreviewCanvas";
import ControlsRenderer from "../Components/ControlsRenderer";
import { generateEmbedCode } from "../utils/generateEmbed";
import "./Marketplace.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Silk from "../Components/Background/Silk";


export default function EffectCustomizer() {
  const { effectName } = useParams();
  // Fallback to 'dust' if effectName is not found or invalid
  const selectedEffect = effectsRegistry[effectName] ? effectName : "dust";
  const effectModule = effectsRegistry[selectedEffect];

  const [config, setConfig] = useState(effectModule.defaultConfig);

  useEffect(() => {
    setConfig(effectModule.defaultConfig);
  }, [selectedEffect]);

  const [exportCode, setExportCode] = useState("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    setExportCode(generateEmbedCode(selectedEffect, config));
    setOpen(true);
    setCopied(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="marketplace-container">
      <div className="customizer-layout">
         <div className="controls-panel">
            <div className="controls-section">
                <ControlsRenderer
                    controls={effectModule.controls}
                    config={config}
                    setConfig={setConfig}
                />
            </div>
            <button className="export-btn" onClick={handleExport}>
                Export Effect
            </button>
         </div>

         <div className="preview-section">
            <div className="effect-header-preview">
                <h1 className="effect-title-preview">{selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)} Effect</h1>
                <div className="effect-preview-badge-large">
                    <VisibilityIcon fontSize="small" /> 
                    <span>Preview</span>
                </div>
            </div>
            <div className="preview-wrapper">
                <PreviewCanvas effectModule={effectModule} config={config} />
            </div>
         </div>
      </div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
            style: {
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                border: '1px solid #333'
            }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Export Code
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#333' }}>
          <div style={{ position: 'relative' }}>
             <SyntaxHighlighter 
                language="javascript" 
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    borderRadius: '4px',
                    fontSize: '14px',
                }}
            >
                {exportCode}
            </SyntaxHighlighter>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderColor: '#333', justifyContent: 'space-between' }}>
             <Button onClick={handleClose} sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}>
                Cancel
             </Button>
             <Button 
                onClick={handleCopy}
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                variant={copied ? "contained" : "outlined"}
                sx={{
                    color: copied ? 'black !important' : 'white !important',
                    borderColor: 'rgba(255,255,255,0.3) !important',
                    backgroundColor: copied ? 'white !important' : 'transparent',
                    '&:hover': {
                        backgroundColor: copied ? 'white !important' : 'rgba(255,255,255,0.1) !important',
                         borderColor: 'white !important'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: '120px' 
                }}
            >
                {copied ? "Copied" : "Copy Code"}
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
