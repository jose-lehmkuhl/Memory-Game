/*jshint esversion: 6 */
//variables declaration********
let cardsList = $(".card");
let flippedCards = [];
let numberOfMatches;
let startTime;
let totalTime;
let numTurns;
let intervalID;

const freshStars = $(".rating").children();
const cards = $(".cards-container");

//function declarations*********

//getTime
function time() {
  let x = new Date();
  x = x.getTime();
  return x;
}

//set up Game
function init() {
  $.each(cardsList, (ind, el) => {
    el.remove();
    el.className = "card";
  });
  clearInterval(intervalID);
  cardsList = shuffle(cardsList);
  cards.append(cardsList);
  numberOfMatches = 0;
  numTurns = 0;
  flippedCards = [];
  startTime = time();
  restartScore();
  $(".timer").text(0);
  timer();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//display card
function displaySymbol(el) {
  el.className = "card open";
}

//locks matched cards
function matchedElements(array) {
  $.each(array, (ind, el) => {
    el.className = "card match";
  });
  numberOfMatches += 1;
}

//flips unmatched cards
function unmatchedElements(array) {
  setTimeout(() => {
    $.each(array, (ind, el) => {
      el.className = "card";
    });
  }, 500);
}

//update stars
function updateStars() {
  if ($(".rating").children().length > 1) {
    $(".rating")
      .children()[0]
      .remove();
  }
}

//update the number on the "moves"
function updateCounter() {
  numTurns++;
  $(".turns").text(numTurns);
  if (numTurns % 15 === 0) {
    updateStars();
  }
}

//display message when game finishes***
function endGame() {
  $(".time-taken").text(parseInt(totalTime));
  $(".final-rating").text($(".rating").children().length);
  clearInterval(intervalID);
  $("#winning-modal").modal();
}

//checks if cards match and controls what to do
function openList(el) {
  flippedCards.push(el);
  if (flippedCards.length === 2) {
    updateCounter();
    if (
      flippedCards[0].firstElementChild.getAttribute("class") ===
      flippedCards[1].firstElementChild.getAttribute("class")
    ) {
      matchedElements(flippedCards);
      if (numberOfMatches === 8) {
        endGame();
      }
    } else {
      unmatchedElements(flippedCards);
    }
    flippedCards = [];
  }
}

//restart score
function restartScore() {
  $(".turns").text(numTurns);
  $(".rating")
    .children()
    .remove();
  $(".rating").append(freshStars);
}

//timer function
function timer() {
  intervalID = setInterval(() => {
    totalTime = time();
    totalTime -= startTime;
    totalTime /= 1000;
    $(".timer").text(parseInt(totalTime));
  }, 1000);
}

//event listeners*********

//tracks card clicks
cards.on("click", ".card", function(evt) {
  if (evt.target.getAttribute("class") === "card") {
    displaySymbol(evt.target);
    openList(evt.target);
  }
});

//tracks restart button
$(".fa-sync").on("click", () => {
  init();
});

//tracks modals restart button
$(".btn-secondary").on("click", () => {
  init();
});

//add remove refresh button class for smaller screens
$(window).on("load, resize", function refreshIconClass() {
  const viewportWidth = $(window).width();
  if (viewportWidth < 360) {
    $("section div:last-child").removeClass("col-xs-offset-1");
  } else {
    $("section div:last-child").addClass("col-xs-offset-1");
  }
});

init();
