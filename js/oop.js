// Variabili
const urlApi = "http://localhost:3000/recipes"
const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('#searchText');
const searchButton = document.querySelector('#search');
const resetButton = document.querySelector('#reset');
const addInputs = document.querySelectorAll('.form input');
const addButton = document.querySelector('#add');
const removeButton = document.querySelector('#remove');
const inputRemove = document.querySelector('.remove input');

// Classe per la creazione delle card
class Ricetta {
    constructor(name, image, difficulty, caloriesPerServing, prepTimeMinutes, cusine, ingredients, instructions) {
        this.name = name;
        this.image = image;
        this.difficulty = difficulty;
        this.caloriesPerServing = caloriesPerServing;
        this.prepTimeMinutes = prepTimeMinutes;
        this.cusine = cusine;
        this.ingredients = ingredients;
        this.instructions = instructions;
    }
    createCard() {
        const card = document.createElement('div');
        card.classList.add('recipes');
        const content = document.createElement('div');
        content.classList.add('content');
        const title = document.createElement('h2');
        title.innerText = this.name;
        const image = document.createElement('img');
        image.src = this.image;
        image.alt = this.name;
        image.style.display = 'block';
        image.style.width = '100%';
        image.style.height = 'auto';
        const difficulty = document.createElement('p');
        difficulty.innerText = `Difficulty: ${this.difficulty}`;
        const kcal = document.createElement('p');
        kcal.innerText = `Kcal: ${this.caloriesPerServing}`;
        const time = document.createElement('p');
        time.innerText = `Preparation time: ${this.prepTimeMinutes} minutes`;
        content.append(image, title, difficulty, kcal, time);
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
                src="${this.image}"
                alt="${this.name}"
              />
    
              <div class="modal-text">
                <h2 class="modal-title">${this.name}</h2>
                <h4 class="modal-title-description">Ingredients:</h4>
                <p class="modal-description">${this.ingredients ?? "No ingredients available"}</p>
                <h4 class="modal-title-description">Instructions:</h4>
                <p class="modal-description">${this.instructions ?? "No instructions available"}</p>
                <button class="btn--close-modal">X</button>
              </div>
            </div>`;
            modal.style.display = 'block';
            const closeButton = document.querySelector('.btn--close-modal');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
        return card;
    }
}

// Classe per la gestione delle ricette
class Manager {
    constructor(urlApi) {
        this.urlApi = urlApi;
    }
    async getAll() {
        const response = await fetch(this.urlApi);
        const data = await response.json();
        return data;
    }
    async getById(id) {
        const response = await fetch(`${this.urlApi}/${id}`);
        const data = await response.json();
        return data;
    }
    async addRecipe(recipe) {
        const response = await fetch(this.urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        });
        const data = await response.json();
        return data;
    }
    async removeRecipe(id) {
        const response = await fetch(`${this.urlApi}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    }
}

const manager = new Manager(urlApi);

// Fetch tutte le ricette 
manager.getAll().then(data => {
    data.forEach(recipe => {
        // Pass ingredients e instructions se esistono
        const card = new Ricetta(
            recipe.name,
            recipe.image,
            recipe.difficulty,
            recipe.caloriesPerServing,
            recipe.prepTimeMinutes,
            recipe.cusine,
            recipe.ingredients,
            recipe.instructions
        );
        recipesContainer.appendChild(card.createCard());
    });
    // Add event listener sul bottone di ricerca
    searchButton.addEventListener('click', () => {
        if (searchInput.value === '') {
            alert('Please enter a valid recipe ID');
            return;
        } else if (searchInput.value > data.length) {
            alert('Recipe ID not found');
            return;
        } else {
            manager.getById(searchInput.value).then(recipe => {
                const card = new Ricetta(
                    recipe.name,
                    recipe.image,
                    recipe.difficulty,
                    recipe.caloriesPerServing,
                    recipe.prepTimeMinutes,
                    recipe.cusine,
                    recipe.ingredients,
                    recipe.instructions
                );
                recipesContainer.innerHTML = '';
                searchInput.value = '';
                recipesContainer.appendChild(card.createCard());
            }).catch(error => console.error(error));
        }
    });
})
    .catch(error => console.error(error));

// Add event listener sul bottone di reset
resetButton.addEventListener('click', () => {
    location.reload();
});

// Add event listener sul bottone di aggiunta
addButton.addEventListener('click', () => {
    let emptyField = false;
    addInputs.forEach(input => {
        if (input.value === '') {
            emptyField = true;
        }
    });
    if (emptyField) {
        alert('Please fill all the fields');
        return;
    }
    // NB: puoi modificare qui per prendere ingredients/instructions da input aggiuntivi nel form, se desideri
    const newRecipe = new Ricetta(
        addInputs[0].value, // name
        '../img/image404.jpg', // image
        addInputs[1].value, // difficulty
        addInputs[2].value, // caloriesPerServing
        addInputs[3].value, // prepTimeMinutes
        addInputs[4].value, // cusine
        addInputs[5].value, // ingredients 
        addInputs[6].value // instructions 
    );
    manager.addRecipe(newRecipe).then(data => {
        location.reload();
    }).catch(error => console.error(error));
});

// Add event listener sul bottone di rimozione
removeButton.addEventListener('click', () => {
    if (inputRemove.value === '') {
        alert('Please enter a valid recipe ID');
        return;
    }
    manager.removeRecipe(inputRemove.value).then(() => {
        location.reload();
    }).catch(error => console.error(error));
});