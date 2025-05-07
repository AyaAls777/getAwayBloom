"use strict"

//get the list of vacation from local storage
let vacationList = retrieveLSData(LIST_PLAN_KEY);

/**
 * details function
 * Runs when the user click the details button on the listOfPlans page.
 * Storing that particullar plan index so that the user can veiw in more detail in the more detail page and redirect the user to the more detail page
 * @param {*} listOfPlansIndex index number for listOfPlans
 */
function details(listOfPlansIndex) {
    //store data in LS
    localStorage.updateLSData(PLAN_KEY, listOfPlansIndex);

    //redirect to more detail page
    window.location = "moreDetail.html";
}

/**
 * toHomePage function
 * Runs when click on the back button
 * Rediract the user to the home page
 */
function toHomePage()
{
    //redirect to home page
    window.location = "index.html";
}

/**
 * planStatus function
 * Runs when the function is called
 * Color the date text to determine the upcoming event or past event
 * @param {*} date date of that particular plan from the list of plans
 * @returns return the colour style 
 */
function planStatus(date) {

    // the current of now date to compare with the plan date
    let currentDate = new Date();
    // the plan date
    let planDate = new Date(date);

    //get the difference
    let diff = currentDate - planDate;

    //if difference is positive then plan is passed already, 
    //if difference is negative then plan is upcoming
    if (diff > 0) {
        // red colour means event is passed
        return style = "color:red;"
    }
    else if (diff <= 0) {
        //green colour means event is upcoming
        return style = "color:green;"
    }
}

/**
 * disp;ayListOfPlans function
 * Run when the function is called
 * Create new rows of plans based on the list of plans
 * @param {*} vacationList the entire list of plans class
 */
function displayListOfPlans(vacationList) {
    let output = "";

    //Lastest saved vacation will always be in the last array
    //get the list of vacation index length, so that you get the last/latest plan
    //minus 1 to get the index valu not the length value
    let indexLength = vacationList.length - 1;
    let data = indexLength;


    //Create new rows for each plan in the listOfPlans
    //Start from the last array element which is the latest saved vacation then decrement 
    for (let i = data; i >= 0; i--) {

        //get the plan based on i
        let plan = vacationList.getPlan(i);
        let planDetails = plan.details;

        output += `<tr>
        <td>
            <!--Vacation details-->
            <h4>${plan.name}</h4>
            <p><b>Date: </b><label ${planStatus(planDetails.date)}>${planDetails.date}</label></p>
            <p><b>Starting Location: </b>${planDetails.listOfPOIs[0].locationName}</p>
            <p><b>Vehicle: </b>${planDetails.vehicleType[0].type}</p>
            <p><b>Total Distance: </b>${planDetails.totalDistance}</p>
            <p><b>Number of Stops: </b>${planDetails.numberOfStops}</p>
        </td>
        <td>
            <!--calld the function to save the data and redirect to the more detail page-->
            <button
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                onclick=${details(i)} data-upgraded=",MaterialButton,MaterialRipple">Details<span
                    class="mdl-button__ripple-container"></button>
            
        </td>
    </tr>`
    }
}

//display the list of plans when the page loads
displayListOfPlans(vacationList);


