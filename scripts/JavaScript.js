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

let posicao = 0;
const limite = 20;

const modalPokemon = document.getElementById("modalPokemon");
const menuLateral = document.getElementById("menuLateral");
const fundoEscuro = document.getElementById("fundoEscuro");
const listaPokemons = document.getElementById("lista-pokemon");

// ----------------------- MODAL -----------------------
function abrirModal() {
  modalPokemon.classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

window.fecharModal = function() {
  modalPokemon.classList.remove('aberto');
  document.body.style.overflow = '';
}

// -------------------- MENU LATERAL --------------------
function abrirMenu() {
  menuLateral.classList.add('aberto');
  fundoEscuro.style.display = 'block';
}
function fecharMenu() {
  menuLateral.classList.remove('aberto');
  fundoEscuro.style.display = 'none';
}

// ------------------ FAVORITOS -----------------------
function obterFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(lista) {
  localStorage.setItem("favoritos", JSON.stringify(lista));
}

function alternarFavorito(id, nome) {
  let favoritos = obterFavoritos();
  const existe = favoritos.find(p => p.id === id);

  if (existe) {
    favoritos = favoritos.filter(p => p.id !== id);
  } else {
    favoritos.push({ id, nome });
  }
  salvarFavoritos(favoritos);
  renderizarEstrelas();
}

function ehFavorito(id) {
  return obterFavoritos().some(p => p.id === id);
}

function renderizarEstrelas() {
  document.querySelectorAll(".favorite-btn i").forEach(estrela => {
    const id = parseInt(estrela.dataset.id);
    estrela.className = ehFavorito(id)
      ? "fa-solid fa-star"
      : "fa-regular fa-star";
  });
}

// ------------------ EVENTOS -----------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botaoMenu").addEventListener('click', abrirMenu);
  document.getElementById("fecharMenu").addEventListener('click', fecharMenu);
  fundoEscuro.addEventListener('click', fecharMenu);

  // BUSCAR POKÉMON
  window.buscarPokemon = async function() {
    fecharMenu(); 
    const input = document.getElementById("nomePokemon").value || document.getElementById("nomePokemonMobile").value;
    const nome = input.toLowerCase().trim();
    if (!nome) return;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!res.ok) return alert(`Pokémon "${input}" não encontrado!`);
      const dados = await res.json();
      mostrarDetalhes(dados);
    } catch (erro) {
      alert(`Erro ao buscar Pokémon: ${erro.message}`);
    }
  };

  // LISTAR POKÉMONS
  async function carregarPokemons() {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${posicao}`);
      const dados = await res.json();
      exibirPokemons(dados.results);
    } catch (erro) {
      listaPokemons.innerHTML = `<p>Erro ao carregar os Pokémon.</p>`;
    }
  }

  function exibirPokemons(pokemons) {
    listaPokemons.innerHTML = "";
    pokemons.forEach(poke => {
      const id = getId(poke.url);
      const nomeFormatado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);

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

      // Clique para abrir modal
      li.addEventListener("click", async (e) => {
        if (e.target.classList.contains("fa-star")) return;
        const res = await fetch(poke.url);
        const dados = await res.json();
        mostrarDetalhes(dados);
      });

      // Clique na estrela
      li.querySelector(".fa-star").addEventListener("click", (e) => {
        e.stopPropagation();
        alternarFavorito(parseInt(id), nomeFormatado);
      });

      listaPokemons.appendChild(li);
    });
  }

  function getId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
  }

  function mostrarDetalhes(pokemon) {
    const sprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default
      || pokemon.sprites.front_default
      || "midia/pokeball.svg";

    document.getElementById("tituloModal").innerText = pokemon.name;
    document.getElementById("imagemModal").src = sprite;
    document.getElementById("idModal").innerText = pokemon.id;
    document.getElementById("alturaModal").innerText = (pokemon.height / 10).toFixed(1);
    document.getElementById("pesoModal").innerText = (pokemon.weight / 10).toFixed(1);

    const tiposHtml = pokemon.types.map(t => {
      const nomeTipo = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
      const icone = iconesTipos[nomeTipo] || 'midia/pokeball.svg';
      const classeTipo = `type-${t.type.name.toLowerCase()}`;
      return `<img src="${icone}" alt="${t.type.name}" class="type-icon ${classeTipo}">`;
    }).join("");

    document.getElementById("tiposModal").innerHTML = tiposHtml;
    abrirModal();
  }

  // PAGINAÇÃO
  window.proximaPagina = function() {
    posicao += limite;
    carregarPokemons();
    document.getElementById("listaPokemons").scrollIntoView({ behavior: 'smooth' });
  };

  window.paginaAnterior = function() {
    if (posicao >= limite) {
      posicao -= limite;
      carregarPokemons();
      document.getElementById("listaPokemons").scrollIntoView({ behavior: 'smooth' });
    }
  };

  carregarPokemons();
});