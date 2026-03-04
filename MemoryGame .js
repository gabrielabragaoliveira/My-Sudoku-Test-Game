// URLs das 7 imagens fornecidas
const imageSources = [
    "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9b0a73aaf7f564c43d141f5681598cca298893c3-2048x2048.jpg",
    "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/fec1ae47b7e5f84ac85a7c06cd18499fca375614-2048x2048.jpg",
    "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/90a1e6d64b6791321dd0a9ef1ab08a884de7c930-2048x2048.jpg",
    "https://wiki.leagueoflegends.com/en-us/images/Chibi_Caitlyn_Base_Tier_1.png?7b44d",
    "https://wiki.leagueoflegends.com/en-us/images/Chibi_Blitzcrank_Space_Groove_Tier_1.png?289a9",
    "https://wiki.leagueoflegends.com/en-us/images/Chibi_Ezreal_Base_Tier_1.png?a6a8d",
    "https://wiki.leagueoflegends.com/en-us/images/Chibi_Vi_Arcane_Tier_1.png?43c4c"
];

let cardArray = [];
let cardsFlipped = [];
let lockBoard = false;
let matchesFound = 0;

const gameBoard = document.getElementById('game-board');
const matchesDisplay = document.getElementById('matches');
const resetButton = document.getElementById('reset-button');
const messageDisplay = document.getElementById('message');

document.addEventListener('DOMContentLoaded', startGame);
resetButton.addEventListener('click', startGame);

function shuffle(array) {
    // Algoritmo de Fisher-Yates para embaralhar
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCards() {
    // Cria 7 pares (14 cartas no total)
    cardArray = [...imageSources, ...imageSources]; 
    shuffle(cardArray);

    gameBoard.innerHTML = '';
    
    cardArray.forEach((imageURL, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = index;
        cardElement.dataset.image = imageURL;
        cardElement.addEventListener('click', flipCard);

        cardElement.innerHTML = `
            <div class="card-face">
                <img src="${imageURL}" alt="Chibi">
            </div>
            <div class="card-back">?</div>
        `;
        
        gameBoard.appendChild(cardElement);
    });
}

function startGame() {
    lockBoard = false;
    cardsFlipped = [];
    matchesFound = 0;
    matchesDisplay.textContent = '0';
    messageDisplay.textContent = 'Clique em qualquer carta para começar!';

    createCards();
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flip') || this.classList.contains('matched')) return;

    this.classList.add('flip');
    cardsFlipped.push(this);
    
    if (cardsFlipped.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = cardsFlipped;
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    cardsFlipped.forEach(card => card.classList.add('matched'));
    
    matchesFound++;
    matchesDisplay.textContent = matchesFound;

    resetBoard();
    
    if (matchesFound === 7) {
        messageDisplay.textContent = 'PARABÉNS! VOCÊ ENCONTROU TODOS OS PARES!';
    } else {
        messageDisplay.textContent = 'Par, encontrado! Continue.';
    }
}

function unflipCards() {
    messageDisplay.textContent = 'Ops, tente novamente.';
    
    setTimeout(() => {
        cardsFlipped.forEach(card => card.classList.remove('flip'));
        resetBoard();
    }, 1000); // 1 segundo para o jogador ver as cartas
}

function resetBoard() {
    [cardsFlipped, lockBoard] = [[], false];
}