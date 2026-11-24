const API_BASE = "http://localhost:3000/api";
const API_ORIGIN = API_BASE.replace(/\/api$/, ""); // fotos são servidas em <origem>/uploads/...
const API_URL = `${API_BASE}/auth`;

// Limites de upload (RF-08) — a API valida de novo; aqui é só para avisar cedo
const MAX_FOTOS = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

// Limite da descrição — o back-end valida o mesmo valor (DescricaoHandler)
const LIMITE_DESCRICAO = 200;
// Quantos caracteres da primeira linha aparecem no card do feed
const RESUMO_FEED = 100;

const ROTULOS_CATEGORIA = {
  objeto: "Objeto pessoal",
  eletronico: "Eletrônico",
  documento: "Documento",
  material: "Material acadêmico",
  outro: "Outro",
};

const ICONS = {
  objeto: "🔑",
  eletronico: "🎧",
  documento: "🪪",
  material: "📓",
  outro: "📦",
};

// A API devolve url_imagem relativa ("/uploads/<arquivo>"). Só aceita caminhos
// de /uploads ou URLs http(s): nada de "javascript:" ou "data:" vindo do banco.
function urlDaFoto(url) {
  if (typeof url !== "string") return null;
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  if (/^https?:\/\//i.test(url)) return url;
  return null;
}

// Resumo para o card do feed: só a primeira linha, com reticências se houver mais.
// O texto completo aparece no pop-up de detalhes.
function resumoDescricao(texto) {
  const limpo = String(texto || "").trim();
  const primeiraLinha = limpo.split(/\r?\n/)[0].trim();
  const cortada = Array.from(primeiraLinha);
  if (cortada.length > RESUMO_FEED) {
    return `${cortada.slice(0, RESUMO_FEED).join("").trimEnd()}…`;
  }
  return primeiraLinha.length < limpo.length ? `${primeiraLinha}…` : primeiraLinha;
}

// Converte um anúncio da API (GET /api/anuncios) para o formato usado nos cards
function anuncioParaItem(anuncio) {
  // Data em que o item foi achado/perdido (RF-07); anúncios antigos usam a data de criação
  const data = new Date(anuncio.data_ocorrencia || anuncio.criado_em);
  const quando = `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const autor = anuncio.usuario ? `por ${anuncio.usuario.nome}` : "";

  // RN-04: documento nunca mostra foto, mesmo que a API devolva alguma
  const fotosValidas =
    anuncio.categoria !== "documento" && Array.isArray(anuncio.fotos)
      ? anuncio.fotos
          .map((f) => ({ caminho: f.url_imagem, url: urlDaFoto(f.url_imagem) }))
          .filter((f) => f.url)
      : [];
  const fotos = fotosValidas.map((f) => f.url);
  // Caminhos como a API guarda ("/uploads/..."): a edição devolve esses mesmos valores
  const fotosCaminhos = fotosValidas.map((f) => f.caminho);
  const primeiraFoto = fotos[0] || null;

  return {
    id: anuncio.id,
    autorId: anuncio.usuario ? anuncio.usuario.id : null,
    feed: anuncio.tipo === "ACHADO" ? "achados" : "perdidos",
    categoria: anuncio.categoria,
    titulo: anuncio.titulo,
    descricao: anuncio.descricao,
    local: anuncio.local_encontro || "",
    imagem: primeiraFoto,
    fotos,
    fotosCaminhos,
    dataIso: anuncio.data_ocorrencia || anuncio.criado_em,
    quando,
    autorNome: anuncio.usuario ? anuncio.usuario.nome : "",
    meta: [anuncio.local_encontro, quando, autor].filter(Boolean).join(" · "),
  };
}

// Id do usuário logado, lido do payload do JWT (só para decidir se mostra os
// botões do RF-09; quem autoriza de verdade é a API, que confere o autor — RN-02).
function usuarioLogadoId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const dados = JSON.parse(atob(payload));
    if (dados.exp && dados.exp * 1000 < Date.now()) return null;
    return dados.id ?? null;
  } catch {
    return null;
  }
}

// --- Utilitários ---

function escapeHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Mostra mensagem na tela (substitui alert). Usa o <p id="form-message">.
function mostrarMensagem(texto, tipo = "erro") {
  const el = document.getElementById("form-message");
  if (!el) {
    alert(texto);
    return;
  }
  el.textContent = texto;
  el.className = `form-message ${tipo}`;
  el.hidden = false;
}

function limparMensagem() {
  const el = document.getElementById("form-message");
  if (el) el.hidden = true;
}

// --- Regras LGPD (front-end) ---

const REGEX_CPF = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;

// Remove pontos e hífens para detectar números de documento (RG, matrícula etc.)
function contemNumeroDeDocumento(texto) {
  return /\d{7,}/.test(texto.replace(/[.\-]/g, ""));
}

function validarLGPDPublicacao(categoria, titulo, descricao) {
  const texto = `${titulo} ${descricao}`;

  if (REGEX_CPF.test(texto)) {
    return "Por segurança (LGPD), não informe CPF no título ou na descrição.";
  }
  if (categoria === "documento" && contemNumeroDeDocumento(texto)) {
    return "Por segurança (LGPD), não informe números de documento (RG, matrícula, etc.). Descreva apenas o tipo do documento.";
  }
  return null;
}

// --- Diálogos do site (substituem o confirm() do navegador) ---

// Monta o fundo escuro + diálogo e cuida de ESC, clique fora, Tab preso dentro,
// rolagem da página e devolução do foco. Devolve a função que fecha o diálogo.
function abrirDialogo(dialog, { focoInicial, origem, aoFechar } = {}) {
  const focoAnterior = origem || document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  document.body.classList.add("modal-aberto");

  function fechar() {
    document.removeEventListener("keydown", aoTeclar);
    overlay.remove();
    document.body.classList.remove("modal-aberto");
    if (focoAnterior && typeof focoAnterior.focus === "function") focoAnterior.focus();
    if (aoFechar) aoFechar();
  }

  function aoTeclar(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      fechar();
      return;
    }
    if (e.key === "Tab") {
      const focaveis = Array.from(
        dialog.querySelectorAll("button, input, select, textarea, a[href]"),
      ).filter((el) => !el.disabled);
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }
  }

  // mousedown (e não click): selecionar texto no formulário e soltar fora não fecha
  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) fechar();
  });
  document.addEventListener("keydown", aoTeclar);
  (focoInicial || dialog).focus();
  return fechar;
}

// Pergunta de confirmação no estilo do site. Devolve Promise<boolean>.
// O foco começa em "Cancelar": Enter sem querer nunca confirma uma exclusão.
function confirmarAcao({ titulo, mensagem, rotuloConfirmar = "Confirmar", perigo = false }) {
  return new Promise((resolve) => {
    const dialog = document.createElement("div");
    dialog.className = "modal modal-confirm";
    dialog.setAttribute("role", "alertdialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "confirm-titulo");
    dialog.setAttribute("aria-describedby", "confirm-mensagem");
    dialog.tabIndex = -1;

    const corpo = document.createElement("div");
    corpo.className = "modal-body";

    const h2 = document.createElement("h2");
    h2.id = "confirm-titulo";
    h2.className = "modal-title";
    h2.textContent = titulo;

    const p = document.createElement("p");
    p.id = "confirm-mensagem";
    p.className = "modal-desc";
    p.textContent = mensagem;

    const acoes = document.createElement("div");
    acoes.className = "dialog-actions";

    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "btn-dialog";
    cancelar.textContent = "Cancelar";

    const confirmar = document.createElement("button");
    confirmar.type = "button";
    confirmar.className = "btn-dialog " + (perigo ? "perigo" : "primario");
    confirmar.textContent = rotuloConfirmar;

    acoes.append(cancelar, confirmar);
    corpo.append(h2, p, acoes);
    dialog.appendChild(corpo);

    const fechar = abrirDialogo(dialog, {
      focoInicial: cancelar,
      aoFechar: () => resolve(false), // ESC, clique fora ou Cancelar
    });
    cancelar.addEventListener("click", fechar);
    confirmar.addEventListener("click", () => {
      resolve(true); // o primeiro resolve vale; o resolve(false) do fechar é ignorado
      fechar();
    });
  });
}

// --- Edição do anúncio (RF-09) ---

// Formulário de edição em um diálogo. Só envia o que mudou (PUT parcial), então um
// anúncio antigo com descrição longa não é barrado por um campo que ninguém tocou.
// A API repete todas as validações e confere o autor (RN-02). Na edição só dá para
// remover fotos já publicadas; adicionar fotos novas continua sendo pela publicação.
function abrirEdicaoAnuncio(item, origem, aoSalvar) {
  const dialog = document.createElement("div");
  dialog.className = "modal modal-edicao";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "edicao-titulo");
  dialog.tabIndex = -1;

  let fechar = () => {};

  const fecharX = document.createElement("button");
  fecharX.type = "button";
  fecharX.className = "modal-close";
  fecharX.setAttribute("aria-label", "Fechar edição");
  fecharX.textContent = "×";
  fecharX.addEventListener("click", () => fechar());

  const corpo = document.createElement("div");
  corpo.className = "modal-body";

  const h2 = document.createElement("h2");
  h2.id = "edicao-titulo";
  h2.className = "modal-title";
  h2.textContent = "Editar anúncio";

  const form = document.createElement("form");
  form.className = "edit-form";
  form.noValidate = true;

  function campo(rotulo, controle) {
    const label = document.createElement("label");
    label.className = "edit-field";
    const span = document.createElement("span");
    span.className = "edit-label";
    span.textContent = rotulo;
    label.append(span, controle);
    return label;
  }
  function selectCom(opcoes, valor) {
    const s = document.createElement("select");
    opcoes.forEach(([v, rotulo]) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = rotulo;
      s.appendChild(o);
    });
    s.value = valor;
    return s;
  }

  const tipoOriginal = item.feed === "achados" ? "ACHADO" : "PERDIDO";
  const tipoSel = selectCom([["ACHADO", "Achado"], ["PERDIDO", "Perdido"]], tipoOriginal);
  const categoriaSel = selectCom(Object.entries(ROTULOS_CATEGORIA), item.categoria);

  const tituloInput = document.createElement("input");
  tituloInput.type = "text";
  tituloInput.maxLength = 120;
  tituloInput.value = item.titulo;

  const descricaoInput = document.createElement("textarea");
  descricaoInput.rows = 4;
  descricaoInput.maxLength = LIMITE_DESCRICAO;
  descricaoInput.value = item.descricao;
  const contador = document.createElement("small");
  contador.className = "contador-descricao";
  contador.setAttribute("aria-live", "polite");
  function atualizarContador() {
    const usados = Array.from(descricaoInput.value).length;
    contador.textContent = `${usados}/${LIMITE_DESCRICAO}`;
    contador.classList.toggle("no-limite", usados >= LIMITE_DESCRICAO);
  }
  descricaoInput.addEventListener("input", atualizarContador);
  atualizarContador();

  const localInput = document.createElement("input");
  localInput.type = "text";
  localInput.maxLength = 150;
  localInput.value = item.local;

  // datetime-local trabalha na hora do navegador, sem fuso
  function paraCampoData(data) {
    if (Number.isNaN(data.getTime())) return "";
    const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
    return ajustada.toISOString().slice(0, 16);
  }
  const dataInput = document.createElement("input");
  dataInput.type = "datetime-local";
  dataInput.max = paraCampoData(new Date());
  const dataInicial = paraCampoData(new Date(item.dataIso));
  dataInput.value = dataInicial;

  const linhaTipos = document.createElement("div");
  linhaTipos.className = "edit-row";
  linhaTipos.append(campo("Tipo", tipoSel), campo("Categoria", categoriaSel));

  const campoDescricao = campo("Descrição", descricaoInput);
  campoDescricao.appendChild(contador);

  const linhaLocalData = document.createElement("div");
  linhaLocalData.className = "edit-row";
  linhaLocalData.append(campo("Local", localInput), campo("Data e hora", dataInput));

  form.append(linhaTipos, campo("Título", tituloInput), campoDescricao, linhaLocalData);

  // Fotos já publicadas: dá para marcar para remover (e desfazer antes de salvar)
  const removidas = new Set();
  if (item.fotos.length > 0) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "edit-fotos";
    const legend = document.createElement("legend");
    legend.className = "edit-label";
    legend.textContent = "Fotos";
    fieldset.appendChild(legend);

    const lista = document.createElement("div");
    lista.className = "edit-fotos-lista";
    item.fotos.forEach((url, i) => {
      const caixa = document.createElement("div");
      caixa.className = "edit-foto";
      const img = document.createElement("img");
      img.alt = `Foto ${i + 1}`;
      img.src = url;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "edit-foto-btn";
      btn.textContent = "Remover";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `Remover foto ${i + 1}`);
      btn.addEventListener("click", () => {
        const marcada = !removidas.has(i);
        if (marcada) removidas.add(i);
        else removidas.delete(i);
        caixa.classList.toggle("removida", marcada);
        btn.textContent = marcada ? "Desfazer" : "Remover";
        btn.setAttribute("aria-pressed", String(marcada));
        btn.setAttribute("aria-label", `${marcada ? "Desfazer remoção da" : "Remover"} foto ${i + 1}`);
      });
      caixa.append(img, btn);
      lista.appendChild(caixa);
    });
    fieldset.appendChild(lista);
    const dica = document.createElement("p");
    dica.className = "edit-dica";
    dica.textContent = "Aqui só é possível remover fotos já publicadas. Para outras fotos, publique um novo anúncio.";
    fieldset.appendChild(dica);
    form.appendChild(fieldset);
  }

  const erro = document.createElement("p");
  erro.className = "edit-erro";
  erro.setAttribute("role", "alert");
  erro.hidden = true;

  const acoes = document.createElement("div");
  acoes.className = "dialog-actions";
  const cancelar = document.createElement("button");
  cancelar.type = "button";
  cancelar.className = "btn-dialog";
  cancelar.textContent = "Cancelar";
  cancelar.addEventListener("click", () => fechar());
  const salvar = document.createElement("button");
  salvar.type = "submit";
  salvar.className = "btn-dialog primario";
  salvar.textContent = "Salvar alterações";
  acoes.append(cancelar, salvar);

  form.append(erro, acoes);
  corpo.append(h2, form);
  dialog.append(fecharX, corpo);

  function falhar(mensagem, campoComErro) {
    erro.textContent = mensagem;
    erro.hidden = false;
    if (campoComErro) campoComErro.focus();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erro.hidden = true;

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const local = localInput.value.trim();

    if (!titulo) return falhar("Informe um título para o item.", tituloInput);
    if (!descricao) return falhar("Descreva o item para ajudar a identificá-lo.", descricaoInput);
    if (Array.from(descricao).length > LIMITE_DESCRICAO) {
      return falhar(`A descrição pode ter no máximo ${LIMITE_DESCRICAO} caracteres.`, descricaoInput);
    }
    if (!local) return falhar("Informe o local onde o item foi achado ou perdido.", localInput);
    if (!dataInput.value) return falhar("Informe a data e a hora da ocorrência.", dataInput);
    const dataNova = new Date(dataInput.value);
    if (Number.isNaN(dataNova.getTime()) || dataNova > new Date()) {
      return falhar("A data e a hora não podem estar no futuro.", dataInput);
    }

    // Só vai o que mudou
    const mudancas = {};
    if (tipoSel.value !== tipoOriginal) mudancas.tipo = tipoSel.value;
    if (categoriaSel.value !== item.categoria) mudancas.categoria = categoriaSel.value;
    if (titulo !== String(item.titulo).trim()) mudancas.titulo = titulo;
    if (descricao !== String(item.descricao).trim()) mudancas.descricao = descricao;
    if (local !== String(item.local).trim()) mudancas.local_encontro = local;
    if (dataInput.value !== dataInicial) mudancas.data_ocorrencia = dataNova.toISOString();
    if (removidas.size > 0) {
      mudancas.fotos = item.fotosCaminhos.filter((_, i) => !removidas.has(i));
    }

    if (Object.keys(mudancas).length === 0) {
      fechar();
      return;
    }

    if (mudancas.titulo !== undefined || mudancas.descricao !== undefined || mudancas.categoria !== undefined) {
      const erroLGPD = validarLGPDPublicacao(categoriaSel.value, titulo, descricao);
      if (erroLGPD) return falhar(erroLGPD, descricaoInput);
    }

    const token = localStorage.getItem("token");
    salvar.disabled = true;
    salvar.textContent = "Salvando...";
    try {
      const response = await fetch(`${API_BASE}/anuncios/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(mudancas),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        fechar();
        if (data.anuncio) aoSalvar(data.anuncio);
        else window.location.reload();
        return;
      }
      if (response.status === 401) {
        localStorage.removeItem("token");
        falhar("Sua sessão expirou. Entre novamente para editar.");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } else if (response.status === 404) {
        falhar("Este anúncio não existe mais. Feche e atualize a página.");
      } else {
        falhar(data.error || "Não foi possível salvar as alterações. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      falhar("Não foi possível conectar ao servidor.");
    }
    salvar.disabled = false;
    salvar.textContent = "Salvar alterações";
  });

  fechar = abrirDialogo(dialog, { focoInicial: tituloInput, origem });
}

// --- Pop-up de detalhes do anúncio ---

// Busca o e-mail do autor e mostra no pop-up. A vitrine pública não traz e-mail
// (RN-04): ele vem de uma rota que exige login. Sem login, mostra o convite para entrar.
// Só vira link mailto: se o e-mail tiver formato simples, para nada estranho entrar na URL.
function carregarContatoDoAutor(dd, item) {
  const token = localStorage.getItem("token");

  function mostrarLinkLogin(texto) {
    dd.textContent = "";
    const a = document.createElement("a");
    a.href = "login.html";
    a.textContent = texto;
    dd.appendChild(a);
  }

  if (usuarioLogadoId() === null) {
    mostrarLinkLogin("Entre na sua conta para ver o contato");
    return;
  }

  dd.textContent = "Carregando...";
  fetch(`${API_BASE}/anuncios/${item.id}/contato`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        mostrarLinkLogin("Sua sessão expirou. Entre novamente para ver o contato");
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { email } = await response.json();
      dd.textContent = "";
      if (/^[^\s@?&<>"]+@[^\s@?&<>"]+$/.test(email)) {
        const a = document.createElement("a");
        a.href = `mailto:${email}`;
        a.textContent = email;
        dd.appendChild(a);
      } else {
        dd.textContent = email;
      }
    })
    .catch((err) => {
      console.error(err);
      dd.textContent = "Não foi possível carregar o contato.";
    });
}

// Abre um diálogo com fotos, descrição completa e dados do anúncio.
// RN-04: a vitrine pública só traz o nome do autor; o e-mail é buscado à parte
// e só para quem está logado (carregarContatoDoAutor).
// Tudo é inserido com textContent/propriedades, nunca com innerHTML (anti-XSS).
function abrirDetalhesAnuncio(item, elementoOrigem) {
  const rotuloTipo = item.feed === "achados" ? "Achado" : "Perdido";
  const focoAnterior = elementoOrigem || document.activeElement;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const dialog = document.createElement("div");
  dialog.className = "modal";
  dialog.dataset.feed = item.feed;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "modal-titulo");

  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "modal-close";
  fechar.setAttribute("aria-label", "Fechar detalhes do anúncio");
  fechar.textContent = "×";

  // Galeria: foto principal + miniaturas (até 3). Sem foto, mostra o ícone da categoria.
  const galeria = document.createElement("div");
  galeria.className = "modal-gallery";
  if (item.fotos.length > 0) {
    const principal = document.createElement("img");
    principal.className = "modal-photo";
    principal.alt = `Foto 1 de ${item.fotos.length}: ${item.titulo}`;
    principal.src = item.fotos[0];
    principal.addEventListener("error", () => principal.classList.add("sem-foto"));
    galeria.appendChild(principal);

    if (item.fotos.length > 1) {
      const miniaturas = document.createElement("div");
      miniaturas.className = "modal-thumbs";
      item.fotos.forEach((url, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "modal-thumb" + (i === 0 ? " active" : "");
        btn.setAttribute("aria-label", `Ver foto ${i + 1} de ${item.fotos.length}`);
        const mini = document.createElement("img");
        mini.alt = "";
        mini.src = url;
        btn.appendChild(mini);
        btn.addEventListener("click", () => {
          principal.src = url;
          principal.alt = `Foto ${i + 1} de ${item.fotos.length}: ${item.titulo}`;
          principal.classList.remove("sem-foto");
          miniaturas.querySelectorAll(".modal-thumb").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
        miniaturas.appendChild(btn);
      });
      galeria.appendChild(miniaturas);
    }
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "modal-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = ICONS[item.categoria] || "📦";
    galeria.appendChild(placeholder);
  }

  const corpo = document.createElement("div");
  corpo.className = "modal-body";

  const selo = document.createElement("span");
  selo.className = "card-badge modal-badge";
  selo.textContent = rotuloTipo;

  const titulo = document.createElement("h2");
  titulo.id = "modal-titulo";
  titulo.className = "modal-title";
  titulo.textContent = item.titulo;

  const descricao = document.createElement("p");
  descricao.className = "modal-desc";
  descricao.textContent = item.descricao;

  const detalhes = document.createElement("dl");
  detalhes.className = "modal-details";
  const linhas = [
    ["Categoria", ROTULOS_CATEGORIA[item.categoria] || item.categoria],
    ["Local", item.local],
    [item.feed === "achados" ? "Achado em" : "Perdido em", item.quando],
    ["Publicado por", item.autorNome],
  ];
  linhas.forEach(([rotulo, valor]) => {
    if (!valor) return;
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    detalhes.append(dt, dd);
  });

  // Contato: preenchido depois, conforme o usuário esteja logado ou não
  const dtContato = document.createElement("dt");
  dtContato.textContent = "Contato";
  const ddContato = document.createElement("dd");
  detalhes.append(dtContato, ddContato);
  carregarContatoDoAutor(ddContato, item);

  corpo.append(selo, titulo, descricao, detalhes);
  dialog.append(fechar, galeria, corpo);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  document.body.classList.add("modal-aberto");
  fechar.focus();

  function encerrar() {
    document.removeEventListener("keydown", aoTeclar);
    overlay.remove();
    document.body.classList.remove("modal-aberto");
    if (focoAnterior && typeof focoAnterior.focus === "function") focoAnterior.focus();
  }

  function aoTeclar(e) {
    if (e.key === "Escape") {
      encerrar();
      return;
    }
    // Mantém o foco do Tab dentro do pop-up
    if (e.key === "Tab") {
      const focaveis = dialog.querySelectorAll("button");
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }
  }

  fechar.addEventListener("click", encerrar);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) encerrar();
  });
  document.addEventListener("keydown", aoTeclar);
}

// --- Página do feed (index.html) ---

function initFeed() {
  const feedEl = document.getElementById("feed");
  if (!feedEl) return;

  const tabs = document.querySelectorAll(".tab");
  const searchInput = document.getElementById("search");
  const localInput = document.getElementById("filtro-local");
  const categoriaChecks = document.querySelectorAll(
    '.filters input[type="checkbox"]',
  );
  const emptyState = document.getElementById("empty-state");
  const mensagemVazio = emptyState.textContent;

  let activeFeed = "achados";
  let itens = [];
  const meuId = usuarioLogadoId();

  // Chama PUT/DELETE e trata os erros comuns (401, 403, 404)
  async function chamarApi(item, opcoes, botao, rotuloEnvio) {
    const token = localStorage.getItem("token");
    const rotulo = botao.textContent;
    limparMensagem();
    botao.disabled = true;
    botao.textContent = rotuloEnvio;
    try {
      const response = await fetch(`${API_BASE}/anuncios/${item.id}`, {
        ...opcoes,
        headers: { ...opcoes.headers, Authorization: `Bearer ${token}` },
      });
      if (response.ok) return true;

      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        localStorage.removeItem("token");
        mostrarMensagem("Sua sessão expirou. Entre novamente.");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } else if (response.status === 404) {
        mostrarMensagem("Este anúncio não existe mais. Atualizando a lista...");
        itens = itens.filter((i) => i.id !== item.id);
        render();
      } else {
        mostrarMensagem(data.error || "Não foi possível concluir a ação. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      mostrarMensagem("Não foi possível conectar ao servidor.");
    }
    botao.disabled = false;
    botao.textContent = rotulo;
    return false;
  }

  async function resolverAnuncio(item, botao) {
    const confirmou = await confirmarAcao({
      titulo: "Marcar como resolvido?",
      mensagem: `“${item.titulo}” sairá da vitrine.`,
      rotuloConfirmar: "Marcar como resolvido",
    });
    if (!confirmou) return;
    const ok = await chamarApi(
      item,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVIDO" }),
      },
      botao,
      "Salvando...",
    );
    if (ok) {
      itens = itens.filter((i) => i.id !== item.id);
      render();
      mostrarMensagem("Anúncio marcado como resolvido.", "sucesso");
    }
  }

  async function excluirAnuncio(item, botao) {
    const confirmou = await confirmarAcao({
      titulo: "Excluir anúncio?",
      mensagem: `“${item.titulo}” será excluído definitivamente. Esta ação não pode ser desfeita.`,
      rotuloConfirmar: "Excluir",
      perigo: true,
    });
    if (!confirmou) return;
    const ok = await chamarApi(item, { method: "DELETE", headers: {} }, botao, "Excluindo...");
    if (ok) {
      itens = itens.filter((i) => i.id !== item.id);
      render();
      mostrarMensagem("Anúncio excluído.", "sucesso");
    }
  }

  // Depois de editar, troca o item pelo que a API devolveu e redesenha o feed
  function aoEditar(anuncioAtualizado) {
    const novo = anuncioParaItem(anuncioAtualizado);
    itens = itens.map((i) => (i.id === novo.id ? novo : i));
    render();
    mostrarMensagem("Anúncio atualizado.", "sucesso");
  }

  function categoriasAtivas() {
    return Array.from(categoriaChecks)
      .filter((c) => c.checked)
      .map((c) => c.value);
  }

  function render() {
    const termo = (searchInput.value || "").toLowerCase();
    const local = (localInput.value || "").toLowerCase();
    const categorias = categoriasAtivas();

    const filtrados = itens.filter((item) => {
      if (item.feed !== activeFeed) return false;
      if (categorias.length && !categorias.includes(item.categoria))
        return false;
      if (local && !item.local.toLowerCase().includes(local)) return false;
      if (termo) {
        const alvo = (item.titulo + " " + item.descricao).toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });

    feedEl.innerHTML = "";
    filtrados.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.feed = item.feed;
      // Card inteiro abre o pop-up de detalhes (teclado: Enter ou Espaço)
      card.tabIndex = 0;
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `Ver detalhes: ${item.titulo}`);
      const rotulo = item.feed === "achados" ? "Achado" : "Perdido";
      // escapeHTML evita XSS: título, descrição e local são digitados por usuários
      card.innerHTML = `
        <div class="card-thumb">
          <span class="card-badge">${rotulo}</span>
          <span class="card-placeholder" aria-hidden="true">${ICONS[item.categoria] || "📦"}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(item.titulo)}</h3>
          <p class="card-desc">${escapeHTML(resumoDescricao(item.descricao))}</p>
          <div class="card-meta">${escapeHTML(item.meta)}</div>
        </div>
      `;

      // Foto real do item; se não houver (ou falhar ao carregar), fica o placeholder
      if (item.imagem) {
        const thumb = card.querySelector(".card-thumb");
        const img = document.createElement("img");
        img.className = "card-img";
        img.alt = `Foto: ${item.titulo}`;
        img.loading = "lazy";
        img.addEventListener("error", () => img.remove());
        img.src = item.imagem; // atribuído como propriedade, nunca interpolado no HTML
        thumb.appendChild(img);
      }

      // RF-09: só o autor vê os botões (a API também confere: RN-02)
      if (meuId !== null && item.autorId === meuId) {
        const acoes = document.createElement("div");
        acoes.className = "card-actions";

        const resolver = document.createElement("button");
        resolver.type = "button";
        resolver.className = "btn-card btn-resolver";
        resolver.textContent = "Marcar como Resolvido";
        resolver.setAttribute("aria-label", `Marcar como resolvido: ${item.titulo}`);
        resolver.addEventListener("click", () => resolverAnuncio(item, resolver));

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn-card btn-editar";
        editar.textContent = "Editar";
        editar.setAttribute("aria-label", `Editar anúncio: ${item.titulo}`);
        editar.addEventListener("click", () => abrirEdicaoAnuncio(item, editar, aoEditar));

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "btn-card btn-excluir";
        excluir.textContent = "Excluir";
        excluir.setAttribute("aria-label", `Excluir anúncio: ${item.titulo}`);
        excluir.addEventListener("click", () => excluirAnuncio(item, excluir));

        acoes.append(resolver, editar, excluir);
        card.appendChild(acoes);
      }

      card.addEventListener("click", (e) => {
        // Cliques nos botões do autor (resolver/excluir) não abrem o pop-up
        if (e.target.closest(".card-actions")) return;
        abrirDetalhesAnuncio(item, card);
      });
      card.addEventListener("keydown", (e) => {
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrirDetalhesAnuncio(item, card);
        }
      });
      feedEl.appendChild(card);
    });

    emptyState.hidden = filtrados.length !== 0;

    document.getElementById("count-achados").textContent = itens.filter(
      (i) => i.feed === "achados",
    ).length;
    document.getElementById("count-perdidos").textContent = itens.filter(
      (i) => i.feed === "perdidos",
    ).length;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      activeFeed = tab.dataset.feed;
      render();
    });
  });

  searchInput.addEventListener("input", render);
  localInput.addEventListener("input", render);
  categoriaChecks.forEach((c) => c.addEventListener("change", render));

  async function carregarAnuncios() {
    emptyState.textContent = "Carregando anúncios...";
    emptyState.hidden = false;

    try {
      const response = await fetch(`${API_BASE}/anuncios`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const anuncios = await response.json();

      itens = anuncios.map(anuncioParaItem);
      emptyState.textContent = mensagemVazio;
      render();
    } catch (err) {
      console.error(err);
      emptyState.textContent =
        "Não foi possível carregar os anúncios. Verifique se a API está rodando.";
      emptyState.hidden = false;
    }
  }

  carregarAnuncios();
}

// Botão "Entrar" vira "Sair" quando há token salvo
function initAuthLink() {
  const btn = document.getElementById("btn-login");
  if (!btn || !localStorage.getItem("token")) return;

  btn.textContent = "Sair";
  btn.href = "#";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  });
}

// --- Página de publicação (publicar.html) ---

function formatarTamanho(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Valida uma foto no navegador (a API repete a validação: RF-08).
// Devolve a mensagem de erro ou null se estiver ok.
function erroDaFoto(arquivo) {
  if (!TIPOS_FOTO.includes(arquivo.type)) {
    return `"${arquivo.name}" não é JPG, PNG ou WEBP.`;
  }
  if (arquivo.size > MAX_BYTES) {
    return `"${arquivo.name}" tem ${formatarTamanho(arquivo.size)}. Cada foto deve ter no máximo 5 MB.`;
  }
  return null;
}

function initPublishPage() {
  const form = document.getElementById("publish-form");
  if (!form) return;

  const segmentedOptions = document.querySelectorAll(".segmented-option");
  const categoriaSelect = document.getElementById("categoria");
  const uploadColumn = document.getElementById("upload-column");
  const uploadArea = document.getElementById("upload-area");
  const fotosInput = document.getElementById("fotos");
  const previewsEl = document.getElementById("foto-previews");
  const docNote = document.getElementById("doc-note");
  const tituloInput = document.getElementById("titulo");
  const descricaoInput = document.getElementById("descricao");
  const dataInput = document.getElementById("data-ocorrencia");

  // O item não pode ter sido achado/perdido no futuro
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  dataInput.max = agora.toISOString().slice(0, 16);

  // Limite da descrição (a API valida de novo) com contador de caracteres
  descricaoInput.maxLength = LIMITE_DESCRICAO;
  const contador = document.createElement("small");
  contador.className = "contador-descricao";
  contador.setAttribute("aria-live", "polite");
  descricaoInput.insertAdjacentElement("afterend", contador);
  function atualizarContador() {
    const usados = Array.from(descricaoInput.value).length;
    contador.textContent = `${usados}/${LIMITE_DESCRICAO}`;
    contador.classList.toggle("no-limite", usados >= LIMITE_DESCRICAO);
  }
  descricaoInput.addEventListener("input", atualizarContador);
  atualizarContador();

  let fotos = []; // arquivos escolhidos (File)

  segmentedOptions.forEach((option) => {
    option.addEventListener("click", () => {
      segmentedOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });

  // --- Fotos: seleção, prévia e remoção ---

  function renderPreviews() {
    previewsEl.innerHTML = "";
    fotos.forEach((arquivo, indice) => {
      const li = document.createElement("li");
      li.className = "foto-preview";

      const img = document.createElement("img");
      img.alt = `Prévia: ${arquivo.name}`;
      const urlLocal = URL.createObjectURL(arquivo);
      img.src = urlLocal;
      img.addEventListener("load", () => URL.revokeObjectURL(urlLocal));

      const remover = document.createElement("button");
      remover.type = "button";
      remover.className = "foto-remover";
      remover.setAttribute("aria-label", `Remover ${arquivo.name}`);
      remover.textContent = "×";
      remover.addEventListener("click", () => {
        fotos.splice(indice, 1);
        limparMensagem();
        renderPreviews();
      });

      li.append(img, remover);
      previewsEl.appendChild(li);
    });
  }

  function adicionarFotos(lista) {
    limparMensagem();
    const recusadas = [];

    for (const arquivo of lista) {
      if (fotos.length >= MAX_FOTOS) {
        recusadas.push(`Envie no máximo ${MAX_FOTOS} fotos. As demais foram ignoradas.`);
        break;
      }
      const erro = erroDaFoto(arquivo);
      if (erro) {
        recusadas.push(erro);
        continue;
      }
      fotos.push(arquivo);
    }

    renderPreviews();
    if (recusadas.length) mostrarMensagem(recusadas.join(" "));
  }

  fotosInput.addEventListener("change", () => {
    adicionarFotos(Array.from(fotosInput.files));
    fotosInput.value = ""; // permite escolher o mesmo arquivo de novo
  });

  ["dragenter", "dragover"].forEach((nome) =>
    uploadArea.addEventListener(nome, (e) => {
      e.preventDefault();
      uploadArea.classList.add("arrastando");
    }),
  );
  ["dragleave", "drop"].forEach((nome) =>
    uploadArea.addEventListener(nome, (e) => {
      e.preventDefault();
      uploadArea.classList.remove("arrastando");
    }),
  );
  uploadArea.addEventListener("drop", (e) => {
    adicionarFotos(Array.from(e.dataTransfer.files));
  });

  // --- Regra LGPD (RN-04): documento não tem foto ---

  function atualizarPorCategoria() {
    const isDocumento = categoriaSelect.value === "documento";
    const tinhaFotos = fotos.length > 0;

    if (isDocumento) {
      fotos = [];
      renderPreviews();
    }
    uploadColumn.style.display = isDocumento ? "none" : "flex";
    docNote.hidden = !isDocumento;

    if (isDocumento && tinhaFotos) {
      mostrarMensagem(
        "Fotos não são permitidas para documentos (LGPD). As fotos selecionadas foram removidas.",
      );
    }
  }

  categoriaSelect.addEventListener("change", atualizarPorCategoria);
  atualizarPorCategoria();

  // --- Envio ---

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparMensagem();
    [tituloInput, descricaoInput, dataInput, form.elements.local].forEach((campo) =>
      campo.classList.remove("invalido"),
    );

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const local = form.elements.local.value.trim();

    if (!titulo) {
      tituloInput.classList.add("invalido");
      mostrarMensagem("Informe um título para o item.");
      return;
    }

    if (!descricao) {
      descricaoInput.classList.add("invalido");
      mostrarMensagem("Descreva o item para ajudar a identificá-lo.");
      return;
    }

    if (Array.from(descricao).length > LIMITE_DESCRICAO) {
      descricaoInput.classList.add("invalido");
      mostrarMensagem(`A descrição pode ter no máximo ${LIMITE_DESCRICAO} caracteres.`);
      return;
    }

    if (!local) {
      form.elements.local.classList.add("invalido");
      mostrarMensagem("Informe o local onde o item foi achado ou perdido.");
      return;
    }

    if (!dataInput.value) {
      dataInput.classList.add("invalido");
      mostrarMensagem("Informe a data e a hora em que o item foi achado ou perdido.");
      return;
    }
    const dataOcorrencia = new Date(dataInput.value);
    if (Number.isNaN(dataOcorrencia.getTime()) || dataOcorrencia > new Date()) {
      dataInput.classList.add("invalido");
      mostrarMensagem("A data e a hora não podem estar no futuro.");
      return;
    }

    const erroLGPD = validarLGPDPublicacao(
      categoriaSelect.value,
      tituloInput.value,
      descricaoInput.value,
    );
    if (erroLGPD) {
      descricaoInput.classList.add("invalido");
      mostrarMensagem(erroLGPD);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      mostrarMensagem("Entre na sua conta para publicar. Redirecionando para o login...");
      setTimeout(() => (window.location.href = "login.html"), 1500);
      return;
    }

    // multipart/form-data: campos de texto + arquivos no campo "fotos" (RF-07, RF-08).
    // Não definimos Content-Type: o navegador gera o boundary sozinho.
    const dados = new FormData();
    dados.append("titulo", titulo);
    dados.append("descricao", descricao);
    dados.append("tipo", form.elements.tipo.value === "achados" ? "ACHADO" : "PERDIDO");
    dados.append("categoria", categoriaSelect.value);
    dados.append("local_encontro", local);
    dados.append("data_ocorrencia", dataOcorrencia.toISOString());
    if (categoriaSelect.value !== "documento") {
      fotos.forEach((arquivo) => dados.append("fotos", arquivo));
    }

    const botao = form.querySelector("button[type='submit']");
    botao.disabled = true;
    botao.textContent = fotos.length ? "Enviando fotos..." : "Publicando...";

    function liberarBotao() {
      botao.disabled = false;
      botao.textContent = "Publicar";
    }

    try {
      const response = await fetch(`${API_BASE}/anuncios`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dados,
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        mostrarMensagem("Item publicado! Redirecionando para o feed...", "sucesso");
        setTimeout(() => (window.location.href = "index.html"), 1200);
        return;
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
        mostrarMensagem("Sua sessão expirou. Entre novamente para publicar.");
        setTimeout(() => (window.location.href = "login.html"), 1500);
        return;
      }

      // 400: regra de negócio ou validação da API (RN-04, tamanho/tipo da foto...) —
      // mostra a mensagem que ela devolve. Outros erros: mensagem genérica.
      mostrarMensagem(
        response.status === 400 && data.error
          ? data.error
          : "Não foi possível publicar o item agora. Tente novamente em instantes.",
      );
      liberarBotao();
    } catch (err) {
      console.error(err);
      mostrarMensagem("Não foi possível conectar ao servidor.");
      liberarBotao();
    }
  });
}

// --- Login (login.html) ---

function initLogin() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparMensagem();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const botao = loginForm.querySelector("button[type='submit']");
    botao.disabled = true;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        mostrarMensagem("Login realizado! Redirecionando...", "sucesso");
        setTimeout(() => (window.location.href = "index.html"), 800);
      } else {
        mostrarMensagem(data.error || "E-mail ou senha inválidos.");
        botao.disabled = false;
      }
    } catch (err) {
      console.error(err);
      mostrarMensagem("Não foi possível conectar ao servidor.");
      botao.disabled = false;
    }
  });
}

// --- Registro (registro.html) ---

function initRegistro() {
  const registroForm = document.getElementById("registro-form");
  if (!registroForm) return;

  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparMensagem();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Regra LGPD: consentimento obrigatório antes de enviar qualquer dado
    if (!document.getElementById("consentimento-lgpd").checked) {
      mostrarMensagem(
        "É necessário aceitar a Política de Privacidade para criar a conta.",
      );
      return;
    }

    const botao = registroForm.querySelector("button[type='submit']");
    botao.disabled = true;

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();

      if (response.ok) {
        mostrarMensagem("Conta criada! Redirecionando para o login...", "sucesso");
        setTimeout(() => (window.location.href = "login.html"), 1000);
      } else {
        mostrarMensagem(data.error || "Não foi possível criar a conta.");
        botao.disabled = false;
      }
    } catch (err) {
      console.error(err);
      mostrarMensagem("Não foi possível conectar ao servidor.");
      botao.disabled = false;
    }
  });
}

initFeed();
initAuthLink();
initPublishPage();
initLogin();
initRegistro();
