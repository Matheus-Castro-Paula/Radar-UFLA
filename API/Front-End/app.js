const API_BASE = "http://localhost:3000/api";
const API_ORIGIN = API_BASE.replace(/\/api$/, ""); // fotos são servidas em <origem>/uploads/...
const API_URL = `${API_BASE}/auth`;

// Limites de upload (RF-08) — a API valida de novo; aqui é só para avisar cedo
const MAX_FOTOS = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

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

// Converte um anúncio da API (GET /api/anuncios) para o formato usado nos cards
function anuncioParaItem(anuncio) {
  // Data em que o item foi achado/perdido (RF-07); anúncios antigos usam a data de criação
  const data = new Date(anuncio.data_ocorrencia || anuncio.criado_em);
  const quando = `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const autor = anuncio.usuario ? `por ${anuncio.usuario.nome}` : "";

  // RN-04: documento nunca mostra foto, mesmo que a API devolva alguma
  const primeiraFoto =
    anuncio.categoria !== "documento" && Array.isArray(anuncio.fotos)
      ? urlDaFoto(anuncio.fotos[0]?.url_imagem)
      : null;

  return {
    feed: anuncio.tipo === "ACHADO" ? "achados" : "perdidos",
    categoria: anuncio.categoria,
    titulo: anuncio.titulo,
    descricao: anuncio.descricao,
    local: anuncio.local_encontro || "",
    imagem: primeiraFoto,
    meta: [anuncio.local_encontro, quando, autor].filter(Boolean).join(" · "),
  };
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
      const rotulo = item.feed === "achados" ? "Achado" : "Perdido";
      // escapeHTML evita XSS: título, descrição e local são digitados por usuários
      card.innerHTML = `
        <div class="card-thumb">
          <span class="card-badge">${rotulo}</span>
          <span class="card-placeholder" aria-hidden="true">${ICONS[item.categoria] || "📦"}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(item.titulo)}</h3>
          <p class="card-desc">${escapeHTML(item.descricao)}</p>
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
