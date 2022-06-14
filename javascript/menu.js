$(() => {
    let MenuForTheWeek = JSON.parse(localStorage.getItem('selectedMeals'))
    //====================== creating menu for the week by Displaying users meals they have selected ======================================================
    let recipeDiv = $('<div class="col-md-7 " id="recipeDetialsDiv">')
    $(recipeDiv).appendTo($('.thisWeeksMenuMeals'))
    let recipeDetialsToDisplayDiv = $('#thisWeeksSelectedMealDetialsDisplay')
    MenuForTheWeek.forEach((item, i) => {
        let divForRecipeNameAndDeleteButton = $('<div>')
        let recipeName = $('<p class="mealName">')
        let removeRecipeFromMenuButton = $('<button class="removeRecipeFromMenuButton">X</button>')
        $(removeRecipeFromMenuButton).attr("id", `${i}`)
        //creating onclick for removeMealFromMenu button next to recipe name         
        $(removeRecipeFromMenuButton).on('click', () => {
            if ($(removeRecipeFromMenuButton).siblings().text() === item.title) {
                $(divForRecipeNameAndDeleteButton).remove();
                MenuForTheWeek.splice(i, 1) //removing the already cooked meal from the array so wont show up on page reload
                localStorage.setItem('selectedMeals', JSON.stringify(MenuForTheWeek)) //resettinmg the array in local storage
            }
        })
        //end of onclick function for removeRecipeFrom MeuButton  
        recipeName.text(item.title)
        divForRecipeNameAndDeleteButton.prepend(removeRecipeFromMenuButton)
        $(recipeName).appendTo(divForRecipeNameAndDeleteButton)
        $(divForRecipeNameAndDeleteButton).appendTo(recipeDiv)
        let popUpDivRecipeName = document.createTextNode(item.title)
        //======creating onclick function for individual recipe detials to pop up so user can cook=============
        $(recipeName).on('click', () => {
            $(recipeDetialsToDisplayDiv).removeClass('hidden')
            recipeDetialsToDisplayDiv.prepend(popUpDivRecipeName)
            item.ingredients.forEach((ingredientItem) => {    //cycling through ingredient arry to create list             
                let eachIngredient = $('<li class="ingredientItem">')//creating li to attach item
                let checkbox = $('<input type="checkbox" class="ingredientCheckbox">')
                if (ingredientItem.cut) {//creating if statement to include only ingredients that include cut key avlue
                    eachIngredient.prepend(`${ingredientItem.amount}: ${ingredientItem.name} ${ingredientItem.cut}`)//adding ingredient key values to li
                } else {//for ingredient items that do not include a cut key value
                    eachIngredient.prepend(`${ingredientItem.amount}: ${ingredientItem.name} `)//adding ingredient key values to li
                }//end of if statement
                $(eachIngredient).prepend(checkbox)
                $('#thisWeeksMealIngredients').append(eachIngredient)
            })
            //cycling through instructions to make a list
            item.instructions.forEach((cookingstep) => {
                let eachInstruction = $('<li class="cookingStep">')//creating li to attach item 
                eachInstruction.prepend(cookingstep)
                $('#thisWeeksMealCookingInstructions').append(eachInstruction)
            })
        })
        //onclick for close button inside detials div
        $('#close').on('click', () => {//when the close button is clicked
            popUpDivRecipeName.remove()
            document.querySelectorAll(".ingredientItem").forEach(item => item.remove())
            document.querySelectorAll('.cookingStep').forEach(item => item.remove())
            $(recipeDetialsToDisplayDiv).addClass('hidden')//hide the ppped up div that shows recipes until see recipe link is clicked again
        })
    })// end of displaying users menu for the week
    //========creating an array with every ingredient from all recipes the userr chose for the week to be able to go thruough them later to make a check list for pre shopping list reason
    let everyIngredientFromThisWeeksMenu = []
    MenuForTheWeek.forEach((item) => {
        item.ingredients.forEach((ingredientObject) => {
            everyIngredientFromThisWeeksMenu.push(ingredientObject)
        })
    })//end of creating the ingredients array
    //=======creating a function that gathers all ingredients and amounts: and gets them ready to put in a check list   
    let calculatedAmountIngredients = []
    function addingIngredientsToGetReadyForUsersIngredientCheckList(array) {
        //creating key to tatrget ingredient names
        let checkedArray = array.map((item => item.name)).filter((item, i, self) => {
            return self.indexOf(item) === i
        })
        //=======creating conversion function to brimg all measurments down to lowest measurment to add properly
        const foodMeasurmentConversionLowestMeasurment = (food) => {
            if (food.includes('lbs')) {  // from lbs to oz
                return `${parseFloat(food) * 16}oz`
            } else if (food.includes('cup')) { //for all other measurements down to tsp
                return `${parseFloat(food) * 48}tsp`
            } else if (food.includes('Tbsp')) {
                return `${parseFloat(food) * 3}tsp`
            } else {
                return food
            }
        }
        //=======creating conversion function to bring all measurments back up to the highesr measurment
        const foodMeasurmentConversionToHighestMeasuremnt = (food) => {
            let whole, partial, measure, measure2
            if (food.includes('tsp')) {
                if (parseInt(food) >= 48) {
                    whole = Math.floor(parseInt(food) / 48)
                    //if the reamining tsp === 0 the partial = 0 else divide by 48 then fix 2 decimalthen stringand split at . so when next to whole it removes the 0 before .###### and set partial to outcome
                    partial = (parseFloat(food) % 16) === 0 ? 0 : ((parseFloat(food) % 16) / 48).toFixed(2).toString().split('.')[1]
                    measure = 'cups'
                } else if (parseInt(food) >= 3) {
                    whole = Math.floor(parseInt(food) / 3)
                    //determining if there are left over tsp when converted to Tbsp: then need another measurement for the left over tsp
                    partial = parseInt(food) - (whole * 3) > 0 ? parseInt(food) - (whole * 3) : 0
                    measure = 'Tbsp'
                    measure2 = 'tsp'
                } else {
                    whole = parseFloat(food)
                    measure = 'tsp'
                }
            } else if (food.includes('oz')) {
                if (parseInt(food) >= 16) {
                    whole = Math.floor(parseInt(food) / 16)
                    partial = ((parseFloat(food) % 16) / 16).toString().split('.')
                    measure = 'lbs'
                } else {
                    whole = parseInt(food)
                    partial = 0
                    measure = 'oz'
                }
            } else {
                return food
            } if (measure2) { // if there was left over tsp for Tbsp conversion above display them if not dont
                return partial ? `${whole} ${measure} and ${partial} ${measure2}` : `${whole} ${measure} `
            } else {
                return partial ? `${whole}.${partial} ${measure}` : `${whole} ${measure}`
            }
        }
        //=========creating forEach to loop through and grab ingredients that are double and grabbing their amounts to be added
        checkedArray.forEach((item) => {
            let ingredientsToBeTotaled = array.filter(ingredientItem => ingredientItem.name === item)
            //mapping to add the amount of ingredients together for a totaled sum
            let totaledAmount = 0
            let measurement
            ingredientsToBeTotaled.map(item => {
                totaledAmount += parseFloat(foodMeasurmentConversionLowestMeasurment(item.amount))
                if (foodMeasurmentConversionLowestMeasurment(item.amount).includes('oz')) {
                    measurement = 'oz'
                } else if (foodMeasurmentConversionLowestMeasurment(item.amount).includes('tsp')) {
                    measurement = 'tsp'
                } else {
                    measurement = ''
                }
            })
            //setting
            let fullyConvertedMeasure = `${totaledAmount} ${measurement}`
            let totaledAmountIngredient = {
                name: item,
                total: foodMeasurmentConversionToHighestMeasuremnt(fullyConvertedMeasure),
            }
            calculatedAmountIngredients.push(totaledAmountIngredient)
        })
        return calculatedAmountIngredients
    }
    addingIngredientsToGetReadyForUsersIngredientCheckList(everyIngredientFromThisWeeksMenu)
    //end of function to prep ingredients and amounts for check list function
    //=====creating actual checklist of ingredients for user to go through, check off ingredients as they check their cabinets and fiund ingredients, whats left over will be puyshed to an array and local storage for a shopping list to be created
    function createCheckList(array) {
        array.forEach((item, i) => {
            let checkbox = $('<input type="checkbox" class="ingredientCheckbox">')
            let listItem = $('<li class="checkListIngredient">')
            $(checkbox).attr("value", `${item.total}  ${item.name}`)
            $(listItem).text(`${item.total} ${item.name}`)
            $(listItem).prepend(checkbox)
            //splitting ingredients list up in between two ul by odd and even index numbers            
            if (i % 2) {
                $('#ingredientsToBeCheckedByUser1').append(listItem)
            } else {
                $('#ingredientsToBeCheckedByUser2').append(listItem)
            }
        })
    }
    createCheckList(calculatedAmountIngredients)
    let shoppingListItems = []
    //createing shopping list of all items that userr does not have, all the unchecked items from recipes
    $('#createShoppingListLink').on('click', () => {
        let dateListIsMade = new Date().toDateString();
        let dateShoppingListWasMade = JSON.stringify(dateListIsMade)
        localStorage.setItem("dateIngriedentsNeededListWasMade", dateShoppingListWasMade)
        document.querySelectorAll('.ingredientCheckbox').forEach((item, i) => {
            if (!item.checked) {
                shoppingListItems.push(item.value)
            }
            let neededIngredients = JSON.stringify(shoppingListItems)
            localStorage.setItem("neededIngredientsFromRecipes", neededIngredients)
        })
        $('#ingredientCheckListForCreatingShoppingList').classList.add('hidden')
    })
    // on click for view checklist button
    $('#checklistDisplayButton').on('click', () => {
        $("#ingredientCheckListForCreatingShoppingList").removeClass('hidden')
    })
    //onclick for close button inside the checklist to just close div if opened without the intent of creating shopping list
    $('#closeCreateShoppingListButton').on('click', () => {
        $("#ingredientCheckListForCreatingShoppingList").addClass('hidden')
    })
})  // end of document.ready function