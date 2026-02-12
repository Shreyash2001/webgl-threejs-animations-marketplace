export function generateEmbedCode(effectName, config) {
  const username = "Shreyash2001";
  const repo = "webgl-threejs-animations-marketplace";
  const version = "v1.0.0";

  const configString = JSON.stringify(config).replace(/"/g, "&quot;");
  const url = `https://cdn.jsdelivr.net/gh/${username}/${repo}@${version}/dist/${effectName}.umd.js`;

  return `<script src="${url}" data-config="${configString}" defer></script>`;
}
