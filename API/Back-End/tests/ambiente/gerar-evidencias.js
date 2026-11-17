// Executa a suíte Jest e grava em docs/testes/evidencias/:
//   <data>_suite-automatizada.log → saída completa do Jest
//   <data>_suite-automatizada.md  → relatório legível, agrupado por caso CT-xx
//
// Uso: node tests/ambiente/gerar-evidencias.js [argumentos extras do Jest]
// Para o relatório agrupar por caso, o nome do teste deve conter o ID, ex.: "CT-01 ...".
require("./variaveis");

const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { test: config } = require("../../src/config/config");
const { carimbo, gravar, tabela } = require("./evidencia");

const RAIZ = path.resolve(__dirname, "../..");
const JEST = process.env.JEST_BIN || require.resolve("jest/bin/jest", { paths: [RAIZ] });

// Roda o Jest mostrando a saída na tela e guardando uma cópia para o .log
function rodarJest(arquivoJson, extras) {
  return new Promise((resolve) => {
    const args = [JEST, "--ci", "--runInBand", "--json", `--outputFile=${arquivoJson}`, ...extras];
    const filho = spawn(process.execPath, args, { cwd: RAIZ, env: process.env });
    let saida = "";
    const copiar = (destino) => (pedaco) => {
      saida += pedaco;
      destino.write(pedaco);
    };
    filho.stdout.on("data", copiar(process.stdout));
    filho.stderr.on("data", copiar(process.stderr));
    filho.on("close", (codigo) => resolve({ codigo, saida }));
  });
}

const STATUS = { passed: "✅ Aprovado", failed: "❌ Reprovado", pending: "⏸️ Pulado", todo: "📝 A fazer", skipped: "⏸️ Pulado" };
const semCor = (texto) => texto.replace(/\u001b\[[0-9;]*m/g, "");

// Mensagem da falha sem o stack trace interno do Jest, que é longo e expõe
// caminhos absolutos da máquina (inclusive o nome de usuário) no repositório.
// Fica só a primeira linha "at", que aponta o teste que falhou.
function resumirFalha(texto) {
  const linhas = semCor(texto).split("\n");
  const primeiroAt = linhas.findIndex((l) => /^\s+at /.test(l));
  const mensagem = primeiroAt === -1 ? linhas : linhas.slice(0, primeiroAt + 1);
  return mensagem
    .join("\n")
    .split(RAIZ)
    .join(".")
    .slice(0, 2000);
}

function montarRelatorio(resultado, { inicio, nomeLog, codigo }) {
  const testes = resultado.testResults.flatMap((arquivo) =>
    arquivo.assertionResults.map((t) => ({
      arquivo: path.relative(RAIZ, arquivo.name).split(path.sep).join("/"),
      nome: t.fullName,
      status: t.status,
      duracao: t.duration ?? 0,
      falhas: t.failureMessages || [],
      casos: [...new Set(t.fullName.match(/CT-\d{2}/g) || [])],
    })),
  );

  // Um caso reprova se qualquer teste dele reprovar
  const porCaso = new Map();
  for (const t of testes) {
    for (const caso of t.casos) {
      const atual = porCaso.get(caso) || { total: 0, aprovados: 0, reprovados: 0 };
      atual.total += 1;
      if (t.status === "passed") atual.aprovados += 1;
      if (t.status === "failed") atual.reprovados += 1;
      porCaso.set(caso, atual);
    }
  }
  const linhasCasos = [...porCaso.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([caso, r]) => [
      caso,
      r.reprovados > 0 ? STATUS.failed : r.aprovados === r.total ? STATUS.passed : STATUS.pending,
      `${r.aprovados}/${r.total}`,
    ]);

  const falhas = testes.filter((t) => t.status === "failed");
  const suitesComErro = resultado.testResults.filter((a) => a.status === "failed" && a.assertionResults.length === 0);
  const duracaoTotal = ((Date.now() - inicio.getTime()) / 1000).toFixed(1);

  return [
    "# Evidência — Execução da suíte automatizada",
    "",
    `- **Data:** ${inicio.toISOString()}`,
    `- **Resultado:** ${codigo === 0 ? "✅ suíte aprovada" : "❌ suíte com falhas"}`,
    `- **Testes:** ${resultado.numPassedTests} aprovados, ${resultado.numFailedTests} reprovados, ${resultado.numPendingTests + resultado.numTodoTests} pulados, ${resultado.numTotalTests} no total`,
    `- **Arquivos de teste:** ${resultado.numTotalTestSuites} (${resultado.numFailedTestSuites} com falha)`,
    `- **Duração:** ${duracaoTotal} s`,
    `- **Ambiente:** \`NODE_ENV=test\`, banco \`${config.database}\` em \`${config.host}:${config.port}\`, Node ${process.version}, ${os.platform()}`,
    `- **Log completo:** [\`${nomeLog}\`](${nomeLog})`,
    "",
    "## Resultado por caso de teste",
    "",
    linhasCasos.length
      ? tabela(["Caso", "Resultado", "Testes aprovados"], linhasCasos)
      : "_Nenhum teste cita um ID `CT-xx` no nome._",
    "",
    "## Todos os testes",
    "",
    tabela(
      ["Arquivo", "Teste", "Resultado", "Duração (ms)"],
      testes.map((t) => [t.arquivo, t.nome, STATUS[t.status] || t.status, t.duracao]),
    ),
    "",
    ...(falhas.length || suitesComErro.length
      ? [
          "## Falhas",
          "",
          ...falhas.map((t) => `### ${t.nome}\n\n\`\`\`\n${t.falhas.map(resumirFalha).join("\n")}\n\`\`\`\n`),
          ...suitesComErro.map((a) => `### Erro ao carregar \`${path.relative(RAIZ, a.name)}\`\n\n\`\`\`\n${resumirFalha(a.message)}\n\`\`\`\n`),
        ]
      : []),
    "Gerado por `tests/ambiente/gerar-evidencias.js`.",
    "",
  ].join("\n");
}

async function main() {
  const inicio = new Date();
  const base = `${carimbo(inicio)}_suite-automatizada`;
  const arquivoJson = path.join(os.tmpdir(), `${base}.json`);

  const { codigo, saida } = await rodarJest(arquivoJson, process.argv.slice(2));
  const nomeLog = `${base}.log`;
  const log = semCor(saida)
    .split(RAIZ)
    .join(".")
    .replace(/^Test results written to: .*\r?\n?/m, ""); // JSON temporário, apagado logo abaixo
  await gravar(nomeLog, log);

  let resultado;
  try {
    resultado = JSON.parse(await fs.readFile(arquivoJson, "utf8"));
  } catch {
    console.error(">> O Jest não gerou o relatório JSON; veja o log.");
    process.exit(codigo || 1);
  }
  await fs.rm(arquivoJson, { force: true });

  const destino = await gravar(`${base}.md`, montarRelatorio(resultado, { inicio, nomeLog, codigo }));
  console.log(`>> Evidências: ${destino} e ${nomeLog}`);
  process.exit(codigo);
}

main();
