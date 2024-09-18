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
  searchRecipes();
}

function displayResults(recipes, totalResults) {
  const resultsContainer = document.getElementById("results");

  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";

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
