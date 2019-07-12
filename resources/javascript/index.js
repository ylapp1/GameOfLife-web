/**
 * @version 0.1
 * @copyright 2018 CN-Consult GmbH
 * @author Yannick Lapp <yannick.lapp@cn-consult.eu>
 */

// Initialize fields

/**
 * Returns a random integer between 0 and a defined maximum value.
 *
 * @param {int} maximumValue The maximum value
 *
 * @returns {int} The random value
 */
function getRandomInteger(maximumValue) {
    return Math.floor(Math.random() * Math.floor(maximumValue));
}

/**
 * Returns a 10x10 list of randomly set fields.
 *
 * @return {boolean[][]} The fields
 */
function initializeFields()
{
    let fields = [];
    for (let y = 0; y < 10; y++)
    {
        fields[y] = [];
        for (let x = 0; x < 10; x++)
        {
            let randomNumber = getRandomInteger(100);
            let fieldState = false;
            if (randomNumber > 50) fieldState = true;

            fields[y][x] = fieldState;
        }
    }

    return fields;
}


// Print fields

/**
 * Returns the output string for a list of fields.
 *
 * @param {boolean[][]} fields The list of fields
 *
 * @return {String} The fields string
 */
function getFieldsOutput(fields)
{
    let fieldsOutput = "<table>";

    fields.forEach(function(fieldsRow){

        fieldsOutput += "<tr>";
        fieldsRow.forEach(function(field){

            let fieldClass = "dead";
            if (field === true) fieldClass = "alive";

            fieldsOutput += "<td class=\"cell " + fieldClass + "\"></td>";
        });

        fieldsOutput += "</tr>";
    });

    fieldsOutput += "</table>";

    return fieldsOutput;
}

/**
 * Prints a list of fields to the web page.
 *
 * @param {boolean[][]} fields The list of fields
 */
function printFields(fields)
{
    let fieldsDiv = document.getElementById("fields");
    fieldsDiv.innerHTML = getFieldsOutput(fields);
}


// Calculate new step

function calculateStep(fields)
{
    let updatedFields = [];
    let y = 0;
    fields.forEach(function(rowFields){

        updatedFields[y] = [];
        let x = 0;
        rowFields.forEach(function(field){

            updatedFields[y][x] = calculateState(field, fields, x, y);
            x++;

        });

        y++;
    });

    return updatedFields;
}

function calculateState(field, fields, x, y)
{
    let numberOfLivingNeighbors = getNumberOfLivingNeighbors(field, fields, x, y);
    let updatedFieldState = field;

    // Living cell dies
    if (field === true)
    {
        if (numberOfLivingNeighbors < 2 || numberOfLivingNeighbors > 3) updatedFieldState = false;
    }
    else
    {
        if (numberOfLivingNeighbors === 3) updatedFieldState = true;
    }

    return updatedFieldState;
}

function getNumberOfLivingNeighbors(field, fields, x, y)
{
    let xCoordinates = [x];
    if (x > 0) xCoordinates.push(x - 1);
    if (x < fields[y].length - 1) xCoordinates.push(x + 1);

    let yCoordinates = [y];
    if (y > 0) yCoordinates.push(y - 1);
    if (y < fields.length - 1) yCoordinates.push(y + 1);

    let numberOfLivingNeighbors = 0;
    yCoordinates.forEach(function(checkY){
        xCoordinates.forEach(function(checkX){
            if (fields[checkY][checkX] === true) numberOfLivingNeighbors += 1;
        });
    });

    if (field === true) numberOfLivingNeighbors -= 1;

    return numberOfLivingNeighbors;
}


// Util

function sleep (time)
{
    return new Promise((resolve) => setTimeout(resolve, time));
}

function incrementGameStep()
{

    let gameStepElement = document.getElementById("gameStep");
    let currentGameStep = gameStepElement.innerText;

    let newGameStep = 1;
    if (currentGameStep) newGameStep = Number(currentGameStep) + 1;

    setGameStep(newGameStep);
}

function setGameStep(newGameStep)
{
    document.getElementById("gameStep").innerText = "" + newGameStep;
}

let gameLoopTimeOut;

function gameLoop(fields)
{
    incrementGameStep();
    printFields(fields);
    gameLoopTimeOut = setTimeout(function(){
        let previousFields = fields;
        fields = calculateStep(fields);

        if (JSON.stringify(previousFields) !== JSON.stringify(fields)) gameLoop(fields);
    }, 100)
}


document.getElementById("startGameLoop").onclick = function(){
    clearTimeout(gameLoopTimeOut);
    setGameStep(0);
    let fields = initializeFields();
    gameLoop(fields);
};

document.getElementById("stopGameLoop").onclick = function(){
    clearTimeout(gameLoopTimeOut);
};
