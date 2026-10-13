const API_URL = "http://localhost:3000/api/auth";

const ICONS = {
  objeto: "🔑",
  eletronico: "🎧",
  documento: "🪪",
  material: "📓",
  outro: "📦",
};

const ITEMS = [
  {
    feed: "achados",
    categoria: "objeto",
    titulo: "Molho de chaves com chaveiro do Corinthians",
    descricao:
      "Encontrado caído perto da escada do Bloco 3. Tem uma pulseirinha de identificação junto.",
    local: "Bloco 3",
    meta: "Bloco 3 · hoje, 14h30 · deixado na portaria",
  },
  {
    feed: "achados",
    categoria: "eletronico",
    titulo: "Fone de ouvido azul, sem fio",
    descricao:
      "Estava em cima de uma mesa na ala de estudos silenciosos da Biblioteca Central.",
    local: "Biblioteca Central",
    meta: "Biblioteca Central · hoje, 09h15 · com o bibliotecário",
  },
  {
    feed: "achados",
    categoria: "objeto",
    titulo: "Carteira de couro marrom",
    descricao:
      "Encontrada no chão perto do caixa do RU. Tem cartões dentro, sem dinheiro visível.",
    local: "RU",
    meta: "RU · ontem, 12h00 · com a coordenação do RU",
  },
  {
    feed: "achados",
    categoria: "objeto",
    titulo: "Óculos de grau, armação preta",
    descricao: "Deixado numa sala do bloco de Humanas depois da aula das 19h.",
    local: "Bloco de Humanas",
    meta: "Bloco de Humanas, sala 14 · ontem, 19h50 · retirar na portaria",
  },
  {
    feed: "perdidos",
    categoria: "eletronico",
    titulo: "Mochila preta com notebook dentro",
    descricao:
      "Perdida ontem à tarde, saindo do RU em direção ao estacionamento.",
    local: "RU",
    meta: "RU · ontem, por volta das 13h",
  },
  {
    feed: "perdidos",
    categoria: "objeto",
    titulo: "Chaveiro com fita do curso de Sistemas de Informação",
    descricao:
      "Perdido essa semana, provavelmente no estacionamento perto do bloco de exatas.",
    local: "Estacionamento",
    meta: "Estacionamento, bloco de exatas · essa semana",
  },
  {
    feed: "perdidos",
    categoria: "documento",
    titulo: "Carteirinha estudantil",
    descricao:
      "Perdida hoje de manhã. Documento — sem foto publicada, apenas esta descrição.",
    local: "Não informado",
    meta: "Local não informado · hoje de manhã",
  },
];

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

  let activeFeed = "achados";

  function categoriasAtivas() {
    return Array.from(categoriaChecks)
      .filter((c) => c.checked)
      .map((c) => c.value);
  }

  function render() {
    const termo = (searchInput.value || "").toLowerCase();
    const local = (localInput.value || "").toLowerCase();
    const categorias = categoriasAtivas();

    const filtrados = ITEMS.filter((item) => {
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
      // escapeHTML evita XSS quando os dados passarem a vir da API
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

    document.getElementById("count-achados").textContent = ITEMS.filter(
      (i) => i.feed === "achados",
    ).length;
    document.getElementById("count-perdidos").textContent = ITEMS.filter(
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

  render();
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    limparMensagem();
    tituloInput.classList.remove("invalido");
    descricaoInput.classList.remove("invalido");

    if (!tituloInput.value.trim()) {
      tituloInput.classList.add("invalido");
      mostrarMensagem("Informe um título para o item.");
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

    mostrarMensagem(
      "Formulário válido! O envio real para a API será integrado em uma sprint futura.",
      "sucesso",
    );
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
