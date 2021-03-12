//Create global variables for the number of rerolls remaining, the score for each collection type,
// and an array to hold dice.

let imgSrc= {"adversary":"tank.png", "defense":"raygun.png", "cows":"cow.png", "chickens":"chicken.png", "humans":"human.png"};

let reRolls = 2;
$("#rollCount").text(reRolls);
let score_X = 0;
$("#human").text(score_X);
let score_Y = 0;
$("#cows").text(score_Y);
let score_Z = 0;
$("#chickens").text(score_Z);

let diceArray = [];

$(document).ready(function()
{
    //Assign six of the functions below (startTurn, reroll, endTurn, scoreX, scoreY, scoreZ) to the six buttons.
    $("button#start").click(startTurn);
    $("button#reroll").click(reroll);
    $("button#end").click(endTurn);
    $("button#x").click(scoreX);
    $("button#y").click(scoreY);
    $("button#z").click(scoreZ);

    //Using a loop that runs 13 times,
    // create span elements and add them to the DOM.
    // Each span should have the function toggleHeld assigned as a click handler.
    for(let i = 0; i < 13; i++)
    {
        createSpan(i);
    }

    //Call the startTurn function.
    startTurn();

});

function createSpan(v) {
    let board = $("div#board");
    let dice = $("<span>");
    dice.attr("id","address"+v+"");
    dice.addClass("hasSpan");
    dice.click(toggleHeld);
    board.append(dice);
}

//Generates a random number that can be used to choose one of the six possible die faces.
// (Remember that two of the six faces will both be defense.)
function getRandomDieFace()
{
    let randomNumber =  Math.floor(Math.random() * 6) +1;
    let randomDieFace = "";
    if(randomNumber === 1 || randomNumber === 2)
        randomDieFace = "defense";
    else if (randomNumber === 3)
        randomDieFace = "adversary";
    else if (randomNumber === 4)
        randomDieFace = "cows";
    else if (randomNumber === 5)
        randomDieFace = "chickens";
    else if (randomNumber === 6)
        randomDieFace = "humans";
// randomly chosen string
    return randomDieFace;
}

function createDieObject(index)
{
    //Gets a random die face.
    let randomFace = getRandomDieFace();

    //Creates an object with (at minimum) these three properties
    // face: the randomly generated face
    // held: initially true if the face is the adversary, false otherwise
    // toggleHeld: a function that will toggle the held property, but only for non-adversary faces

    let dieObject ={
        face: randomFace,
        held: randomFace === "adversary" ? true : false,
        toggleHeld: function (){
            if(this.face !== "adversary") {
                if (this.held === false)
                    return this.held = true;
                else if (this.held === true)
                    return this.held = false;
            }
        }
    };

    //Inserts the object into the array at the given index.
    diceArray.splice(index, 1, dieObject);
   //
    // alert(diceArray[index].face + diceArray[index].held);

}

//	A comparator function for dice objects. Held dice sort before non-held dice.
//	As a secondary sort, order by face.
function sortDice(a, b)
{

    if (a.held > b.held)
        return -1;
    else if (a.held < b.held)
        return 1;
    else {
        // if held status are same, check face
        if (a.face < b.face)
            return -1;
        else if (a.face > b.face)
            return 1;
        else
            return 0;
    }

}

//Uses a loop to create a new die object at each index of the dice array.
function rollAllDice()
{
    for(let i = 0; i< 13; i++)
    {
        createDieObject(i);
    }
}

let i = 0;
//Locates the <span> that corresponds to the die object at the array index.
function drawDie(index)
{
    let dice = $("span#address"+i);
    i++;
   // Updates the background image of the span using CSS.

    let imageUrl = imgSrc[diceArray[index].face];
    dice.css({"background-image": "url(" + imageUrl + ")", "background-repeat":"no-repeat"});


      // Applies or removes a style to indicate whether the die is held or not.
    if(diceArray[index].held === true)
    {
        dice.css("box-shadow", "10px 10px blue");
    }
    else
        dice.css("box-shadow", "");

}

function drawAllDice()
{
    //Uses the comparator function to sort the dice array.

    diceArray.sort(sortDice);


    // Uses a loop to draw the die at each index of the dice array.
    for(let i = 0; i < diceArray.length; i++)
    {
       drawDie(i);
    }
}

//Called when a die is clicked on.
function toggleHeld()
{
    // Locates the die object in the dice array that corresponds to the span that was clicked
    // and calls its function to toggle its held flag.
    let clickedSpan = $(this);
    let clickedIndex = clickedSpan.index();

    if(diceArray[clickedIndex].held === false)
    {
        diceArray[clickedIndex].toggleHeld();
    }
    else if(diceArray[clickedIndex].held === true)
    {
        diceArray[clickedIndex].toggleHeld();
    }

   // alert(diceArray[clickedIndex].held + ""+ diceArray[clickedIndex].face);

    // Draws the die.
    //drawDie(clickedIndex);
    if(diceArray[clickedIndex].held === true)
    {
        clickedSpan.css("box-shadow", "10px 10px blue");
    }
    else
        clickedSpan.css("box-shadow", "");
}

//Called when the Start Turn button is clicked.
function startTurn()
{
    // Hides every button except for Reroll and End Turn.
    $("button#start").hide();
    $("button#x").hide();
    $("button#y").hide();
    $("button#z").hide();
    $("button#reroll").show();
    $("button#end").show();


// Resets the numbers of rerolls.
    reRolls = 2;

// Rolls all the dice and draws all the dice.
    rollAllDice();
    drawAllDice();
}

function lost ()
{
    //Uses a loop to iterate the dice array and count the number of adversary and defense dice.
    let adversaryCount = 0;
    let defenseCount = 0;

    for(let i = 0; i< diceArray.length; i++)

    {
        if(diceArray[i].face === "adversary"  && diceArray[i].held === true){

            adversaryCount++;
        }

        if(diceArray[i].face === "defense"  && diceArray[i].held === true){
            defenseCount++;
        }

    }

    // Returns true if there are more adversaries than defense, false otherwise.

    if (adversaryCount > defenseCount)
        return true;
    else
        return false;
}

//Called when the End Turn button is clicked.
function endTurn()
{
    // Hides the Reroll and End Turn buttons.
    $("button#reroll").hide();
    $("button#end").hide();

    // If the player lost this turn, displays a sad message and shows the Start Turn button.
    // Otherwise, shows all Score buttons for collection types that have not been scored.

    let lostTurn = lost();

    if(lostTurn === true)
    {
        $("#output").text("You Lost! The adversary is more than defense");
        //alert("you lost");
        $("button#start").show();
    }
    else
    {
        if(score_X === 0)
            $("button#x").show();
        if(score_Y === 0)
            $("button#y").show();
        if(score_Z === 0)
            $("button#z").show();
    }
}

//Called when the Reroll button is clicked.
function reroll()
{

    // Decrements the number of rerolls.
    reRolls--;
    $("#rollCount").text(reRolls);
    // Loops over the dice array and, if a die is not held, creates a new die object at that index.
    for(let i = 0; i < diceArray.length; i++)
    {
        if(diceArray[i].held === false)
        {
            createDieObject(i);
        }

    }



    // Draws all the dice.
    drawAllDice();


    // If there are no rerolls left, ends the turn.
    if(reRolls === 0)
    {
        endTurn();
    }
}

function endGame()
{
    //Hides all buttons. Prints the final score.
    $("button#start").hide();
    $("button#reroll").hide();
    $("button#end").hide();
    $("button#x").hide();
    $("button#y").hide();
    $("button#z").hide();

    $("#output").text(`You scored ${score_X} humans, ${score_Y} cows and ${score_Z} chickens`);
}


//Called when the Score X button is clicked.
function scoreX()
{
    // Uses a loop to iterate the dice array, counting the number of X faces.
    let countX = 0;
    for(let i = 0; i< diceArray.length; i++)
    {
        if(diceArray[i].face === "humans" && diceArray[i].held === true)
        countX++;
    }

    // Assigns the points to the correct score variable.
    score_X = countX;

    // Updates the points display and prints a confirmation message.

    $("#human").text(score_X);
    $("h5#output").text(`You scored ${score_X} humans.`);

    // If all collection types have points scored, ends the game. Otherwise, starts the next turn.

    if(score_X > 0 && score_Y > 0 && score_Z> 0)
    {
        endGame();
    }
    else
        startTurn();

}



//Called when the Score Y button is clicked.
function scoreY()
{
    // Uses a loop to iterate the dice array, counting the number of Z faces.
    let countY = 0;
    for(let i = 0; i< diceArray.length; i++)
    {
        if(diceArray[i].face === "cows" && diceArray[i].held === true)
        countY++;
    }

    // Assigns the points to the correct score variable.
    score_Y = countY;

    // Updates the points display and prints a confirmation message.

    $("#cows").text(score_Y);
    $("h5#output").text(`You scored ${score_Y} cows.`);

    // If all collection types have points scored, ends the game. Otherwise, starts the next turn.

    if(score_X > 0 && score_Y > 0 && score_Z> 0)
    {
        endGame();
    }
    else
        startTurn();

}

//Called when the Score Z button is clicked.
function scoreZ()
{
    // Uses a loop to iterate the dice array, counting the number of Z faces.
    let countZ = 0;
    for(let i = 0; i< diceArray.length; i++)
    {
        if(diceArray[i].face === "chickens" && diceArray[i].held === true)
            countZ++;
    }

    // Assigns the points to the correct score variable.
    score_Z = countZ;

    // Updates the points display and prints a confirmation message.
    $("#chickens").text(score_Z);
    $("h5#output").text(`You scored ${score_Z} chickens.`);

    // If all collection types have points scored, ends the game. Otherwise, starts the next turn.
    if(score_X > 0 && score_Y > 0 && score_Z> 0)
    {
        endGame();
    }
    else
        startTurn();
}