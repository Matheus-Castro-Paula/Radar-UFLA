// Utilitários para gravar evidências em docs/testes/evidencias/.
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const DIR_EVIDENCIAS =
  process.env.EVIDENCIAS_DIR || path.resolve(__dirname, "../../../../docs/testes/evidencias");

// Ex.: 2026-11-16_1432 (no fuso local, para bater com o relógio de quem executou)
function carimbo(data = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}_${p(data.getHours())}${p(data.getMinutes())}`;
}

// As evidências vão para o repositório: a pasta pessoal (que contém o nome de
// usuário da máquina) vira "~".
function semPastaPessoal(texto) {
  const home = os.homedir();
  return [home, home.split(path.sep).join("/")].reduce((t, h) => t.split(h).join("~"), texto);
}

async function gravar(nomeArquivo, conteudo) {
  await fs.mkdir(DIR_EVIDENCIAS, { recursive: true });
  const destino = path.join(DIR_EVIDENCIAS, nomeArquivo);
  await fs.writeFile(destino, semPastaPessoal(conteudo), "utf8");
  return destino;
}

function tabela(cabecalho, linhas) {
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  return [
    `| ${cabecalho.map(esc).join(" | ")} |`,
    `| ${cabecalho.map(() => "---").join(" | ")} |`,
    ...linhas.map((l) => `| ${l.map(esc).join(" | ")} |`),
  ].join("\n");
}

module.exports = { DIR_EVIDENCIAS, carimbo, gravar, tabela };
