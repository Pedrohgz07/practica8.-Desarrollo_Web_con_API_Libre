const API_KEY = "bf29ba6ee5ab47f0ae29c51de11348e5";
const BASE_URL = "https://api.rawg.io/api";
const gamesContainer = document.getElementById("games-container");
const gameDetail = document.getElementById("game-detail");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const pageNumber = document.getElementById("pageNumber");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPage = 1;

async function fetchGames(query = "", page = 1) {
  gamesContainer.innerHTML = "Cargando...";
  gameDetail.classList.add("hidden");

let url = `${BASE_URL}/games?key=${API_KEY}&page_size=12&page=${page}`;

  if (query) {
    url += `&search=${query}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
  gamesContainer.innerHTML = "No se encontraron resultados.";
  return;
}

displayGames(data.results);

 pageNumber.textContent = `Página ${page}`;
 currentPage = page;

}

function displayGames(games) {
  gamesContainer.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <h3>${game.name}</h3>
    `;

    card.addEventListener("click", () => {
      fetchGameDetail(game.id);
    });

    gamesContainer.appendChild(card);
  });
}

async function fetchGameDetail(id) {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  const game = await response.json();

  gamesContainer.innerHTML = "";
  gameDetail.classList.remove("hidden");

  gameDetail.innerHTML = `
    <button onclick="goBack()">⬅ Volver</button>
    <h2>${game.name}</h2>
    <img src="${game.background_image}" class="detail-img">
    <p><strong>Rating:</strong> ${game.rating}</p>
    <p><strong>Lanzamiento:</strong> ${game.released}</p>
    <p><strong>Géneros:</strong> ${game.genres.map(g => g.name).join(", ")}</p>
    <p>${game.description_raw.substring(0, 500)}...</p>
  `;
}

function goBack() {
  fetchGames(searchInput.value, currentPage);
}

searchBtn.addEventListener("click", () => {
  fetchGames(searchInput.value);
});

nextBtn.addEventListener("click", () => {
  fetchGames(searchInput.value, currentPage + 1);
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchGames(searchInput.value, currentPage - 1);
  }
});

fetchGames("", 1);












