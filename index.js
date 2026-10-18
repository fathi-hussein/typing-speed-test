
import {data} from './data.js';
const bestScore = document.getElementById("best-score");
const wcount = document.getElementById("wcount");
const accuracy = document.getElementById("accuracy");
const time = document.getElementById("time");
const easy = document.getElementById('easy');
const medium = document.getElementById('medium');
const hard = document.getElementById('hard');
const timed = document.getElementById("timed");
const untimed = document.getElementById("untimed");
const startButton = document.getElementById('start-btn');
const displayedText = document.getElementById('displayed-txt');
const finalWcount = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const characters = document.getElementById('final-chars');
const restart = document.getElementById('restart');
const startOverlay = document.getElementById('start');
const userInput = document.getElementById('user-input');
const resultsSection = document.querySelector('.results-section');
const custom = document.getElementById('custom');

bestScore.textContent = localStorage.getItem('bestScore') || 0;


let inputText = '';
// Calculate and display the word count based on the number of words typed  
const words = inputText.trim().split(/\s+/); // Split the input text into words using whitespace as the delimiter
let wordCount = inputText.trim() === '' ? 0 : words.length;// Count the number of words typed
wcount.textContent = wordCount;// Update the word count display
let correctChars = 0;
let selectedDifficulty = 'easy';

//listen for the userclick to drop the blur curtain
startOverlay.addEventListener('click',()=>{
  startOverlay.classList.remove('start-over');
  startOverlay.classList.add('hidden')
  getRandomText(selectedDifficulty);
  startActiveTimer();
  userInput.focus();
  
})


// 1. Create a helper function to handle difficulty changes
function setDifficulty(difficulty) {
  selectedDifficulty = difficulty;

  // Update button classes (remove 'selected' from all, add to active one)
  easy.classList.toggle('selected', difficulty === 'easy');
  medium.classList.toggle('selected', difficulty === 'medium');
  hard.classList.toggle('selected', difficulty === 'hard');

  getRandomText(difficulty);
  //startActiveTimer();
  userInput.focus();
}

// 2. Attach clean, single-line event listeners
easy.addEventListener('click', () => setDifficulty('easy'));
medium.addEventListener('click', () => setDifficulty('medium'));
hard.addEventListener('click', () => setDifficulty('hard'));


let selectedTimeMode = 'untimed';
let timeInterval;
let timeLeft;

// Listen for clicks on the time mode buttons and update the selected time mode accordingly
timed.addEventListener('click',()=>{
  selectedTimeMode = 'timed';
  timed.classList.add('selected');
  untimed.classList.remove('selected');
  startActiveTimer();
  userInput.focus()
})

untimed.addEventListener('click',()=>{
  selectedTimeMode = 'untimed';
  untimed.classList.add('selected');
  timed.classList.remove('selected');
  startActiveTimer();
  userInput.focus();
    
})

custom.addEventListener('click',()=>{
  selectedTimeMode = 'custom';
  custom.classList.add('selected');
  timed.classList.remove('selected');
  untimed.classList.remove('selected');
  custom.focus();
})

custom.addEventListener('keydown',(event)=>{
  if (event.key === 'Enter') {
    selectedTimeMode = 'custom';
    startActiveTimer();
    custom.value = '';
    userInput.focus();
  }
})

// Function to set the timer for timed mode
function setTimedMode() {
  clearInterval(timeInterval);
  timeLeft = 60;
  timeInterval = setInterval(()=>{
    timeLeft--;
    time.textContent = (timeLeft>0?`0:${timeLeft}s`:`0:00s`);
    if(timeLeft === 0){
      clearInterval(timeInterval);
      resultsSection.classList.remove('hidden');
      finalWcount.textContent = wordCount;
      finalAccuracy.textContent = `${Math.floor((correctChars / inputText.length) * 100)}%`;
      characters.textContent = inputText.length;
      clearInterval(timeInterval); // Stop the timer if the user has finished typing  

    }
  }, 1000)}

// Function to set the timer for untimed mode
function setUntimedMode() {
  clearInterval(timeInterval);
  timeLeft = 0;
    timeInterval = setInterval(()=>{
      timeLeft++;
      time.textContent = `0:${timeLeft}s`;
      
    }, 1000)
  }

function setCustomMode() {
  clearInterval(timeInterval);
  timeLeft = 0;
  const customTime = custom.value.trim();
  if (isNaN(customTime) || parseInt(customTime) <= 0) {// Check if the input is a valid positive number
    alert('Please enter a valid positive number for custom time.');
    return;
  }
  timeLeft = parseInt(customTime);
  timeInterval = setInterval(()=>{
    timeLeft--;
    time.textContent = (timeLeft>0?`0:${timeLeft}s`:`0:00s`);
    if(timeLeft === 0){
      clearInterval(timeInterval);// Stop the timer if the time has run out
      resultsSection.classList.remove('hidden');
      finalWcount.textContent = wordCount;
      finalAccuracy.textContent = `${Math.floor((correctChars / inputText.length) * 100)}%`;
      characters.textContent = inputText.length;
      
    }
  }, 1000)}

// Function to start the active timer based on the selected time mode
function startActiveTimer() {
  if (selectedTimeMode === 'timed') {
    setTimedMode();
  } else if (selectedTimeMode === 'untimed') {
    setUntimedMode();
  } else {
    setCustomMode();
  }
}

// Function to get a random text based on the selected difficulty level
let selectedText = '';
function getRandomText(difficulty='easy') {
  userInput.value = '';
  const randIndex = Math.floor(Math.random() * data[difficulty].length);
  selectedText = data[difficulty][randIndex].text;
  
  //  Split the selected text into individual letters and wrap each letter in a <span> element  
  const letters = selectedText.split('');
  const spanText = letters.map((letter) => `<span>${letter}</span>`).join('');
  displayedText.innerHTML = spanText;

  
}

// Handles character matching, accuracy, and word count on every keystroke
function updateTypingProgress() {
  const spans = displayedText.querySelectorAll('span');
  correctChars = 0; // Reset count on each input check

  for (let i = 0; i < spans.length; i++) {
    const typedChar = inputText[i];
    const targetChar = spans[i].textContent;

    if (typedChar == null) {
      spans[i].classList.remove('correct', 'incorrect');// Remove correct/incorrect classes if no character is typed yet
    } else if (typedChar === targetChar) {// If the typed character matches the target character
      spans[i].classList.add('correct');// Add the 'correct' class to the span
      spans[i].classList.remove('incorrect');// Remove the 'incorrect' class from the span
      correctChars++;
    } else {
      spans[i].classList.add('incorrect');// Add the 'incorrect' class to the span
      spans[i].classList.remove('correct');// Remove the 'correct' class from the span
    }
  }

  // Update live accuracy
  if (inputText.length > 0) {
    accuracy.textContent = `${Math.floor((correctChars / inputText.length) * 100)}%`;
  }

  // Update live word count
  const words = inputText.trim().split(/\s+/);// Split the input text into words using whitespace as the delimiter
  wordCount = inputText.trim() === '' ? 0 : words.length;// Count the number of words typed
  wcount.textContent = wordCount;
}

// Handles checking if the game has ended (time out or finished typing)
function checkGameOver() {
  const spans = displayedText.querySelectorAll('span');// Get all the span elements representing the target text
  const isTimedOut = (selectedTimeMode === 'timed' || selectedTimeMode === 'custom') && timeLeft === 0;// Check if the time has run out for timed or custom modes
  const isFinishedTyping = inputText.length === spans.length;// Check if the user has finished typing all characters in the target text

  if (isTimedOut || isFinishedTyping) {// If the game is over (either timed out or finished typing)
    resultsSection.classList.remove('hidden');// Show the results section
    finalWcount.textContent = wordCount;// Display the final word count
    
    if (inputText.length > 0) {// If the user has typed any characters, calculate and display the final accuracy
      finalAccuracy.textContent = `${Math.floor((correctChars / inputText.length) * 100)}%`;// Calculate and display the final accuracy percentage
    } else {
      finalAccuracy.textContent = '0%';// If no characters were typed, set accuracy to 0%
    }
    
    characters.textContent = inputText.length;// Display the total number of characters typed
    clearInterval(timeInterval);// Stop the timer if the user has finished typing or timed out

    // High score logic (only matters if they finished typing)
    if (isFinishedTyping) {
      let currentHighScore = localStorage.getItem('bestScore') || 0;// Get the current high score from local storage (default to 0 if not set)
      if (wordCount > currentHighScore) {// If the current word count is greater than the stored high score, update the high score
        localStorage.setItem('bestScore', wordCount);// Store the new high score in local storage
        bestScore.textContent = wordCount;// Update the displayed best score
      }
    }
  }
}

userInput.addEventListener('input',(event)=>{// Listen for input events on the user input field
  inputText = event.target.value;// Get the current value of the input field
  
  updateTypingProgress(); // Update the typing progress (correct/incorrect characters, accuracy, word count)
  checkGameOver(); // Check if the game has ended (time out or finished typing)
})



restart.addEventListener('click',()=>{
  startOverlay.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  clearInterval(timeInterval);
  getRandomText(selectedDifficulty);
  startActiveTimer();
  userInput.focus();
  
})