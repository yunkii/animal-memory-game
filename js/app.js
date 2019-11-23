// ============================================
// List of possible cards
// ============================================


let baseCards = ['beehive', 'koala', 'bird', 'tiger','panda','pelican','penguin','walrus'];

let possibleCards = baseCards.concat(baseCards); // duplicate array items to make pairs



// ============================================
// Global Variables
// ============================================

const numCards = possibleCards.length;
const maxMatch = baseCards.length; // Maximum Pairs
let opened = [];
let numStars = 3;
let numMatch = 0;
let numMoves = 0;

// Timers 

let seconds = 0;
let minutes = 0;
let t;


const showStar = ['<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>',  // 1 star
                  '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li>',  // 2 stars
                  '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>' // 3 stars
                 ];


// ============================================
// Shuffle
// source: http://stackoverflow.com/a/2450976
// ============================================

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// ============================================
// Init the Game
// Clear deck, init variables, shuffle cards and put them back on
// ============================================


function initGame() {
   document.querySelector('.overlay').style.display = 'none';
   document.querySelector('.deck').innerHTML = '';
   shuffle(possibleCards);
   opened = [];
   numStars = 3;
   numMoves = 0;
   numMatch = 0;
   resetTimer();
   runTimer();
   printStars();
   printMoves();


   for(i=0;i<numCards;i++) {
        document.querySelector('.deck').innerHTML += `<li class="card"><img src="img/animal/${possibleCards[i]}.svg"/></li>`;
   };



// ============================================
// Set up event listener
// 1. Click a card,  if it's already shown, quit function
// 2. If it's not shown, show the card, add it to opened array. 
// 3. If there's already an item in the opened array, check if it's match. 
// 4. run match or unmatch function, clear opened array for the next match check.
// 5. Calculate the stars for each move.
// 6. If reach maximum pairs, end the game, show congrats message
// ============================================

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {

    if (card.classList.contains('show')){
      return; // exit function if the card is already opened.
    }

    card.classList.add('show','animated','flipInY');

    let currentCard = card.innerHTML;
    opened.push(currentCard);


    if(opened.length > 1) {
      if(currentCard === opened[0]) {
        match();
      }else {
        unmatch();
      }
    };
    
    starCount(); 
    printMoves();


    if(numMatch === maxMatch ) {
      stopTimer();
      congrats();
    }

    })
  });

};


initGame();
// ============================================
// Match + Unmatch function
// ============================================


function match() {
  numMoves++;
  numMatch++;
  opened = [];

  document.querySelectorAll(".show").forEach((matchedCard) => {
    matchedCard.classList.add('match','animated','flip')
    matchedCard.classList.remove('show')
  });

};



function unmatch() {
  numMoves++;
  opened = [];

  document.querySelectorAll(".show:not(.match)").forEach((unmatchedCard) => {
    unmatchedCard.classList = 'card show unmatch animated shake';
    document.querySelectorAll('.unmatch').forEach((unmatchedCard) => {
      setTimeout(function() {
        unmatchedCard.classList = 'animated flipInY card';
      }, 600);
    })
  });
};




// ============================================
// Calculate Stars by the moves and print it
// ============================================

function starCount() {

  if(numMoves < 16) {
      numStars = 3;
    }else if (numMoves >= 16 && numMoves < 25) {
      numStars = 2;
    }else {
      numStars = 1;
    };

    printStars();
};


// print "stars", "moves", "matches" to the page

function printStars() {
  document.querySelectorAll('.stars').forEach(panel => panel.innerHTML = showStar[numStars-1])
}


function printMoves(){
  document.querySelectorAll('.moves').forEach(move => move.textContent = numMoves)
}


// ============================================
// Timer
// ref: https://jsfiddle.net/Daniel_Hug/pvk6p/
// ============================================


function twoDigits(number) {
       return (number < 10 ? '0' : '') + number;
}


function timer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
  
    updateTimer()
    runTimer();
}


function runTimer() {
  t = setTimeout(timer, 1000);
}

function resetTimer() {
    stopTimer();
    seconds = 0; minutes = 0;
    updateTimer()
}

function updateTimer(){
    document.querySelectorAll(".timer-seconds").forEach(item=> item.textContent = twoDigits(seconds));
    document.querySelectorAll(".timer-minutes").forEach(item=> item.textContent = twoDigits(minutes));
}

function stopTimer() {
  clearTimeout(t);
}


// ============================================
// Restart
// ============================================

document.querySelectorAll('.restart').forEach(item=>
  item.addEventListener("click", function(){
    initGame();
  })
);

// ============================================
// Congrats Message
// ============================================


const finishImg = ['walrus', 'penguin','tiger'];
const finishMsg = ['Oh man... even a walrus can do better','Good job, pal! Well done','Geez, That\'s amazing!'];


function congrats() {
  stopTimer();
  setTimeout(function(){
      // switch messages and images base on number of stars
      document.querySelector('.switch-msg').innerHTML = 
      `
        <h2>${finishMsg[numStars-1]}</h2>
        <img src="img/animal/${finishImg[numStars-1]}.svg" alt="" width="300">
      `
      document.querySelector('.overlay-content').classList.add('animated','bounceIn')
  }, 100);

  setTimeout(function(){
     document.querySelector('.overlay').style.display = 'block'
  }, 300);

};
