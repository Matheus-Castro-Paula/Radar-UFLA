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
      card.innerHTML = `
        <div class="card-thumb">${ICONS[item.categoria] || "📦"}</div>
        <div class="card-body">
          <h3 class="card-title">${item.titulo}</h3>
          <p class="card-desc">${item.descricao}</p>
          <div class="card-meta">${item.meta}</div>
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

// --- Página de publicação (publicar.html) ---

function initPublishPage() {
  const form = document.getElementById("publish-form");
  if (!form) return;

  const segmentedOptions = document.querySelectorAll(".segmented-option");
  const categoriaSelect = document.getElementById("categoria");
  const uploadArea = document.getElementById("upload-area");
  const docNote = document.getElementById("doc-note");

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
    alert(
      "Formulário preenchido corretamente! O envio real será integrado na Sprint 2, quando o back-end estiver pronto.",
    );
  });
}

initFeed();
initPublishPage();
