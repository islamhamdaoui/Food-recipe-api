const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

// Event listeners
document.addEventListener('DOMContentLoaded', getDefaultMealList);
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});

// Get default meal list
function getDefaultMealList() {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(response => response.json())
    .then(data => displayMeals(data.meals));
}

// Get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      displayMeals(data.meals);
    });
}

// Display meals in the HTML
function displayMeals(meals) {
  let html = "";
  if (meals) {
    meals.forEach((meal) => {
      html += `
        <div class="meal-item" data-id=${meal.idMeal}>
          <div class="meal-img">
            <img src="${meal.strMealThumb}" alt="food">
          </div>
          <div class="meal-name">
            <h3>${meal.strMeal}</h3>
            <a href="#" class="recipe-btn">Get Recipe</a>
          </div>
        </div>`;
    });
    mealList.classList.remove("notFound");
  } else {
    html = "Sorry, we don't have any meals with this ingredient" +
           `<span><b>Try searching for:</b> 'Chicken, Egg, Tomato, Cheese, etc.'</span>`;
    mealList.classList.add("notFound");
  }
  mealList.innerHTML = html;
}

// Get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => {
        mealRecipeModal(data.meals);
      });
  }
}

// Create a modal for the meal recipe
function mealRecipeModal(meal) {
  let mealItem = meal[0];

  // Ingredients
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = mealItem[`strIngredient${i}`];
    let measure = mealItem[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<span>${ingredient} - ${measure}</span><br>`;
    } else {
      break;
    }
  }

  let html = `
    <h2 class="recipe-title">${mealItem.strMeal}</h2>
    <p class="recipe-category">${mealItem.strCategory}</p>
    <div class="recipe-ingredients">
      <h3>Ingredients:</h3>
      ${ingredients}
    </div>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${mealItem.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
      <img src="${mealItem.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
      <a href="${mealItem.strYoutube}" target="_blank">Watch Video</a>
    </div>`;
  
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}
