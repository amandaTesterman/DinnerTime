// boiler plate
let mealOptions = document.querySelector('.container-fluid')
let storedRecipes = JSON.parse(localStorage.getItem('recipesOne'));
let numberOfMealsSelected = 0
let menuMeals = []
//function to create recipes on page// cycling through my recipes array and creating layout and set up for display of meals on page: 3 recipes per row
let createRecipes = (array) => {
    let index //declaring index for row attachment
    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) { // to start and after every three recipes
            index = i
            let row = document.createElement('div')
            row.classList.add('row', `row${index}`, 'recipeRows')
            mealOptions.append(row)
        }
        let recipesRow = document.querySelector(`.row${index}`)
        let recipePlace = document.createElement('div')
        recipePlace.classList.add('recipeDiv')
        recipePlace.classList.add('col-md-3', 'recipePlace')
        let select = document.createElement('input')
        $(select).attr({ 'type': 'checkbox', 'class': 'selectMeal', 'id': `${i}`, })
        //======== creating a click function for each of the check boxes to load corrsponding recipe into new array for the users menu for the week
        select.addEventListener('click', function () {
            if (select.checked) {  // if the checkbox is checked
                menuMeals.push(storedRecipes[i])
                numberOfMealsSelected = numberOfMealsSelected + 1
                $('#displayNumberOfMealsSelected').text(`You have selected ${numberOfMealsSelected} meals for this week`)
            } else { // if not checked or unchecked
                numberOfMealsSelected = numberOfMealsSelected - 1
                $('#displayNumberOfMealsSelected').text(`You have selected ${numberOfMealsSelected} meals for this week`)
                menuMeals = menuMeals.filter(item => {//filter the menuMeal array to have only checked items and filter out any unchecked items                          
                    return item !== storedRecipes[i] ? item : null //pulls unchecked or leaves unchecked items out of selectedmeals array                   
                });
            };
        })
        //continueing to create and set and inserting recipe object key values in created html for proper display
        let title = document.createElement(`h4`)
        title.innerText = `${array[i].title}`
        title.classList.add('recipeTitle')
        let recipePic = document.createElement('img')
        $(recipePic).attr({ 'src': `${array[i].image}`, 'class': 'img-fluid', 'alt': `${array[i].title}` })
        let seeRecipe = document.createElement('a')
        seeRecipe.innerText = 'See Recipe'
        $(seeRecipe).attr({ 'href': '#', 'class': 'seeRecipeLink row' })
        let ingredientsList = document.createElement('ul')
        let instructionsList = document.createElement('ol')
        recipesRow.append(recipePlace)
        recipePlace.prepend(title)
        recipePlace.append(select)
        recipePlace.append(recipePic)
        recipePlace.append(seeRecipe)
        //=====adding event listener for when See Recipe link is clicked
        let popUpDivRecipeName = document.createTextNode($(title).text())
        seeRecipe.addEventListener('click', () => {//on click of the link
            let recipeDiv = document.querySelector('#recipeIngredientsInstructions')//declaring varible for div that will shpow recipe details
            recipeDiv.classList.remove('hidden')//removing the hidden class for div to show up
            recipeDiv.prepend(popUpDivRecipeName)
            let ingredientDiv = document.querySelector('#ingredientsDiv')
            let instructionsDiv = document.querySelector('#instructionsDiv')
            ingredientDiv.append(ingredientsList)// adding ingredients list to div
            instructionsDiv.append(instructionsList)
        })
        createIngredientsList(storedRecipes[i].ingredients, i, ingredientsList)//calling the ingredients list function
        cookingInstructions(storedRecipes[i].instructions, i, instructionsList)//calling the instructions list function        
        //===function for close button inside pop up recipe div to close
        $('#close').on('click', () => {//when the close button is clicked  
            popUpDivRecipeName.remove()
            $('#ingredientsDiv > ul').remove()//I need the ingredients created ul to be removed to hav blank space for next recipe ul to append
            $('#instructionsDiv > ol').remove()//I need the instructions created ul to be removed to hav blank space for next recipe ul to append
            $("#recipeIngredientsInstructions").addClass('hidden')//hide the ppped up div that shows recipes until see recipe link is clicked again
        })
    }//end of for loop
}//end of createRecipes function
createRecipes(storedRecipes)
//=====creating a function to make indgredients list from recipe object array of ingredients
function createIngredientsList(array, i, ingredientsList) {
    array.forEach((item) => {
        let ingredient = document.createElement('li')
        if (item.cut) {//creating if statement to include only ingredients that include cut key avlue
            ingredient.prepend(`${item.amount}: ${item.name} ${item.cut}`)
        } else {//for ingredient items that do not include a cut key value
            ingredient.prepend(`${item.amount}: ${item.name} `)
        }
        ingredientsList.append(ingredient)
    });//end of for each function
}//end of ingredientsList function
//=====creating a function to make instructions list
function cookingInstructions(array, i, instructionsList) {
    array.forEach((item) => {
        let cookingSteps = document.createElement('li')
        cookingSteps.prepend(`${item}`)
        instructionsList.append(cookingSteps)
    })//end of foreach function
}//end of cokkinginstructInsructions function
// create construction for ingredients for user entered recipe form
class Ingredient {
    constructor(amount, name, cut) {//creating constructor function with perameters for keys in ingredient object
        this.name = name,
            this.amount = amount,
            this.cut = cut
    }
}
let ingredients = []
let instructions = []
// on click to add new ingredient object in  to array of ingredients
$('#addIngredient').on('click', function (e) {
    e.preventDefault()
    let cut = $('#ingredientCut').val();
    let name = $('#ingredientName').val();
    let amount = $("#ingredientAmount").val();
    let amountMeasurement = $('select option:selected').val()
    let newIngredient = new Ingredient(amount, name, cut) // creating variable to represent the new ingredient and its peramerteres
    ingredients.push(newIngredient)
    let userIngredient = document.createElement('li');
    userIngredient.classList.add('userRecipeIngredient')
    $('#userIngredientList').append(userIngredient);
    userIngredient.append(`${newIngredient.amount} ${amountMeasurement} ${newIngredient.name} ${newIngredient.cut}`)
    //replacing the values of the text inout areas and replaciing the placeholders so boxes will return to original setting after ingredient is added for user to enter new ingredient 
    $('#ingredientCut').attr('placeholder', 'e.g.: chopped').val('')
    $('#ingredientName').attr('placeholder', 'e.g.: onions').val('');
    $("#ingredientAmount").attr('placeholder', 'e.g.: 2').val('');
})
//on click to add cooking steps to array of instructions
$('#addCookingStep').on('click', function (e) {
    e.preventDefault()
    let userInstructionStep = $('#cookingInstructions').val()
    instructions.push(userInstructionStep)
    let userInstruction = document.createElement('li');
    userInstruction.classList.add('userCookingSteps')
    userInstruction.append(userInstructionStep)
    $('#userInstructionList').append(userInstruction)
    //replacing the values of the text inout areas to empty strings so boxes will be blank after ingredient is added for user to enter new ingredient 
    $('#cookingInstructions').val('')
})
//creating a class for constructing users added recipes:
class Recipe {
    image = '../assets/images/seasonings.jpg ' //setting image for users recipes until can code how to let them upload their own picture
    constructor(title, ingredients, instructions) { // setting perameters for what the recipe object should look like
        this.title = title,
        this.ingredients = ingredients
        this.instructions = instructions
    }
}
//creating the onclick function to add the users recipe
$("#addUsersRecipe").click(function (e) {
    e.preventDefault();
    let title = $('#recipeName').val()
    let newRecipe = new Recipe(title, ingredients, instructions)// declaring variable to hold new recipe info
    storedRecipes.push(newRecipe)
    localStorage.setItem('recipesOne', JSON.stringify(storedRecipes)) //resetting the new array with pushed items in to recipesOne in slocal storage so when its pulled later it includes the new users recipe       
    $('#recipeName').attr("placeholder", "e.g. Fried Rice").val('') // replacing placeholder in fields
    let userRecipeIngredient = document.querySelectorAll('.userRecipeIngredient')
    userRecipeIngredient.forEach(item => item.remove())
    let userCookingSteps = document.querySelectorAll('.userCookingSteps')
    userCookingSteps.forEach(item => item.remove())
    let divs = document.querySelectorAll('.recipeRows')
    divs.forEach(item => {
        item.remove()
    })
    createRecipes(storedRecipes)
    //end of onclick function for add users recipe to recipes
})
//create onclick function for create menu page button
$('#createMenu').on('click', function () {
    //cycling through the checkboxes to make sure a meal is selected to eaither create their menu or pop up the alert div that lets them know to select meals
    document.querySelectorAll(".selectMeal").forEach((item) => {
        if (item.checked) {
            $('#createMenu > a').attr('href', 'menu.html')
        }
        if (!item.checked) {
            $('#alertUserToSelectMeals').show()
            //when alert div shows set up on click to get back to meals screen normal
            $('#goBackToSelectmealsButton').on('click', () => { $('#alertUserToSelectMeals').hide() })
        }
        let usersMealChoices = JSON.stringify(menuMeals)
        localStorage.setItem('selectedMeals', usersMealChoices)
    })
})