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

// ... (tiposIconBackground foi removido para simplificar, mas as cores estão no CSS)

let offset = 0;
const limit = 20;
const pokemonModal = document.getElementById("pokemonModal");
const menuLateral = document.getElementById("menuLateral");
const backdrop = document.getElementById("backdrop");


// Funções de controle do Modal (substituem new bootstrap.Modal().show()/hide())
function showModal() {
    pokemonModal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Evita scroll da página principal
}

window.closeModal = function() {
    pokemonModal.classList.remove('is-open');
    document.body.style.overflow = '';
}


// Funções de controle do Menu Lateral (substituem Offcanvas)
function openSidebar() {
    menuLateral.classList.add('is-open');
    backdrop.style.display = 'block';
}

function closeSidebar() {
    menuLateral.classList.remove('is-open');
    backdrop.style.display = 'none';
}


document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById("pokemon-list");

    // Event Listeners para o Menu Lateral
    document.getElementById("menuToggle").addEventListener('click', openSidebar);
    document.getElementById("closeMenu").addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);


    window.BuscarName = async function() {
        // Fechar o menu lateral após a busca (se estiver aberto)
        closeSidebar(); 

        const nameInput = document.getElementById("PokemonName").value || document.getElementById("PokemonNameSmall").value;
        const pokemonName = nameInput.toLowerCase().trim();

        if (!pokemonName) return;

        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
            const res = await fetch(url);
            if (!res.ok) {
                alert(`Pokémon "${nameInput}" não encontrado!`);
                return;
            }
            const data = await res.json();
            showDetails(data);
        } catch (error) {
            alert(`Erro ao buscar Pokémon: ${error.message}`);
        }
    };


    async function loadPokemon() {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Erro ao carregar a lista base de Pokémon.");
            const data = await res.json();
            displayPokemon(data.results);
        } catch (error) {
            console.error("Erro na busca inicial:", error);
            pokemonList.innerHTML = `<p class="text-danger">Não foi possível carregar os Pokémon. Tente novamente.</p>`;
        }
    }

    async function displayPokemon(pokemons) {
        pokemonList.innerHTML = "";
        
        // Paraleliza as requisições de detalhes usando Promise.all()
        const detailPromises = pokemons.map(poke => 
            fetch(poke.url)
            .then(res => res.json())
            .catch(error => {
                console.warn(`Falha ao carregar detalhes de ${poke.name}:`, error);
                return null; // Retorna null em caso de falha para que Promise.all() não pare
            })
        );

        try {
            const detailedPokemons = await Promise.all(detailPromises);
            
            detailedPokemons.forEach(data => {
                if (!data) return; 

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
                        <i class="fa-regular fa-star" style="font-size: 1.5rem; color: gold; cursor: pointer;"></i>
                    </div>
                    <div class="type-container">${typesHtml}</div>
                    <img src="${sprite}" alt="${data.name}">
                    <p><strong>${data.name}</strong></p>
                    <p>ID: ${data.id}</p>
                `;

                li.addEventListener("click", () => showDetails(data));
                pokemonList.appendChild(li);
            });

        } catch (error) {
            console.error("Erro ao processar detalhes dos Pokémon:", error);
            pokemonList.innerHTML = `<p class="text-warning">Não foi possível exibir alguns Pokémon.</p>`;
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

        showModal();
    }

    window.nextPage = function() {
        offset += limit;
        loadPokemon();
        // Rola para o topo da lista após o carregamento
        document.getElementById("PokeList").scrollIntoView({ behavior: 'smooth' });
    };

    window.prevPage = function() {
        if (offset >= limit) {
            offset -= limit;
            loadPokemon();
            // Rola para o topo da lista após o carregamento
            document.getElementById("PokeList").scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Inicializa
    loadPokemon();
});