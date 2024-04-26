function searchByLetter() {
    const letterInput = document.getElementById('letterInput').value.trim().toLowerCase();

    if (!letterInput || letterInput.length !== 1 || !isAlphabetic(letterInput)) {
        alert('Please enter a valid single letter.');
        return;
    }

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letterInput}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayMeals(data.meals);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            displayMeals([]);
        });
}

function isAlphabetic(input) {
    return /^[a-zA-Z]$/.test(input);
}

function displayMeals(meals) {
    const mealList = document.getElementById('mealList');
    mealList.innerHTML = ''; // Clear previous results

    if (!meals || meals.length === 0) {
        mealList.textContent = 'No meals found.';
        return;
    }

    const mealGroups = groupMealsByFirstLetter(meals);
    mealGroups.forEach(group => {
        const groupHeader = document.createElement('h2');
        groupHeader.textContent = `Meals starting with letter ${group.letter.toUpperCase()}`;
        mealList.appendChild(groupHeader);

        group.meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <p>Category: ${meal.strCategory}</p>
                <p>Area: ${meal.strArea}</p>
                <p>Instructions: ${meal.strInstructions}</p>
            `;
            mealList.appendChild(mealItem);
        });
    });
}

function groupMealsByFirstLetter(meals) {
    const groups = {};

    meals.forEach(meal => {
        const firstLetter = meal.strMeal.charAt(0).toLowerCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = { letter: firstLetter, meals: [] };
        }
        groups[firstLetter].meals.push(meal);
    });

    return Object.values(groups);
}

function refreshPage() {
    location.reload();
}