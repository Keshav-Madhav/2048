var board;
var score=0;
var rows=4;
var columns=4;
let previousBoard;
let previousScore;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

document.querySelector(".reset").addEventListener("click", resetGame);
document.querySelector(".undo").addEventListener("click", undo);

document.addEventListener('touchstart', function(e){
    touchStartX= e.touches[0].clientX;
    touchStartY= e.touches[0].clientY;
}, false);

document.addEventListener('touchend', function(e){
    touchEndX= e.changedTouches[0].clientX;
    touchEndY= e.changedTouches[0].clientY;
    handleSwipe();
},false)

function handleSwipe(){
    let deltaX= touchEndX-touchStartX;
    let deltaY= touchEndY-touchStartY;
    let absoluteDeltaX=Math.abs(deltaX);
    let absoluteDeltaY=Math.abs(deltaY);

    if(absoluteDeltaX>absoluteDeltaY){
        if(deltaX>0){
            slideRight();
            setTwo();
            gameOver();
        }
        else{
            slideLeft();
            setTwo();
            gameOver();
        }
    }
    else{
        if(deltaY>0){
            slideDown();
            setTwo();
            gameOver();
        }
        else{
            slideUp();
            setTwo();
            gameOver();
        }
    }
}




window.onload =function(){
    setGame();
}

function setGame(){
    board=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile = document.createElement("div");
            tile.id = r.toString()+'-'+c.toString();
            let num = board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }
    
    document.getElementById("high-score").textContent = highScore;


    setTwo();
    setTwo();
}

function hasEmptyTile(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            if(board[r][c]==0){
                return true;
            }
        }
    }
    return false;
}

function hasMoves() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (c < columns - 1 && tile == board[r][c + 1]) {
                return true;
            }
            if (r < rows - 1 && tile == board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}


function gameOver() {
    if (!hasEmptyTile() && !hasMoves()) {
        document.querySelector(".gameover").style.display = "block";
    }
}


function resetGame() {
    // Reset the board and score
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    
    score = 0;
    
    // Update the tiles on the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    
    setTwo();
    setTwo();
    
    document.getElementById("score").innerText = score;
    document.getElementById("high-score").textContent = highScore;

}

function undo() {
    if (previousBoard && previousScore) {
        // Revert the game state to its previous values
        board = JSON.parse(JSON.stringify(previousBoard));
        score = previousScore;
        
        // Update the tiles on the board
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + '-' + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }
        
        // Update the score display
        document.getElementById("score").innerText = score;
    }
}



function setTwo(){
    if(!hasEmptyTile()){
        return;
    }

    let found=false;
    while(!found){
        let r=Math.floor(Math.random()*rows);
        let c=Math.floor(Math.random()*columns);

        if(board[r][c]==0){
            board[r][c]=2;
            let tile=document.getElementById(r.toString()+'-'+c.toString());
            tile.innerText="2";
            tile.classList.add("x2");
            found=true;
        }
    }
}

function updateTile(tile,num){
    tile.innerText="";
    tile.classList.value="";
    tile.classList.add("tile")
    if(num>0){
        tile.innerText=num;
        if(num<=4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            tile.classList.add("x8192");
        }
    }
}


document.addEventListener("keyup",(e)=>{
    if (e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
        gameOver();
    }
    else if (e.code == "ArrowRight"){
        slideRight();
        setTwo();
        gameOver();
    }
    else if (e.code == "ArrowDown"){
        slideDown();
        setTwo();
        gameOver();
    }
    else if (e.code == "ArrowUp"){
        slideUp();
        setTwo();
        gameOver();
    }
    else if (e.code == "KeyU"){
        undo();
    }
    else if (e.code == "Space" || e.code == "KeyR"){
        resetGame();
    }


    document.getElementById("score").innerText=score;
})

function slideLeft(){
    previousBoard = JSON.parse(JSON.stringify(board));
    previousScore = score;
    for(let r=0;r<rows;r++){
        let row=board[r];
        row=slide(row);
        board[r]=row

        for(let c=0; c<columns; c++){
            let tile =document.getElementById(r.toString()+'-'+c.toString());
            let num= board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideRight(){
    previousBoard = JSON.parse(JSON.stringify(board));
    previousScore = score;
    for(let r=0;r<rows;r++){
        let row=board[r];
        row.reverse();
        row=slide(row);
        row.reverse();
        board[r]=row

        for(let c=0; c<columns; c++){
            let tile =document.getElementById(r.toString()+'-'+c.toString());
            let num= board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideUp(){
    previousBoard = JSON.parse(JSON.stringify(board));
    previousScore = score;
    for(let c=0;c<columns;c++){
        let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
        row= slide(row);
        for(let r=0; r<rows; r++){
            board[r][c]=row[r];
            let tile =document.getElementById(r.toString()+'-'+c.toString());
            let num= board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideDown(){
    previousBoard = JSON.parse(JSON.stringify(board));
    previousScore = score;
    for(let c=0;c<columns;c++){
        let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row= slide(row);
        row.reverse();
        for(let r=0; r<rows; r++){
            board[r][c]=row[r];
            let tile =document.getElementById(r.toString()+'-'+c.toString());
            let num= board[r][c];
            updateTile(tile,num);
        }
    }
}


//Slide row
function slide(row){
    row=filterZero(row);

    for(let i=0;i<row.length-1;i++){
        if(row[i]==row[i+1]){
            row[i] *=2;
            row[i+1]=0;
            score+=row[i];
        }
    }

    row=filterZero(row);
    while(row.length<columns){
        row.push(0);
    }

    return row;
}


//Creates copy array void of zeroes
function filterZero(row){
    return row.filter(num=>num!=0);
}