const jsonServer = 'http://localhost:3000/recipes';
const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('#searchText');
const searchButton = document.querySelector('#search');
const resetButton = document.querySelector('#reset');
const form = document.querySelector('.form');
const formInputs = document.querySelectorAll('.form input');
const addButton = document.querySelector('#add');
const removeButton = document.querySelector('#remove');
const inputRemove = document.querySelector('.remove input');


function fetchData(url, options = {}) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            // Se non è una DELETE, ritorno JSON, altrimenti solo la risposta
            return options.method === 'DELETE' ? response : response.json();
        });
}

// Carica tutte le ricette
fetchData(jsonServer)
    .then(data => {
        data.forEach(recipe => {
            console.log(recipe);
            creaCard(recipe);
        });
    })
    .catch(error => console.error('Error:', error));

// Event listener
searchButton.addEventListener('click', searchRecipe);
resetButton.addEventListener('click', () => location.reload());

addButton.addEventListener('click', () => {
    let emptyFound = false;
    formInputs.forEach(input => {
        if (input.value === '') {
            emptyFound = true;
        }
    });
    if (emptyFound) {
        alert('Please fill all the fields');
        return;
    }
    const newRecipe = {
        image: '../img/image404.jpg',
        name: formInputs[0].value,
        difficulty: formInputs[1].value,
        caloriesPerServing: formInputs[2].value,
        prepTimeMinutes: formInputs[3].value,
        cusine: formInputs[4].value,
        ingredients: formInputs[5].value,
        instructions: formInputs[6].value
    };
    fetchData(jsonServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecipe)
    })
    .then(() => location.reload())
    .catch(error => console.error('Error:', error));
});

removeButton.addEventListener('click', () => {
    if (inputRemove.value === '') {
        alert('Please enter a valid recipe ID');
        return;
    }
    fetchData(jsonServer)
        .then(data => {
            const recipeToDelete = data.find(recipe => recipe.id === inputRemove.value);
            if (!recipeToDelete) {
                alert('Recipe ID not found');
                return;
            }
            fetchData(`${jsonServer}/${recipeToDelete.id}`, { method: 'DELETE' })
                .then(() => location.reload())
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
});

function creaCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('recipe');
    recipesContainer.appendChild(card);
    const content = document.createElement('div');
    content.classList.add('content');
    card.appendChild(content);
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.name;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    const title = document.createElement('h2');
    title.innerText = recipe.name;
    const difficulty = document.createElement('p');
    difficulty.innerText = `Difficulty: ${recipe.difficulty}`;
    const kcal = document.createElement('p');
    kcal.innerText = `Kcal: ${recipe.caloriesPerServing}`;
    const time = document.createElement('p');
    time.innerText = `Preparation time: ${recipe.prepTimeMinutes} minutes`;
    content.append(img, title, difficulty, kcal, time);
    const button = document.createElement('button');
    button.classList.add('btn', 'button--product');
    button.innerText = 'Details...';
    card.append(content, button);
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.querySelector('.modal');
        const modalInner = document.querySelector('.modal-inner');
        modalInner.innerHTML = `<div class="modal-content">
          <img
            class="modal-image"
            src="${recipe.image}"
            alt="${recipe.name}"
          />

          <div class="modal-text">
            <h2 class="modal-title">${recipe.name}</h2>
            <h4 class="modal-title-description">Ingredients:</h4>
            <p class="modal-description">${recipe.ingredients}</p>
            <h4 class="modal-title-description">Instructions:</h4>
            <p class="modal-description">${recipe.instructions}</p>
            <button class="btn--close-modal">X</button>
          </div>
        </div>`;
        modal.style.display = 'block';
        const closeButton = document.querySelector('.btn--close-modal');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });
}

function searchRecipe() {
    const inputValue = searchInput.value;
    if (isNaN(inputValue) || inputValue.trim() === '') {
        alert('Please enter a valid number');
        return;
    }
    fetchData(jsonServer)
        .then(data => {
            if (parseInt(inputValue) > data.length) {
                alert('Please enter a number between 1 and ' + data.length);
                return;
            }
            recipesContainer.innerHTML = '';
            data.forEach(recipe => {
                if (recipe.id === inputValue) {
                    creaCard(recipe);
                    searchInput.value = '';
                }
            });
        })
        .catch(error => console.error('Error:', error));
}