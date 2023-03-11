
const gPage = document.getElementById('gamePage');
const sPage = document.getElementById('scorePage');
const spPage = document.getElementById('page1');
const countP = document.getElementById('countdP');
const sForm = document.getElementById('sForm');
const rCont = document.querySelectorAll('.rcount1');
const rinput = document.querySelectorAll('input');
const bestS = document.querySelectorAll('.bestsV');
const countD = document.querySelector('.countD');
const intemC = document.querySelector('.intem-Cont');
const fTime = document.querySelector('.finaltime1');
const bTime = document.querySelector('.basisTime');
const penalTime = document.querySelector('.ptime');
const buttonPA = document.querySelector('.pAgain');
let qAmount = 0;
let equet = [];
let playerPoint = [];
let bestScore1 = [];
let number1 = 0;
let number2 = 0;
let equeO = {};
const wFormat = [];
let timer;
let timerP = 0;
let basisTime = 0;
let penalttimes = 0;
let finaltime1 = 0;
let display = '0';
let valueY = 0;

function bestSToDOM() {
  bestS.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScore1[index].bestScore}s`;
  });
}

function getSavedbestS() {
  if (localStorage.getItem('bestS')) {
    bestScore1 = JSON.parse(localStorage.bestS);
  } else {
    bestScore1 = [
      { questions: 10, bestScore: display },
      { questions: 25, bestScore: display },
      { questions: 50, bestScore: display },
      { questions: 99, bestScore: display },
    ];
    localStorage.setItem('bestS', JSON.stringify(bestScore1));
  }
  bestSToDOM();
}

function updateBestScore() {
  bestScore1.forEach((score, index) => {

    if (qAmount == score.questions) {

      const saveBests = Number(bestScore1[index].bestScore);

      if (saveBests === 0 || saveBests > finaltime1) {
        bestScore1[index].bestScore = display;
      }
    }
  });
  bestSToDOM();
  localStorage.setItem('bestS', JSON.stringify(bestScore1));
}

function playAgain() {
  gPage.addEventListener('click', startTimer);
  sPage.hidden = true;
  spPage.hidden = false;
  equet = [];
  playerPoint = [];
  valueY = 0;
  buttonPA.hidden = true;
}

function showsPage() {
  setTimeout(() => {
    buttonPA.hidden = false;
  }, 1000);
  gPage.hidden = true;
  sPage.hidden = false;
}

function scoresToDOM() {
  display = finaltime1.toFixed(1);
  basisTime = timerP.toFixed(1);
  penalttimes = penalttimes.toFixed(1);
  bTime.textContent = `Base Time: ${basisTime}s`;
  penalTime.textContent = `Penalty: +${penalttimes}s`;
  fTime.textContent = `${display}s`;
  updateBestScore();
  intemC.scrollTo({ top: 0, behavior: 'instant' });
  showsPage();
}

function checkTime() {
  console.log(timerP);
  if (playerPoint.length == qAmount) {
    clearInterval(timer);
    equet.forEach((equation, index) => {
      if (equation.evaluated === playerPoint[index]) {
      } else {
        penalttimes += 0.5;
      }
    });
    finaltime1 = timerP + penalttimes;
    console.log('time:', timerP, 'penalty:', penalttimes, 'final:', finaltime1);
    scoresToDOM();
  }
}

function addTime() {
  timerP += 0.1;
  checkTime();
}

function startTimer() {
  timerP = 0;
  penalttimes = 0;
  finaltime1 = 0;
  timer = setInterval(addTime, 100);
  gPage.removeEventListener('click', startTimer);
}

function select(guessedTrue) {
  valueY += 80;
  intemC.scroll(0, valueY);
  return guessedTrue ? playerPoint.push('true') : playerPoint.push('false');
}

function showgPage() {
  gPage.hidden = false;
  countP.hidden = true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createEquations() {
  const correctEquations = getRandomInt(qAmount);
  console.log('correct equations:', correctEquations);
  const wrongEquations = qAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);

  for (let i = 0; i < correctEquations; i++) {
    number1 = getRandomInt(9);
    number2 = getRandomInt(9);
    const equationValue = number1 + number2;
    const equation = `${number1} + ${number2} = ${equationValue}`;
    equeO = { value: equation, evaluated: 'true' };
    equet.push(equeO);
  }
  
  for (let i = 0; i < wrongEquations; i++) {
    number1 = getRandomInt(9);
    number2 = getRandomInt(9);
    const equationValue = number1 + number2;
    wFormat[0] = `${number1} + ${number2 + 1} = ${equationValue}`;
    wFormat[1] = `${number1} + ${number2} = ${equationValue - 1}`;
    wFormat[2] = `${number1 + 1} + ${number2} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wFormat[formatChoice];
    equeO = { value: equation, evaluated: 'false' };
    equet.push(equeO);
  }
  shuffle(equet);
}


function equationsToDOM() {
  equet.forEach((equation) => {

    const item = document.createElement('div');
    item.classList.add('item');

    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    intemC.appendChild(item);
  });
}

function populategPage() {
  intemC.textContent = '';

  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');

  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');

  intemC.append(topSpacer, selectedItem);

  createEquations();
  equationsToDOM();

  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  intemC.appendChild(bottomSpacer);
}

function countDStart() {
  countD.textContent = '3';
  setTimeout(() => {
    countD.textContent = '2';
  }, 1000);
  setTimeout(() => {
    countD.textContent = '1';
  }, 2000);
  setTimeout(() => {
    countD.textContent = 'Start!';
  }, 3000);
}

function showcountD() {
  countP.hidden = false;
  spPage.hidden = true;
  countDStart();
  populategPage();
  setTimeout(showgPage, 4000);
}

function getRadioValue() {
  let radioValue;
  rinput.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

function selectqAmount(e) {
  e.preventDefault();
  qAmount = getRadioValue();
  console.log('question amount:', qAmount);
  if (qAmount) {
      showcountD();
  }
}

sForm.addEventListener('click', () => {
  rCont.forEach((radioEl) => {
    radioEl.classList.remove('selected-label');
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

gPage.addEventListener('click', startTimer);
sForm.addEventListener('submit', selectqAmount);

getSavedbestS();
