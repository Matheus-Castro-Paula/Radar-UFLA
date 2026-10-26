const API_BASE = "http://localhost:3000/api";
const API_URL = `${API_BASE}/auth`;

const ICONS = {
  objeto: "🔑",
  eletronico: "🎧",
  documento: "🪪",
  material: "📓",
  outro: "📦",
};

// Converte um anúncio da API (GET /api/anuncios) para o formato usado nos cards
function anuncioParaItem(anuncio) {
  const data = new Date(anuncio.criado_em);
  const quando = `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const autor = anuncio.usuario ? `por ${anuncio.usuario.nome}` : "";

  return {
    feed: anuncio.tipo === "ACHADO" ? "achados" : "perdidos",
    categoria: anuncio.categoria,
    titulo: anuncio.titulo,
    descricao: anuncio.descricao,
    local: anuncio.local_encontro || "",
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
          ${ICONS[item.categoria] || "📦"}
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(item.titulo)}</h3>
          <p class="card-desc">${escapeHTML(item.descricao)}</p>
          <div class="card-meta">${escapeHTML(item.meta)}</div>
        </div>
      `;
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

function initPublishPage() {
  const form = document.getElementById("publish-form");
  if (!form) return;

  const segmentedOptions = document.querySelectorAll(".segmented-option");
  const categoriaSelect = document.getElementById("categoria");
  const uploadArea = document.getElementById("upload-area");
  const docNote = document.getElementById("doc-note");
  const tituloInput = document.getElementById("titulo");
  const descricaoInput = document.getElementById("descricao");

  segmentedOptions.forEach((option) => {
    option.addEventListener("click", () => {
      segmentedOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });

  function atualizarPorCategoria() {
    const isDocumento = categoriaSelect.value === "documento";
    uploadArea.style.display = isDocumento ? "none" : "flex";
    docNote.hidden = !isDocumento;
  }

  categoriaSelect.addEventListener("change", atualizarPorCategoria);
  atualizarPorCategoria();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparMensagem();
    tituloInput.classList.remove("invalido");
    descricaoInput.classList.remove("invalido");

    const titulo = tituloInput.value.trim();
    const local = form.elements.local.value.trim();
    const horario = form.elements.horario.value.trim();

    if (!titulo) {
      tituloInput.classList.add("invalido");
      mostrarMensagem("Informe um título para o item.");
      return;
    }

    if (!descricaoInput.value.trim()) {
      descricaoInput.classList.add("invalido");
      mostrarMensagem("Descreva o item para ajudar a identificá-lo.");
      return;
    }

    if (!local) {
      mostrarMensagem("Informe o local onde o item foi achado ou perdido.");
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

    // O banco ainda não tem campo de data/hora (RF-07): o horário vai junto da descrição
    let descricao = descricaoInput.value.trim();
    if (horario) descricao += `\n\nHorário: ${horario}`;

    const anuncio = {
      titulo,
      descricao,
      tipo: form.elements.tipo.value === "achados" ? "ACHADO" : "PERDIDO",
      categoria: categoriaSelect.value,
      local_encontro: local,
    };

    const botao = form.querySelector("button[type='submit']");
    botao.disabled = true;

    try {
      const response = await fetch(`${API_BASE}/anuncios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(anuncio),
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

      // 400: regra de negócio da API (ex.: RN-04 / LGPD) — mostra a mensagem que ela devolve
      mostrarMensagem(data.error || "Não foi possível publicar o item.");
      botao.disabled = false;
    } catch (err) {
      console.error(err);
      mostrarMensagem("Não foi possível conectar ao servidor.");
      botao.disabled = false;
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
