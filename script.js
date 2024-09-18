const apiKey = "a5e21e64c2ae41bbb56740609a2a2e85";

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
    cuisineSelect.appendChild(option);
  });
}
