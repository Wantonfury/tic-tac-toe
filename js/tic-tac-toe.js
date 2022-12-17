const btnPlayerLeft = document.querySelector("#btn-player-left");
const btnPlayerRight = document.querySelector("#btn-player-right");
const btnExit = document.querySelector("#btn-exit");
const btnStart = document.querySelector("#btn-start");

let choosePlayer = (e) => {
    if (e.currentTarget.textContent === "Player") e.currentTarget.textContent = "AI";
    else e.currentTarget.textContent = "Player";
}

let Player = (playerName) => {
    let wins = 0;
    let name = playerName;
    let active = false;
    let AI = false;
    let first = false;
    
    const score = () => ++wins;
    const setScore = (scoreNew) => wins = scoreNew;
    const getScore = () => wins;
    
    const setName = (newName) => name = newName;
    const getName = () => name;
    
    const setAI = (ai) => AI = ai;
    const isAI = () => AI;
    
    const makeActivePlayer = (activePlayer) => active = activePlayer;
    const isActivePlayer = () => active;
    
    const setFirst = (firstPlayer) => first = firstPlayer;
    const isFirst = () => first;
    
    return { score, setScore, getScore, setName, getName, setAI, isAI, makeActivePlayer, isActivePlayer, setFirst, isFirst };
}

const gameboard = ((gameboard, board, choice, size) => {
    const player1 = Player("Player 1");
    const player2 = Player("Player 2");
    const player1Hand = document.querySelector("#player-1-hand");
    const player2Hand = document.querySelector("#player-2-hand");
    const roundCounter = document.querySelector("#round-counter");
    
    let tiles = [[]];
    let rounds = 0;
    
    const switchActivePlayer = () => {
        switch (getActivePlayer()) {
            case player1: 
                player1.makeActivePlayer(false);
                player2.makeActivePlayer(true);
                player1Hand.style.visibility = "hidden";
                player2Hand.style.visibility = "visible";
                break;
            case player2:
                player1.makeActivePlayer(true);
                player2.makeActivePlayer(false);
                player1Hand.style.visibility = "visible";
                player2Hand.style.visibility = "hidden";
                break;
        }
    }
    
    const switchFirstPlayer = () => {
        if (player1.isFirst()) {
            player1.setFirst(false);
            player2.setFirst(true);
            
            player1Hand.style.visibility = "hidden";
            player2Hand.style.visibility = "visible";
        } else {
            player1.setFirst(true);
            player2.setFirst(false);
            
            player1Hand.style.visibility = "visible";
            player2Hand.style.visibility = "hidden";
        }
    }
    
    const checkVictory = (x, y) => {
        let matchOver = false;
        let counter = { "X": 0, "O": 0, "": 0 };
        
        counter.reset = () => {
            counter["X"] = 0;
            counter["O"] = 0;
            counter[""] = 0;
        }
        
        // Check horizontal lines
        for (let i = 0; i < size; ++i) {
            counter.reset();
            
            for (let j = 0; j < size; ++j)
                ++counter[tiles[i][j].textContent];
                
            if (counter["X"] == size || counter["O"] == size) matchOver = true;
        }
        
        // Check vertical lines
        for (let j = 0; j < size; ++j) {
            counter.reset();
            
            for (let i = 0; i < size; ++i)
                ++counter[tiles[i][j].textContent];
            
            if (counter["X"] == size || counter["O"] == size) matchOver = true;
        }
        
        // Check diagonal lines
        counter.reset();
        for (let i = 0; i < size; ++i)
            ++counter[tiles[i][i].textContent];
        if (counter["X"] == size || counter["O"] == size) matchOver = true;
        
        counter.reset();
        ++counter[tiles[2][0].textContent];
        ++counter[tiles[1][1].textContent];
        ++counter[tiles[0][2].textContent];
        if (counter["X"] == size || counter["O"] == size) matchOver = true;
        
        // Check draw
        counter.reset();
        for (let i = 0; i < size; ++i)
            for (let j = 0; j < size; ++j)
                ++counter[tiles[i][j].textContent];
        
        if (counter[""] === 0 && !matchOver) draw();
        else if (matchOver) victory();
        
        return matchOver;
    }
    
    const updateScore = () => {
        const score1 = document.querySelector("#player-1-score");
        const score2 = document.querySelector("#player-2-score");
        
        score1.textContent = player1.getScore();
        score2.textContent = player2.getScore();
    }
    
    const lockTiles = () => {
        for (let i = 0; i < size; ++i)
            for (let j = 0; j < size; ++j)
                tiles[i][j].removeEventListener("click", playTile);
    }
    
    const unlockTiles = () => {
        for (let i = 0; i < size; ++i)
            for (let j = 0; j < size; ++j)
                tiles[i][j].addEventListener("click", playTile);
    }
    
    const restart = () => {
        lockTiles();
        
        if (getActivePlayer() === player1) {
            const score = document.querySelector("#player-1-score");
            score.classList.add("score-pop");
        } else {
            const score = document.querySelector("#player-2-score");
            score.classList.add("score-pop");
        }
        
        setTimeout(() => {
            const score1 = document.querySelector("#player-1-score");
            const score2 = document.querySelector("#player-2-score");
            
            score1.classList.remove("score-pop");
            score2.classList.remove("score-pop");
            
            switchFirstPlayer();
            
            if (player1.isFirst()) {
                player1.makeActivePlayer(true);
                player2.makeActivePlayer(false);
            } else {
                player1.makeActivePlayer(false);
                player2.makeActivePlayer(true);
            }
            
            roundCounter.classList.add("score-pop");
            roundCounter.textContent = ++rounds;
            
            clear();
            unlockTiles();
            
            setTimeout(() => {
                roundCounter.classList.remove("score-pop");
            }, 500);
        }, 500);
    }
    
    const victory = () => {
        getActivePlayer().score();
        updateScore();
        
        restart();
    }
    
    const draw = () => {
        restart();
    }
    
    const clear = () => {
        for (let i = 0; i < size; ++i)
            for (let j = 0; j < size; ++j)
                tiles[i][j].textContent = "";
    }
    
    const playTile = (e) => {
        if (e.currentTarget.textContent !== "") return;
        
        e.currentTarget.firstChild.textContent = (getActivePlayer() === player1 ? "X" : "O");
        e.currentTarget.firstChild.classList.add("tile-pop");
        
        (function (tile) {
            setTimeout(() => {
                tile.classList.remove("tile-pop");
            }, 200);
        })(e.currentTarget.firstChild);
        
        if (!checkVictory(e.currentTarget.dataset.x, e.currentTarget.dataset.y)) switchActivePlayer();
    }
    
    const startGame = () => {
        choice.classList.add("hidden");
        gameboard.classList.remove("hidden");
        
        rounds = 0;
        roundCounter.textContent = rounds;
        
        player1.makeActivePlayer(true);
        player1.setFirst(true);
        player1Hand.style.visibility = "visible";
        player2Hand.style.visibility = "hidden";
        player2.makeActivePlayer(false);
        
        clear();
        player1.setScore(0);
        player2.setScore(0);
    }
    
    const exitGame = () => {
        gameboard.classList.add("hidden");
        choice.classList.remove("hidden");
    }
    
    const getActivePlayer = () => {
        return (player1.isActivePlayer() ? player1 : player2);
    }
    
    const setup = () => {
        for (let i = 0; i < size; ++i) {
            tiles[i] = new Array(size);
            
            for (let j = 0; j < size; ++j) {
                const tile = document.createElement("div");
                const tileText = document.createElement("span");
                
                tile.classList.add("tile");
                tile.appendChild(tileText);
                tile.addEventListener("click", playTile);
                tileText.textContent = "";
                
                board.appendChild(tile);
                tiles[i][j] = tileText;
            }
        }
    }
    
    const init = () => {
        setup();
    }
    
    return { init, startGame, exitGame };
})(document.querySelector("#gameboard"), document.querySelector("#tile-cnt"), document.querySelector("#choice"), 3);

gameboard.init();

btnPlayerLeft.addEventListener("click", choosePlayer);
btnPlayerRight.addEventListener("click", choosePlayer);
btnStart.addEventListener("click", gameboard.startGame);
btnExit.addEventListener("click", gameboard.exitGame);