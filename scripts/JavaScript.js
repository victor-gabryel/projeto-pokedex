// =================== DICIONÁRIO DE ÍCONES ===================
// Cada tipo de Pokémon tem seu respectivo ícone SVG armazenado em "midia/"
const iconesTipos = {
  "Bug": "midia/bug.svg",
  "Dark": "midia/dark.svg",
  "Dragon": "midia/dragon.svg",
  "Electric": "midia/electric.svg",
  "Fairy": "midia/fairy.svg",
  "Fighting": "midia/fighting.svg",
  "Fire": "midia/fire.svg",
  "Ghost": "midia/ghost.svg",
  "Ice": "midia/ice.svg",
  "Normal": "midia/normal.svg",
  "Poison": "midia/poison.svg",
  "Psychic": "midia/psychic.svg",
  "Rock": "midia/rock.svg",
  "Steel": "midia/steel.svg",
  "Water": "midia/water.svg",
  "Grass": "midia/grass.svg",
  "Ground": "midia/ground.svg",
  "Flying": "midia/flying.svg"
};

// Controle da paginação
let posicao = 0; // posição atual (offset)
const limite = 20; // quantidade máxima de cards por página

// Principais elementos do DOM
const modalPokemon = document.getElementById("modalPokemon");
const menuLateral = document.getElementById("menuLateral");
const fundoEscuro = document.getElementById("fundoEscuro");
const listaPokemons = document.getElementById("lista-pokemon");

// =================== MODAL ===================
// Abre o modal e bloqueia o scroll do body
function abrirModal() {
  modalPokemon.classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

// Fecha o modal e libera o scroll novamente
window.fecharModal = function() {
  modalPokemon.classList.remove('aberto');
  document.body.style.overflow = '';
}

// =================== MENU LATERAL ===================
function abrirMenu() {
  menuLateral.classList.add('aberto');
  fundoEscuro.style.display = 'block'; // mostra o fundo escuro atrás do menu
}

function fecharMenu() {
  menuLateral.classList.remove('aberto');
  fundoEscuro.style.display = 'none';
}

// =================== FAVORITOS ===================
// Retorna a lista de favoritos armazenada no localStorage
function obterFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

// Salva a lista atualizada de favoritos
function salvarFavoritos(lista) {
  localStorage.setItem("favoritos", JSON.stringify(lista));
}

// Adiciona ou remove um Pokémon dos favoritos
function alternarFavorito(id, nome) {
  let favoritos = obterFavoritos();
  const existe = favoritos.find(p => p.id === id);

  // Se já estiver nos favoritos, remove
  if (existe) {
    favoritos = favoritos.filter(p => p.id !== id);
  } 
  // Se não estiver, adiciona
  else {
    favoritos.push({ id, nome });
  }

  salvarFavoritos(favoritos);
  renderizarEstrelas(); // atualiza as estrelas nos cards
}

// Verifica se um Pokémon é favorito
function ehFavorito(id) {
  return obterFavoritos().some(p => p.id === id);
}

// Atualiza a aparência das estrelas nos cards (cheia/vazia)
function renderizarEstrelas() {
  document.querySelectorAll(".favorite-btn i").forEach(estrela => {
    const id = parseInt(estrela.dataset.id);
    estrela.className = ehFavorito(id)
      ? "fa-solid fa-star"
      : "fa-regular fa-star";
  });
}

// =================== EVENTOS ===================
document.addEventListener("DOMContentLoaded", () => {
  // Eventos de abrir e fechar o menu lateral
  document.getElementById("botaoMenu").addEventListener('click', abrirMenu);
  document.getElementById("fecharMenu").addEventListener('click', fecharMenu);
  fundoEscuro.addEventListener('click', fecharMenu);

  // =================== BUSCA DE POKÉMON ===================
  window.buscarPokemon = async function() {
    fecharMenu(); // fecha o menu após a busca (em telas menores)

    // Captura o valor do campo de busca (desktop ou mobile)
    const input = document.getElementById("nomePokemon").value || 
                  document.getElementById("nomePokemonMobile").value;
    const nome = input.toLowerCase().trim();
    if (!nome) return; // se o campo estiver vazio, não faz nada

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!res.ok) return alert(`Pokémon "${input}" não encontrado!`);

      const dados = await res.json();
      mostrarDetalhes(dados); // abre o modal com detalhes do Pokémon
    } catch (erro) {
      alert(`Erro ao buscar Pokémon: ${erro.message}`);
    }
  };

  // =================== LISTAGEM DE POKÉMONS ===================
  async function carregarPokemons() {
    try {
      // Busca lista de Pokémons da API com base na página atual
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${posicao}`);
      const dados = await res.json();
      exibirPokemons(dados.results);
    } catch (erro) {
      listaPokemons.innerHTML = `<p>Erro ao carregar os Pokémon.</p>`;
    }
  }

  // Exibe os cards de Pokémon na tela
  function exibirPokemons(pokemons) {
    listaPokemons.innerHTML = ""; // limpa a lista antes de renderizar

    pokemons.forEach(poke => {
      const id = getId(poke.url);
      const nomeFormatado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);

      // Cria o card
      const li = document.createElement("li");
      li.classList.add("card");
      li.innerHTML = `
        <div class="favorite-btn">
          <i class="${ehFavorito(parseInt(id)) ? "fa-solid" : "fa-regular"} fa-star" 
             data-id="${id}" 
             style="font-size: 1.5rem; color: gold; cursor: pointer;"></i>
        </div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${poke.name}">
        <p><strong>${nomeFormatado}</strong></p>
        <p>ID: ${id}</p>
      `;

      // Clique no card abre o modal (menos na estrela)
      li.addEventListener("click", async (e) => {
        if (e.target.classList.contains("fa-star")) return; // ignora clique na estrela
        const res = await fetch(poke.url);
        const dados = await res.json();
        mostrarDetalhes(dados);
      });

      // Clique na estrela adiciona/remove dos favoritos
      li.querySelector(".fa-star").addEventListener("click", (e) => {
        e.stopPropagation(); // impede que o clique abra o modal
        alternarFavorito(parseInt(id), nomeFormatado);
      });

      listaPokemons.appendChild(li);
    });
  }

  // Extrai o ID do Pokémon a partir da URL da API
  function getId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
  }

  // Mostra as informações detalhadas do Pokémon no modal
  function mostrarDetalhes(pokemon) {
    // Usa sprite animado se existir, senão o sprite padrão
    const sprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default
      || pokemon.sprites.front_default
      || "midia/pokeball.svg";

    // Preenche os elementos do modal
    document.getElementById("tituloModal").innerText = pokemon.name;
    document.getElementById("imagemModal").src = sprite;
    document.getElementById("idModal").innerText = pokemon.id;
    document.getElementById("alturaModal").innerText = (pokemon.height / 10).toFixed(1);
    document.getElementById("pesoModal").innerText = (pokemon.weight / 10).toFixed(1);

    // Monta os ícones dos tipos (ex: Fire, Water etc.)
    const tiposHtml = pokemon.types.map(t => {
      const nomeTipo = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
      const icone = iconesTipos[nomeTipo] || 'midia/pokeball.svg';
      const classeTipo = `type-${t.type.name.toLowerCase()}`;
      return `<img src="${icone}" alt="${t.type.name}" class="type-icon ${classeTipo}">`;
    }).join("");

    document.getElementById("tiposModal").innerHTML = tiposHtml;
    abrirModal(); // exibe o modal
  }

  // =================== PAGINAÇÃO ===================
  // Próxima página
  window.proximaPagina = function() {
    posicao += limite;
    carregarPokemons();
    document.getElementById("listaPokemons").scrollIntoView({ behavior: 'smooth' });
  };

  // Página anterior
  window.paginaAnterior = function() {
    if (posicao >= limite) {
      posicao -= limite;
      carregarPokemons();
      document.getElementById("listaPokemons").scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Carrega os primeiros 20 Pokémon ao iniciar
  carregarPokemons();
});