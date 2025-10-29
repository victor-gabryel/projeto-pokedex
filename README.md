# Documentação do Projeto Pokédex

## Visão Geral

Este projeto é uma **Pokédex interativa** desenvolvida em **HTML, CSS e JavaScript**, que consome dados da **PokéAPI** para exibir informações detalhadas sobre Pokémon.
O sistema inclui:

* Listagem paginada de Pokémon;
* Busca individual por nome;
* Modal com detalhes do Pokémon;
* Sistema de **favoritos** armazenados no `localStorage`, com opção de remover diretamente na lista de favoritos;
* Interface responsiva e intuitiva.

---

## 🖥️ index.html

### Função

É a **página principal** do projeto.
Mostra a lista de Pokémon obtidos da API, os botões de paginação e a barra de busca.
Inclui também o **menu lateral** e o **modal de detalhes**.

### Estrutura Principal

* **Header** → contém o nome da Pokédex e o botão de menu.
* **Menu Lateral** → acessado pelo botão, permite buscar Pokémon e acessar a página de favoritos.
* **Lista de Pokémon** → área central onde os cards são carregados dinamicamente via JavaScript.
* **Paginação** → botões “Anterior” e “Próxima” controlam a exibição dos 20 Pokémon por página.
* **Modal** → janela exibida ao clicar em um Pokémon, com detalhes como tipo, peso, altura e imagem.

### Conexões

* Importa `style.css` para estilização.
* Importa `JavaScript.js` para funcionalidades dinâmicas.
* Usa ícones da biblioteca **Font Awesome** para estrelas e botões.

---

## favoritos.html

### Função

Exibe apenas os Pokémon que o usuário marcou como **favoritos**, armazenados no `localStorage`.

### Estrutura

* Layout semelhante ao `index.html`, mas **sem paginação**.
* Ao carregar, lê os dados do `localStorage` e mostra apenas os Pokémon salvos.
* Cada card tem uma **estrela clicável**, que permite **remover o Pokémon da lista de favoritos** instantaneamente.
* A lista é atualizada automaticamente ao remover um favorito.

### Conexões

* Compartilha lógica de favoritos com o `JavaScript.js`.
* Usa as mesmas classes CSS para manter a aparência idêntica à página principal.

---

## scripts/JavaScript.js

### Função

Gerencia **toda a lógica do projeto**, incluindo o carregamento dos Pokémon, o modal, a busca e o controle de favoritos.

### Principais Seções

#### 1. **Dicionário de Ícones**

```js
const iconesTipos = { "bug": "midia/bug.svg", ... }
```

Mapeia cada tipo de Pokémon ao seu respectivo ícone SVG para exibição no modal.

#### 2. **Controle de Paginação**

```js
let posicao = 0;
const limite = 20;
```

Define quantos Pokémon serão exibidos por página e a posição atual na lista.

#### 3. **Referências ao DOM**

```js
const modalPokemon = document.getElementById("modalPokemon");
const menuLateral = document.getElementById("menuLateral");
const fundoEscuro = document.getElementById("fundoEscuro");
const listaPokemons = document.getElementById("lista-pokemon");
```

Captura os elementos HTML que serão manipulados dinamicamente.

#### 4. **Modal**

* `abrirModal()` → exibe o modal e bloqueia o scroll.
* `fecharModal()` → fecha o modal e libera o scroll novamente.

#### 5. **Menu Lateral**

* `abrirMenu()` / `fecharMenu()` → mostram ou escondem o menu lateral e o fundo escurecido.

#### 6. **Favoritos**

Funções responsáveis por gerenciar os Pokémon marcados como favoritos:

* `obterFavoritos()` → lê os dados salvos no localStorage.
* `salvarFavoritos(lista)` → atualiza os dados no localStorage.
* `alternarFavorito(id, nome)` → adiciona ou remove um Pokémon.
* `ehFavorito(id)` → verifica se um Pokémon já está salvo.
* `renderizarEstrelas()` → atualiza as estrelas na tela (cheia ou vazia).

No `favoritos.html`, o card do favorito também inclui:

* `removerFavorito(id)` → remove o Pokémon da lista de favoritos.
* `renderizarFavoritos()` → atualiza dinamicamente a lista exibida.

#### 7. **Busca de Pokémon**

```js
window.buscarPokemon = async function() {...}
```

Busca um Pokémon específico pelo nome digitado e exibe suas informações no modal.

#### 8. **Listagem Padrão**

```js
async function carregarPokemons() {...}
```

Carrega 20 Pokémon por vez a partir da PokéAPI e cria os cards na tela.

#### 9. **Renderização dos Cards**

```js
function exibirPokemons(pokemons) {...}
```

Cria dinamicamente os elementos `<li>` com imagem, nome, ID e estrela de favorito.

#### 10. **Detalhes do Pokémon**

```js
function mostrarDetalhes(pokemon) {...}
```

Exibe o modal com as informações completas (imagem, altura, peso e tipos).

#### 11. **Paginação**

* `window.proximaPagina()` → avança 20 Pokémon.
* `window.paginaAnterior()` → retrocede 20 Pokémon.

#### 12. **Inicialização**

```js
document.addEventListener("DOMContentLoaded", () => {...});
```

Garante que todos os elementos HTML estejam carregados antes da execução dos scripts.

---

## estilos/style.css

### Função

Define toda a aparência do site, mantendo o design limpo e responsivo.

### Principais Áreas

* **Reset e Variáveis** → cores, fontes e espaçamento padrão.
* **Layout Geral** → centraliza conteúdo e estiliza fundo e cabeçalho.
* **Cards de Pokémon** → tamanho, sombra, transições e grid.
* **Modal** → estilo da janela de detalhes com fundo escuro e bordas arredondadas.
* **Menu Lateral** → posição, animação e cores do menu hambúrguer.
* **Responsividade** → ajusta a interface para celulares e tablets.

---

## Fluxo de Funcionamento

1. O JavaScript chama `carregarPokemons()` ao carregar a página.
2. São exibidos os 20 primeiros Pokémon.
3. O usuário pode buscar, navegar, favoritar, abrir detalhes ou remover favoritos.
4. Favoritos são salvos no navegador (localStorage).
5. `favoritos.html` exibe apenas os Pokémon salvos e permite removê-los.

---

## Tecnologias Utilizadas

* **HTML5** → estrutura do site
* **CSS3** → estilização e responsividade
* **JavaScript (ES6+)** → interatividade e manipulação do DOM
* **PokéAPI** → fonte dos dados de Pokémon
* **Font Awesome** → ícones (estrela, menu, etc.)

---

## Armazenamento Local

Os favoritos são salvos usando o **Local Storage** do navegador:

```json
[
  { "id": 1, "nome": "Bulbasaur" },
  { "id": 25, "nome": "Pikachu" }
]
```

---

## Responsividade

* O layout se adapta automaticamente a celulares e tablets.
* O menu lateral abre sobre o conteúdo.
* Campos e botões se reorganizam para telas menores.

---

## 👨‍💻 Autor

**Desenvolvido por:** Victor Gabryel da Silva e Rafael Reis Borges da Silva
**Linguagens:** HTML, CSS, JavaScript
**API:** [PokéAPI](https://pokeapi.co)
**Ano:** 2025