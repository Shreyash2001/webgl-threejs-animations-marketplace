export function generateEmbedCode(effectName, config) {
  const configString = JSON.stringify(config).replace(/"/g, "&quot;");

  return `<script 
  src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@1.0.0/dist/${effectName}.umd.js"
  data-config="${configString}"
  defer
></script>`;
}
