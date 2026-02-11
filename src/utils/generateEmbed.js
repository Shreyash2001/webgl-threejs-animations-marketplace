export function generateEmbedCode(effectName, config) {
  const username = "Shreyash2001";
  const repo = "dust-text-effect";
  const version = "v1.0.0";

  const configString = JSON.stringify(config).replace(/"/g, "&quot;");
  const url = `https://cdn.jsdelivr.net/gh/${username}/${repo}@${version}/dist/${effectName}.umd.cjs`;

  return `<script src="${url}" data-config="${configString}" defer></script>`;
}
