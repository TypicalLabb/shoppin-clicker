var cash = 0
var cashRate = 0

// Every item in the game
// TODO: items should be part of the Game variable
var items = [
  {
    "name": "item_Cashiers",
    "price": "5"
  },
  {
    "name": "item_Registers",
    "price": "15"
  },
  {
    "name": "item_Shelfs",
    "price": "20"
  },
  {
    "name": "item_Stockers",
    "price": "50"
  },
  {
    "name": "item_Advertise",
    "price": "100"
  },
  {
    "name": "item_Billboard",
    "price": "150"
  },
  {
    "name": "item_Tuber Ads",
    "price": "250"
  },
  {
    "name": "item_Sponsors",
    "price": "300"
  },
  {
    "name": "item_Bakerys",
    "price": "500"
  },
  {
    "name": "item_Bakers",
    "price": "600"
  },
  {
    "name": "item_Store Upgrade",
    "price": "800"
  },
  {
    "name": "item_Staff Manager",
    "price": "1000"
  },
  {
    "name": "item_Black Friday",
    "price": "5000"
  },
  {
    "name": "item_Collab",
    "price": "10000"
  },
  {
    "name": "item_Clients",
    "price": "50000"
  },
  {
    "name": "item_Cars",
    "price": "100000"
  },
  {
    "name": "item_Consoles",
    "price": "1000000"
  },
  {
    "name": "item_Karens",
    "price": "100000000"
  }
]

// Rate is null (at the beginning)
var cSec = null;

// If there is no bitcoins Item in the localStorage, create one.
// If there is one, do the other thing.
if(localStorage.getItem("cash") === null){
  // cash are 0
  cash = 0

  // Set the localStorage Item for the first time
  localStorage.setItem("cash", "0");

  // Write the current amount of Bitcoins on the page
  $(".cashAmount").text(cash.toFixed(8))

}else{

  // Get the amount of Bitcoins and parse them to a float number
  cash = parseFloat(localStorage.getItem("bitcoins"))

  $(".cashAmount").text("loading...")
  $(".peopleAmount").text("loading...")

  let people = cash * 100000000;

}

/**
 *
 *  <-- Setting up the game´s functions -->
 *
 */



// Game variable which will contain any needed major function or needed variables for the game.
var Game = {}


// Every constant variable is saved here
Game.GameConst = {
  "priceMultiplier": 1.20,
  "VERSION": "0.0.1"
}

Game.units = [
      "Million",
      "Billion",
      "Trillion",
      "Quadrillion",
      "Quintillion",
      "Sextillion",
      "Septillion",
      "Octillion",
      "Nonillion",
      "Decillion",
      "Undecillion",
      "Duodecillion",
      "Tredecillion",
      "Quattuordecillion",
      "Quindecillion",
      "Sexdecillion",
      "Septdecillion",
      "Octodecillion",
      "Novemdecillion",
      "Vigintillion",
      "Unvigintillion",
      "Duovigintillion",
      "Trevigintillion",
      "Quattuorvigintillion",
      "Quinvigintillion",
      "Sexvigintillion",
      "Septvigintillion",
      "Octovigintillion",
      "Novemvigintillion",
      "Trigintillion"
]



/**
 * Calculating every price for the items when the game was started (and if there are any items).
 *
 * @param element {HTMLElement} - The HTML element of the item on the game page
 * @param price {Number} - The price of the item, got from the items Object
 * @param itemAmount {Number} - The current amount of the item, saved in the localStorage
 */

Game.setPriceAtGameBeginning = function (element, price, itemAmount) {

  // Calculation of the price
  var multiplier = Game.GameConst.priceMultiplier

  // Calculate the new price -> price * multiplier^itemAmount
  var calculation = (parseFloat(price) * Math.pow(multiplier, parseInt(itemAmount))).toFixed(8)

  // Showing the actual price
  element.children()[2].textContent = calculation + " cash"

  // Set the data-price attribute with the new price
  element.attr("data-price", calculation.toString())

}



/**
 * Function to increase the amount of the item (in the localStorage) with the specific identifier.
 *
 * @param id - The identifier of the item (the id from the list element)
 */
Game.itemAction = function (id) {

  var item = id
  var itemAmount = 0;

  if(localStorage.getItem(item) === null){
    localStorage.setItem(item, "1");
  }else{
    itemAmount = parseInt(localStorage.getItem(item))

    localStorage.setItem(item, "" + (itemAmount + 1) + "");

  }

}



/**
 * Calculating the cash per Second - rate when the page was opened.
 *
 */
Game.setcashPerSecondRateAtBeginning = function () {

  for(var i = 0; i < items.length; i++){
    if(localStorage.getItem(items[i].name) === null){
      localStorage.setItem(items[i].name, "0")
    }else{
      // HTML element on the game page
      var $element = $("#" + items[i].name)

      // Amnount of the item
      var itemAmount = localStorage.getItem(items[i].name)

      // Writing the amount on the page at the item´s element
      $element.children()[0].textContent = itemAmount

      // Only calculate the new price if there is more than 0 items.
      // If there are not enough items, it will just continue, and if there are,
      // it will execute the function and continue after it as well.
      if(itemAmount > 0) {
        Game.setPriceAtGameBeginning($element, parseFloat(items[i].price), parseInt(itemAmount))
      }

      // Getting the data-bits-per-sec attribute, needed for calculating the bitcoin/sec rate
      var cash_per_sec = $element.attr("data-bits-per-sec")
      itemAmount = parseInt(itemAmount)

      // The rate before
      var before = cashRate

      // Calculating the rate
      cashRate = cashRate + (itemAmount * cash_per_sec)

      // Logging the calculation in the console
      console.log("i = " + i + " | B/sec before: " + before.toFixed(8) +
        " - Calculation made: " + before.toFixed(8) + " + (" + itemAmount + " * " + cash_per_sec + ") = " +  cashRate.toFixed(8) +
        " | New B/sec at " + cashRate.toFixed(8))
    }
  }

}



/**
 * Function which sets a new "Bitcoin per Second" rate
 *
 * @param rate - The number which must be added to the current Bitcoin per Second - rate
 * @returns {Number} - Returning the new Bitcoin per Second - rate
 */
Game.setNewcashRate = function (rate) {

  // Logging the new Bitcoin per second rate
  console.log("setNewcashRate -> New rate: " + (cashRate + rate).toFixed(8) )

  // Showing the new rate on the page
  // Rounding at specific values
  if((cashRate + rate) >= 1000000) {
    $(".cSecRateNumber").text((cashRate + rate).toFixed(0).optimizeNumber())
  }else if((cashRate + rate) >= 1000 ){
    $(".cSecRateNumber").text((cashRate + rate).toFixed(0))
  }else if((cashRate + rate) >= 1 ){
    $(".cSecRateNumber").text((cashRate + rate).toFixed(2))
  }else{
    $(".cSecRateNumber").text((cashRate + rate).toFixed(8))
  }

  // Returning the new rate
  return cashRate = cashRate + rate;

}



/**
 * This function will check if there is any change in the localStorage,
 * especially looking at the item amount. So it will actually calculate every price again and
 * again. (This function should be recoded)
 *
 * TODO: Find a better way for setting the price after an item was bought.
 */
Game.setNewPrice = function()
{
  // for-loop for getting the price multiplier and to calculate the new price
  for(var i = 0; i < items.length; i++){
    if(localStorage.getItem(items[i].name) === null){
      localStorage.setItem(items[i].name, "0")
    }else{
      var $element = $("#" + items[i].name)
      var itemAmount = localStorage.getItem(items[i].name)

      $element.children()[0].textContent = itemAmount

      // Only calculate if there is more than 0 items
      if(itemAmount > 0) {

        // Calculation of the price
        var multiplier = Game.GameConst.priceMultiplier
        var calculation = (parseFloat(items[i].price) * Math.pow(multiplier, parseInt(itemAmount))).toFixed(8)

        // Showing the actual price
        $element.children()[2].textContent = calculation + " cash"

        // Set the data-price attribute with the new price
        $element.attr("data-price", calculation.toString())

      }
    }
  }
  // End of the for-loop
}

/**
 * The function which adds new generated cash to the current Bitcoin amount.
 *
 * @param rate - The cash per second rate; Needed for adding the generated Bitcoins every second
 */
Game.cSecFunction = function (rate) {

  cash = cash + rate

  // Show both values on the page
  // Rounding the bitcoin number at specific set values
  if(cash > 1000000){

    let cashUnitNumber = cash.optimizeNumber()

    $(".cashAmount").text(cashUnitNumber)
  }else if(cash >= 1000){
    $(".cashAmount").text(cash.toFixed(0))
  }else if(cash >= 1){
    $(".cashAmount").text(cash.toFixed(2))
  }else{
    $(".cashAmount").text(cash.toFixed(8))
  }


  // Rounding the satoshis amount at a specific value and optimize it for displaying on the screen.
  var people = cash * 100000000;

  if(people < 1000000) {
    $(".peopleAmount").text(Math.round(people))
  }else{

    let peopleUnitNumber = people.optimizeNumber()
    $(".peopleAmount").text(satoshiUnitNumber)
  }

  // Save bitcoin amount in the storage
  localStorage.setItem("cash", "" + cash + "")

  console.log("cSec -> C/sec at " + rate.toFixed(8))

}

/**
 * Stops the c/sec interval.
 */
Game.stopcsec = function () {
  clearInterval(cSec)
}

/**
 * Function for optimizing the number with an unit for displaying it on the screen.
 *
 * @returns {string} An optimized number as a string with its unit
 */
Game.optimizeNumber = function () {
  if(this >= 1e6){
    let number = parseFloat(this)
    let unit = Math.floor(parseFloat(number.toExponential(0).toString().replace("+", "").slice(2)) / 3) * 3

    // let test = this.toExponential(0).toString().replace("+", "").slice(2)
    // console.log(test)

    var num = (this / ('1e'+(unit))).toFixed(2)

    var unitname = Game.units[Math.floor(unit / 3) - 1]

    return num + " " + unitname
  }

  return this.toLocaleString()
}

Number.prototype.optimizeNumber = Game.optimizeNumber
String.prototype.optimizeNumber = Game.optimizeNumber

/**
 * Resets the game
 */
Game.resetGame = function () {
  Game.stopcsec()
  localStorage.setItem("cash", "0")
  localStorage.clear()
  location.reload()
}

// --------------------------------------------------- //

/**
 * <-- Now doing everything -->
 */


// Calculates the Bitcoin/sec rate with the amount of every item multiplied with their given Bitcoins/second rate.
Game.setcashPerSecondRateAtBeginning()

// Stating the interval with the calculated Bitcoin/second rate.
cSec = setInterval(function () {
  Game.bSecFunction(cashRate);
}, 1000)


// Doing everything here when the game is ready to be used.
$(document).ready(function () {

  // Write the version into the .version span element
  $(".version").text("Version " + Game.GameConst.VERSION)

  // Write the bitcoin per second rate into the .bSecRateNumber span element
  if(cashRate >= 1000){
    $(".cSecRateNumber").text(cashRate.toFixed(0))
  }else if(cashRate >= 1 ){
    $(".cSecRateNumber").text(cashRate.toFixed(2))
  }else{
    $(".cSecRateNumber").text(cashRate.toFixed(8))
  }


  // If clicked on the big Bitcoin
  $(".cash").click(function () {

    // Add 1^-8 cash (equal to 1 people)
    cash = cash + 0.00000001

    // Show the new number on the page
    if(cash > 1000000){

      let cashUnitNumber = cash.optimizeNumber()
      $(".cashAmount").text(cashUnitNumber)

    }else if(cash >= 1000){
      $(".cashAmount").text(cash.toFixed(0))
    }else if(bitcoins >= 1){
      $(".cashAmount").text(cash.toFixed(2))
    }else{
      $(".cashAmount").text(cash.toFixed(8))
    }

    if((cash * 100000000) < 1000000) {
      $(".peopleAmount").text(Math.round((cash * 100000000)))
    }else{

      let peopleUnitNumber = (cash * 100000000).optimizeNumber()
      $(".peopleAmount").text(peopleUnitNumber)
    }

    // Save the new amount of Bitcoins in the localStorage storage
    localStorage.setItem("cash", "" + cash + "")

  });


  // If any item from the list was clicked...
  $(".purchaseItem").click(function () {

    // Get following attributes and children elements

    // id of the item
    var id = $(this).attr("id")

    // The price attribute as a float number
    var price = parseFloat($(this).attr("data-price"))

    // The b/sec attribute from the item as a float number
    var cashPerSecond = parseFloat($(this).attr("data-bits-per-sec"))

    // The element which shows how many of the item is existing
    var amountDisplay = $(this).children()[0]
    var amountDisplayAmount = parseInt(localStorage.getItem(id))

    var priceDisplay = $(this).children()[2]

    // If you have enough Bitcoins, it´ll buy one item
    if(parseFloat(cash.toFixed(8)) >= price){

      // Substract the price from the current Bitcoin number and set it to the bitcoins variable.
      cash = parseFloat(cash.toFixed(8)) - price

      // Save the new amount of Bitcoins in the localStorage storage
      localStorage.setItem("cash", "" + cash + "")

      // Changing amount number on the right of the item
      amountDisplayAmount = amountDisplayAmount + 1
      amountDisplay.textContent = amountDisplayAmount.toString()

      // Changing the Bitcoins amount
      // Rounding the Bitcoin number at specific values
      if(cash > 1e6){

        let cashUnitNumber = cash.optimizeNumber()
        $(".cashAmount").text(cashUnitNumber)

      }else if(cash >= 1000){
        $(".cashAmount").text(cash.toFixed(0))
      }else if(bitcoins >= 1){
        $(".cashAmount").text(cash.toFixed(2))
      }else{
        $(".cashAmount").text(cash.toFixed(8))
      }

      // Calculation the Satoshi amount
      if((cash * 100000000) < 1e6) {
        $(".peopleAmount").text(Math.round((cash * 100000000)))
      }else{

        let peopleUnitNumber = (cash * 100000000).optimizeNumber()
        $(".peopleAmount").text(peopleUnitNumber)

      }

      // Increasing the amount of the specific item
      Game.itemAction(id)

      // Stops the interval
      Game.stopcsec()

      // Setting a new price and show it
      Game.setNewPrice()

      // Saving the new calculated Bitcoin/second rate in a variable
      var newRate = Game.setNewcashRate(cashPerSecond)

      // Restarting the interval with the new rate
      cSec = setInterval(function () {
        Game.cSecFunction(newRate);
      }, 1000)

    }

  })

  //
  // If the reset button was pressed, do following thing
  $(".resetButton").click(function () {
    Game.resetGame()
  })

});


