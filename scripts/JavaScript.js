const tiposIcon = {
  "Bug": "../midia/bug.svg",
  "Dark": "../midia/dark.svg",
  "Dragon": "../midia/dragon.svg",
  "Electric": "../midia/electric.svg",
  "Fairy": "../midia/fairy.svg",
  "Fighting": "../midia/fighting.svg",
  "Fire": "../midia/fire.svg",
  "Ghost": "../midia/ghost.svg",
  "Ice": "../midia/ice.svg",
  "Normal": "../midia/normal.svg",
  "Poison": "../midia/poison.svg",
  "Psychic": "../midia/psychic.svg",
  "Rock": "../midia/rock.svg",
  "Steel": "../midia/steel.svg",
  "Water": "../midia/water.svg",
  "Grass": "../midia/grass.svg",
  "Ground": "../midia/ground.svg",
  "Flying": "../midia/flying.svg"
};

const tiposIconBackground = {
  "Bug": "#92BC2C",
  "Dark": "#595761",
  "Dragon": "#0C69C8",
  "Electric": "#F2D94E",
  "Fairy": "#EE90E6",
  "Fighting": "#D3425F",
  "Fire": "#FBA54C",
  "Ghost": "#5F6DBC",
  "Ice": "#75D0C1",
  "Normal": "#A0A29F",
  "Poison": "#B763CF",
  "Psychic": "#FA8581",
  "Rock": "#C9BB8A",
  "Steel": "#5695A3",
  "Water": "#539DDF",
  "Grass": "#5FBD58",
  "Ground": "#DA7C4D",
  "Flying": "#A1BBEC"
};

let offset = 0;
const limit = 20;

document.addEventListener("DOMContentLoaded", () => {
  const pokemonList = document.getElementById("pokemon-list");

  async function loadPokemon() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPokemon(data.results);
  }

  async function displayPokemon(pokemons) {
    pokemonList.innerHTML = "";

    for (let poke of pokemons) {
      const res = await fetch(poke.url);
      const data = await res.json();

      // Sprite animado (fallback)
      let sprite = data.sprites.versions['generation-v']['black-white'].animated.front_default
        || data.sprites.front_default
        || '';

      // Tipos (ícones)
      const typesHtml = data.types.map(t => {
        const typeName = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
        const typeIcon = tiposIcon[typeName] || 'caminho/padrao.svg';
        const typeClass = `type-${t.type.name.toLowerCase()}`;
        return `<img src="${typeIcon}" alt="${t.type.name}" class="type-icon ${typeClass}">`;
      }).join("");

      // Card de Pokémon
      const li = document.createElement("li");
      li.classList.add("card");

      li.innerHTML = `
            <div class="favorite-btn">
                <i class="bi bi-star" style="font-size: 1.5rem; color: gold; cursor: pointer;"></i>
            </div>
            <div class="type-container">${typesHtml}</div>
            <img src="${sprite}" alt="${data.name}">
            <p><strong>${data.name}</strong></p>
            <p>ID: ${data.id}</p>
        `;


      li.addEventListener("click", () => showDetails(data));
      pokemonList.appendChild(li);
    }
  }

  function showDetails(pokemon) {
    let sprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default
      || pokemon.sprites.front_default
      || '';

    document.getElementById("modalTitle").innerText = pokemon.name;
    document.getElementById("modalImage").src = sprite;
    document.getElementById("modalId").innerText = pokemon.id;
    document.getElementById("modalHeight").innerText = (pokemon.height / 10).toFixed(1);
    document.getElementById("modalWeight").innerText = (pokemon.weight / 10).toFixed(1);

    // Tipos (com classes para CSS)
    const modalTypesHtml = pokemon.types.map(t => {
      const typeName = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
      const typeIcon = tiposIcon[typeName] || 'caminho/padrao.svg';
      const typeClass = `type-${t.type.name.toLowerCase()}`;
      return `<img src="${typeIcon}" alt="${t.type.name}" class="type-icon ${typeClass}">`;
    }).join("");

    document.getElementById("modalTypes").innerHTML = modalTypesHtml;

    const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    modal.show();
  }

  window.nextPage = function() {
    offset += limit;
    loadPokemon();
  };

  window.prevPage = function() {
    if (offset >= limit) {
      offset -= limit;
      loadPokemon();
    }
  };

  // Inicializa
  loadPokemon();
});