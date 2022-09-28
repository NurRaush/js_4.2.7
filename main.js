let input = document.querySelector('.page-main__search');
let doneAutocomplete = document.querySelector('.page-main__autocomplete');
let selectedOnes = document.querySelector('.page-main__selected-ones');
const debouncedFn = debounce(searchIt, 600);

input.addEventListener('keyup', (e) => {   
    if (e.target.value) {
        debouncedFn();
    } else {
        if (doneAutocomplete.hasChildNodes()) {
            removeAutocomplete();   
        }
    }
});


function debounce (fn, debounceTime) {
    let timer;
    return function () {
        let fnCall = () => {
            fn.apply(this,arguments);
        }
        clearTimeout(timer);
        timer = setTimeout(fnCall,debounceTime);
    }
};

async function searchIt() {
    return await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
        .then((repos) => {
            removeAutocomplete();
            if (repos.ok) {
                repos.json()
                    .then(rep => {
                         const autocompleteResults = getList(rep.items);
                         createAutocomplete(autocompleteResults); 
                });
            }
        });
}

function getList(repos) {
    let autoCompleteList = [];
    const length = repos.length < 5 ? repos.length : 5;
    for (let i = 0; i < length; i++) {
        autoCompleteList.push(repos[i]);
    }
    return autoCompleteList;
}

function createAutocomplete(list){
    for (let elem of list) {
        let select = document.createElement('li');
        select.innerText = elem.name;
        select.classList.add('autocomplete__item');
        createEventListeners(select, elem);
        doneAutocomplete.append(select);
    }
}

function createEventListeners(item,repository) {
    item.addEventListener('click', (e) => {
        createCard(repository);
        removeAutocomplete();
        input.value = '';
    });
}

function removeAutocomplete() {
    while (doneAutocomplete.firstChild) {
        doneAutocomplete.removeChild(doneAutocomplete.firstChild);
    }
}

function createCard(repository) {
    let card = document.createElement('div');
    card.classList.add('card', 'selected-ones__card');
    
    let describe = document.createElement('div');
    describe.classList.add('card__describe');
    
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('card__delete-button');
    deleteButton.addEventListener('click', () => {
        card.remove();
    })

    let cardName = document.createElement('span');
    cardName.innerText =`Name: ${repository.name}`;
    let cardOwner = document.createElement('span');
    cardOwner.innerText =`Owner: ${repository.owner.login}`;
    let cardStars = document.createElement('span');
    cardStars.innerText =`Stars: ${repository['stargazers_count']}`;
    describe.append(cardName, cardOwner, cardStars);
    card.append(describe, deleteButton);
    selectedOnes.append(card);
}
