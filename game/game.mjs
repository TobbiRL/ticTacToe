import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";
import CHAR from "./magicStringRemover.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

// These are the valid choices for the menu.
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
};
const LANGUAGE_CHOICES = {
    ENGLISH: 1,
    NORWEGIAN: 2,
};

const GAMEMODE_CHOICE = {
    PVP: 1,
    PVC: 2,
}

const NO_CHOICE = -1;

let language = DICTIONARY.en;
let gameboard;
let currentPlayer;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); // This waites 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 



//#region game functions -----------------------------

async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            await chooseYourLanguage();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) { // Do the following until the player dos not want to play anymore. 
        initializeGame(); // Reset everything related to playing the game
        isPlaying = await gamemodeSelection(); 
        
    }
}

async function showMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.MENU + ANSI.RESET);
        print(language.PLAY_GAME);
        print(language.SETTINGS);
        print(language.EXIT_GAME);

        // Wait for the choice.
        choice = await askQuestion(CHAR.EMPTY);

        // Check to see if the choice is valid.
     if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
                validChoice = true;
            }
        }
    

    return choice;
}

async function chooseYourLanguage() {

    let chosenLanguage = -1
    let validChoice = false;

    while (!validChoice) {
       
        clearScreen();
        print(language.PREFERED_LANGUAGE);
        print(language.ENGLISH);
        print(language.NORWEGIAN);

        // Wait for the choice.
        chosenLanguage = await askQuestion(CHAR.EMPTY);

        // Check to see if the choice is valid.
        if ([LANGUAGE_CHOICES.ENGLISH, LANGUAGE_CHOICES.NORWEGIAN].includes(Number(chosenLanguage))) {
            validChoice = true;
        }
    }
    if (chosenLanguage == LANGUAGE_CHOICES.ENGLISH) {
        language = DICTIONARY.en
    }
    else if (chosenLanguage == LANGUAGE_CHOICES.NORWEGIAN) {
        language = DICTIONARY.no
    }
}

async function chooseGamemode() {

    let chosenGamemode = -1
    let validChoice = false;

    while (!validChoice) {
       
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.GAME_MODE_PREFERED + ANSI.RESET);
        print(language.GAME_MODE_PVP);
        print(language.GAME_MODE_PVC);

        // Wait for the choice.
        chosenGamemode = await askQuestion(CHAR.EMPTY);

        // Check to see if the choice is valid.
        if ([GAMEMODE_CHOICE.PVP, GAMEMODE_CHOICE.PVC].includes(Number(chosenGamemode))) {
            validChoice = true;
        }
    }
   
    return chosenGamemode
    }

async function gamemodeSelection() {
    let gameMode;
    let gamemodeSelect = await chooseGamemode();
    if (gamemodeSelect == GAMEMODE_CHOICE.PVP) {
        gameMode = playGamePvP();  
    } else if (gamemodeSelect == GAMEMODE_CHOICE.PVC) {
        gameMode = playGamePvC();
    }
    return gameMode;
}

async function playGamePvP() {
    
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

async function playGamePvC() {

    let outcome;
    do {
      clearScreen();
      showGameBoardWithCurrentState();
      showHUD();
      let move;
      if (currentPlayer == PLAYER_1) {
        move = await getGameMoveFromCurrentPlayer();
      } else if (currentPlayer == PLAYER_2) {
        move = computerMove();
        while (isValidPositionOnBoard(move) == false) {
          move = computerMove();
        }
    }
      updateGameBoardState(move);
      outcome = evaluateGameState(); 
      changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
  }
  function computerMove() {
    let row = Math.floor(Math.random() * GAME_BOARD_SIZE);
    let col = Math.floor(Math.random() * GAME_BOARD_SIZE);
    let move = [row, col];
    return move;
  }

async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    if (outcome == 0.5) {
        print(language.DRAW)
    } else {
        let winningPlayer = (outcome > 0) ? 1 : 2;
        print(language.WINNER + winningPlayer); 
    }
    showGameBoardWithCurrentState();
    print(language.GAME_OVER); 
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let state = 0;
    

   
    { for (let row = 0; row < GAME_BOARD_SIZE; row++) {

        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        }
        sum = 0;
    }
    }


    { for (let col = 0; col < GAME_BOARD_SIZE; col++) {

        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        }

        sum = 0;
    }
    }
 
    { for (let col = 0, row = 0; row, col < GAME_BOARD_SIZE; row++, col++) {
        sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        
        }
        sum = 0;
    }

    { for (let row = 0, col = GAME_BOARD_SIZE - 1; row < GAME_BOARD_SIZE && col >= 0; row++, col--) {
        sum += gameboard[row][col];
        }
    
        if (Math.abs(sum) == GAME_BOARD_SIZE) {
                state = sum;
        
        }
        sum = 0;
    }
    let draw = true;
    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            if (gameboard[row][col] == 0)
                draw = false;

        } 
    }
    if (state == 0 && draw) {
        return 0.5;
    }

    let winner = state / GAME_BOARD_SIZE;
    return winner;
   
     
} 

function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    if (move[ROW_ID] >= 0 && move[ROW_ID] < GAME_BOARD_SIZE && move[COLUMN_ID] >= 0 && move[COLUMN_ID] < GAME_BOARD_SIZE) {
        gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer; 
    }
    
}

async function getGameMoveFromCurrentPlayer() {
    let position = null;
    do {
        let rawInput = await askQuestion(language.PLACE_MARK);
        position = rawInput.split(CHAR.EMPTY_SPACE);
        position[0] = parseInt(position[0]);
        position[1] = parseInt(position[1]);
        position[0] = position[0] - 1
        position[1] = position[1] - 1
    } while (isValidPositionOnBoard(position) == false)

    return position
    
}

function isValidPositionOnBoard(position) {

    if (position.length < 2) {
        // We where not given two numbers or more.
        return false;
    }

    else if (position[0] * 1 != position[0]){
        return false

    } else if (position[1] * 1 != position[1]){
        // Not Numbers
        return false;
    } 
    else if (position[0] < 0 || position[0] >= GAME_BOARD_SIZE) {
        return false
    } 
    else if (position[1] < 0 || position[1] >= GAME_BOARD_SIZE) {
        // Not on board
        return false;
    
    }
    else if (gameboard[position[0]][position[1]] !== 0) {
        return false;
    }
}

function showHUD() {
    let playerDescription = language.PLAYER_1;
    if (PLAYER_2 == currentPlayer) {
        playerDescription = language.PLAYER_2;
    }
    print(language.PLAYER + playerDescription + language.YOUR_TURN);
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = CHAR.EMPTY;
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += CHAR.LINE;
            }
            else if (cell > 0) {
                rowOutput += ANSI.COLOR.GREEN + CHAR.X + ANSI.RESET;
            } else {
                rowOutput += ANSI.COLOR.RED + CHAR.O + ANSI.RESET;
            }
        }

        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}


//#endregion