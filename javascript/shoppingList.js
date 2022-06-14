$(() => {
    let ingredientsToBePurchased = JSON.parse(localStorage.getItem("neededIngredientsFromRecipes"))
    let addDateToShoppingList = JSON.parse(localStorage.getItem('dateIngriedentsNeededListWasMade'))
    $('#displayDateShoppingListWasMade').append(addDateToShoppingList)//****not working */
    if (!localStorage.neededIngredientsFromRecipes) {//if there is no local staorage then
        window.localStorage.setItem('neededIngredientsFromRecipes', recipeObject)//store set stringified recipe/ recipeObject to recipeOne in local storage: so that recipes doesnt get saved twice
    }
    //adding each of the items the user still needs to shopping list
    ingredientsToBePurchased.forEach((item, i) => {
        let listItem = $('<li class="shoppingListItem">')
        $(listItem).attr('id', `${i}`)
        let removeItemButton = $('<button class="removeItemFromListButton">X</button>')
        listItem.append(removeItemButton, item)
        $('#shoppingListPlace').append(listItem)
    })
    //pulling values from user entering in other needed items and adding them to shpping list
    $('#addItemToShoppingListButton').on('click', (i) => {
        let newListItem = $('<li class="shoppingListItem">')
        let removeItemButton = $('<button class="removeItemFromListButton">X</button>')
        newListItem.append($('#otherNeededItem').val())
        $(newListItem).attr('id', `${i}`)
        ingredientsToBePurchased.push($('#otherNeededItem').val())
        $('#shoppingListPlace').append(removeItemButton, newListItem)
        $('#otherNeededItem').val(' ')
        localStorage.setItem("neededIngredientsFromRecipes", JSON.stringify(ingredientsToBePurchased))
        window.location.reload()// needed so that li iems added up under li item will refresh and be own li item....dont know why li append to other li when targeted to append to ul.....???
    })
    //creating onclick for the remove item buttons to remove items from the shopping list and the local storge and resetting local storage without already purchased/removed items
    document.querySelectorAll('.removeItemFromListButton').forEach((item) => {
        $(item).on('click', () => {
            item.parentElement.remove() //this is removing the item from the list you see on screen the li
            const deleteItemById = () => {  //creating a function to delete the item from array of items to be purchased by the id which is set to the corrsponding array index
                let itemsToBePurchased = JSON.parse(localStorage.getItem("neededIngredientsFromRecipes"))//grabbing the array fromlocal storage                
                let updatedItemsToBePurchased = itemsToBePurchased.filter((elem, i, ) => { //filtering the array that the list is made from
                    if (item.parentElement.id != i) { // if the "remove item button" that was clicked parent elememt id(which is the tag the button is wrapped in whos id is the corrsponding array index #)doesnt matchdoesnt match any of the array index #(which it will only match one and thats the one we want deleted) 
                        return elem// then return the element( so we can keep all the elements we have not"deleted" by on click)
                    }
                })
                localStorage.setItem("neededIngredientsFromRecipes", JSON.stringify(updatedItemsToBePurchased))// resetting the local storage with updated(deleted) items for list
                window.location.reload() //to reload and get correct array
            }
            deleteItemById()
        })
    })
    $("#printShoppingListButton").on('click', () => {
        let shoppingListToPrint = document.querySelector('#shoppingListDiv')
        window.print(shoppingListToPrint)
    })
})