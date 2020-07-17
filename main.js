const startButton = document.querySelector(".start");
const playerGrid = document.querySelector("#player");
const cpuGrid = document.querySelector("#cpu");
const gameBoard = document.querySelector(".game");
const gameText = document.querySelector(".gameText");
const turns = document.querySelector(".turns");

let playerShips = [];
let cpuShips = [];
let cpuHitArr = Array.from(Array(100).keys());

// make playerGrid and cpuGrid
function makeGrid(name, id) {
  for(let i=0; i<=99; i++) {
    const div = document.createElement("div");
    div.style.backgroundColor = "white";
    div.id = id + (i);
    if(i%10 === 0) {
      div.className="square first";
      name.appendChild(div);    
    } else {
      div.className="square";
      name.appendChild(div);
    }
  }
}

function shipsToGrid(grid, sArr) {
  // select all divs on Grid
  const elements = grid.childNodes;
  // ship sizes
  let ships = [5,4,3,3,2];
  let random;
  let dirNum;
  // loop ships Array and put ships randomly to grid
  for(let i=0; i<ships.length; i++) {
    // randomize direction down or right and set random start point
    let randomDir = Math.random() < 0.5 ? "D" : "R";
    if(randomDir === "R") {
      random = Math.floor((Math.random() * (10 - ships[i]))) + (Math.floor((Math.random() * 9) + 1) * 10);
      dirNum = 1;
    } else {
      random = Math.floor((Math.random() * 10)) + (Math.floor((Math.random() * (10 - ships[i]))) * 10);
      dirNum = 10;
    }
    let shipArr = [];
    // check if position for ship is avaible on grid
    for(let j=0; j<ships[i]; j++) {
      if(elements[random+(j*dirNum)].textContent === "O") {
        shipArr = [];
        i--;
        break;
      } else {
        elements[random+(j*dirNum)].textContent = "O";
        shipArr.push(elements[random+(j*dirNum)].id);
      }
    }
    // add ship id coordinates to playerShip array or cpuShip array
    if(shipArr.length > 0) {
      sArr.push(shipArr);  
    } 
  }  
  elements.forEach(div => div.textContent = "");
}

// show players ship on right grid
function showPlayerShips() {
  for(let i=0; i<cpuShips.length; i++) {
    for(let j=0; j<cpuShips[i].length; j++) {
      let num = cpuShips[i][j].slice(1);
      cpuGrid.childNodes[num].style.backgroundColor = "lightblue";
    }
  }
}

function checkHit(e) {
  gameText.style.color ="blue";
  let turn = true;
  // check if click hits ship
  for (let i=0; i<playerShips.length; i++) {
    if(playerShips[i].includes(e.target.id)) {
      e.target.style.backgroundColor = "red";
      gameText.textContent = "You hit ship";
      // remove hit id from ship array
      playerShips[i] = playerShips[i].filter(id => id !== e.target.id);
      turn = true;
      break;
    } else {
      // if click blue or red div then do nothing
      // else set turn = false and change div color to blue
      if(e.target.style.backgroundColor === "white") {
        e.target.style.backgroundColor = "blue";
        turn = false;
        gameText.textContent = "You miss ship";
      }
    }
  }
  // if turn = false then cpu turn
  if(!turn) {
    turns.textContent = "CPU turn";
    setTimeout(cpuHit, 700);
    playerGrid.removeEventListener("click", checkHit);
    turn = true;
  }
  // if one cpu ship sink then info it
  for(let i=0; i<playerShips.length; i++) {
    if(playerShips[i].length === 0) {
      playerShips.splice(i,1);
      gameText.textContent = "You sink ship";
    }
  }
  //if all cpu ships sinks then info win
  if(playerShips.length === 0) {
    gameText.textContent = "You WIN!";
    playerGrid.removeEventListener("click", checkHit);
  }
}

function cpuHit() {
  let turn = true;
  gameText.style.color ="red";
  // take randomNum from cpuHitArray
  randomNum = cpuHitArr[Math.floor((Math.random() * (cpuHitArr.length-1)))];
  // check cpu hits/misses
  for(let i=0; i<cpuShips.length; i++) {
    if(cpuShips[i].includes(`c${randomNum}`)) {
      cpuGrid.childNodes[randomNum].style.backgroundColor = "red";
      gameText.textContent = "Cpu hit ship";
      cpuShips[i] = cpuShips[i].filter(id => id !== `c${randomNum}`);
      setTimeout(cpuHit, 700);
      turn = true;
      break;
    } else {
      cpuGrid.childNodes[randomNum].style.backgroundColor = "blue";
      gameText.textContent ="Cpu miss ship";
      turn = false;
    }
  }
  cpuHitArr = cpuHitArr.filter(id => id !== randomNum);
  // if turn = false then player turn
  if(!turn) {
    turns.textContent = "Your turn";
    playerGrid.addEventListener("click", checkHit);
    turn = true;
  }
  // if one player ship sink then info it
  for(let i=0; i<cpuShips.length; i++) {
    if(cpuShips[i].length === 0) {
      cpuShips.splice(i,1);
      gameText.textContent = "Cpu sink ship";
    }
  }
  //if all player ships sinks then info lose
  if(cpuShips.length === 0) {
    gameText.textContent = "You lose!";
    playerGrid.removeEventListener("click", checkHit);
  }
}


// event clears grids and arrays then starts new game
startButton.addEventListener("click", function() {
  while (playerGrid.lastChild) {
    playerGrid.removeChild(playerGrid.lastChild);
    cpuGrid.removeChild(cpuGrid.lastChild);
  }
  playerShips = [];
  cpuShips = [];
  cpuHitArr = Array.from(Array(100).keys());

  makeGrid(playerGrid, "p");
  makeGrid(cpuGrid, "c");
  shipsToGrid(playerGrid, playerShips);
  shipsToGrid(cpuGrid, cpuShips);
  showPlayerShips();
  gameText.textContent = "";
  turns.textContent = "Your turn";
  playerGrid.addEventListener("click", checkHit);
});