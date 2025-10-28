const iconesTipos = {
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

// -------------------- SIDEBAR -----------------------
function abrirMenu() {
    menuLateral.classList.add('aberto');
    fundoEscuro.style.display = 'block';
}

function fecharMenu() {
    menuLateral.classList.remove('aberto');
    fundoEscuro.style.display = 'none';
}

// ------------------ EVENTOS -----------------------
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("botaoMenu").addEventListener('click', abrirMenu);
    document.getElementById("fecharMenu").addEventListener('click', fecharMenu);
    fundoEscuro.addEventListener('click', fecharMenu);

    // BUSCA
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

    // LISTAR POKÉMON
    async function carregarPokemons() {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${posicao}`);
            if (!res.ok) throw new Error("Erro ao carregar Pokémon.");
            const dados = await res.json();
            exibirPokemons(dados.results);
        } catch (erro) {
            console.error(erro);
            listaPokemons.innerHTML = `<p class="text-danger">Não foi possível carregar os Pokémon.</p>`;
        }
    }

    function exibirPokemons(pokemons) {
        listaPokemons.innerHTML = "";
        pokemons.forEach(poke => {
            const li = document.createElement("li");
            li.classList.add("card");

            li.innerHTML = `
                <div class="favorite-btn">
                    <i class="fa-regular fa-star" style="font-size: 1.5rem; color: gold; cursor: pointer;"></i>
                </div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getId(poke.url)}.png" alt="${poke.name}">
                <p><strong>${poke.name}</strong></p>
                <p>ID: ${getId(poke.url)}</p>
            `;

            li.addEventListener("click", async () => {
                try {
                    const res = await fetch(poke.url);
                    if (!res.ok) throw new Error("Erro ao carregar detalhes.");
                    const dados = await res.json();
                    mostrarDetalhes(dados);
                } catch (erro) {
                    console.error(erro);
                    alert("Não foi possível carregar os detalhes do Pokémon.");
                }
            });

            listaPokemons.appendChild(li);
        });
    }

    function getId(url) {
        const partes = url.split("/");
        return partes[partes.length - 2];
    }

    // MODAL
    function mostrarDetalhes(pokemon) {
        const sprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default
            || pokemon.sprites.front_default
            || '';

        document.getElementById("tituloModal").innerText = pokemon.name;
        document.getElementById("imagemModal").src = sprite;
        document.getElementById("idModal").innerText = pokemon.id;
        document.getElementById("alturaModal").innerText = (pokemon.height / 10).toFixed(1);
        document.getElementById("pesoModal").innerText = (pokemon.weight / 10).toFixed(1);

        const tiposHtml = pokemon.types.map(t => {
            const nomeTipo = t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
            const icone = iconesTipos[nomeTipo] || 'caminho/padrao.svg';
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
