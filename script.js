const apiKey = "8e59cb0304f748f28b2ae4ede7694c43";

const cuisines = [
  "African",
  "Asian",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
];

function populateCuisineSelect() {
  const cuisineSelect = document.getElementById("cuisineSelect");
  if (!cuisineSelect) return;

  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.value = cuisine.toLowerCase().replace(/\s+/g, "");
    option.textContent = cuisine;
    cuisineSelect.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  const cuisineSelect = document.getElementById("cuisineSelect");
  const resetButton = document.getElementById("resetButton");

  populateCuisineSelect();

  if (searchButton && searchInput && cuisineSelect) {
    searchButton.addEventListener("click", searchRecipes);

    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        searchRecipes();
      }
    });

    cuisineSelect.addEventListener("change", searchRecipes);

    resetButton.addEventListener("click", resetFilters);
  }
});

async function searchRecipes() {
  const searchInput = document.getElementById("searchInput");
  const cuisineSelect = document.getElementById("cuisineSelect");
  const pageElement = document.getElementById("paginationPage");
  const query = searchInput ? searchInput.value : "";
  const cuisine = cuisineSelect ? cuisineSelect.value : "";
  const page = pageElement ? parseInt(pageElement.textContent) || 1 : 1;
  const number = 5;
  const offset = (page - 1) * number;

  const queryParams = new URLSearchParams({
    query: encodeURIComponent(query),
    number: number,
    offset: offset,
    apiKey: apiKey,
  });

  if (cuisine) {
    queryParams.append("cuisine", cuisine);
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayResults(data.results, data.totalResults);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("cuisineSelect").value = "";
  document.getElementById("paginationPage").textContent = 1;
  searchRecipes();
}

function displayResults(recipes, totalResults) {
  const resultsContainer = document.getElementById("results");
  const paginationContainer = document.getElementById("pagination");

  if (!resultsContainer || !paginationContainer) return;

  resultsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  if (totalResults === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "card recipe-card";
    card.innerHTML = `
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
              <h5 class="card-title">${recipe.title}</h5>
              <a href="recipe.html?id=${recipe.id}" class="btn btn-primary">View Details</a>
          </div>
      `;
    resultsContainer.appendChild(card);
  });

  setupPagination(totalResults);
}

function setupPagination(totalResults) {
  const paginationContainer = document.getElementById("pagination");
  const pageElement = document.getElementById("paginationPage");
  if (!paginationContainer || !pageElement) {
    console.log("Pagination container or page element missing.");
    return;
  }

  const number = 5;
  const totalPages = Math.ceil(totalResults / number);
  const currentPage = parseInt(pageElement.textContent) || 1;

  paginationContainer.innerHTML = "";

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "btn btn-secondary me-2";
    prevButton.addEventListener("click", () => {
      pageElement.textContent = currentPage - 1;
      searchRecipes();
    });
    paginationContainer.appendChild(prevButton);
  }

  const range = 5;
  let startPage = Math.max(1, currentPage - Math.floor(range / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(range / 2));

  if (endPage - startPage + 1 < range) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + range - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - range + 1);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = "btn btn-outline-secondary mx-1";
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      pageElement.textContent = i;
      searchRecipes();
    });
    paginationContainer.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "btn btn-secondary ms-2";
    nextButton.addEventListener("click", () => {
      pageElement.textContent = currentPage + 1;
      searchRecipes();
    });
    paginationContainer.appendChild(nextButton);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (recipeId) {
    const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    try {
      const response = await fetch(recipeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      displayRecipeDetail(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  }
});
