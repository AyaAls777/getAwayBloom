"use strict";

mapboxgl.accessToken = MAPBOX_KEY
let map = new mapboxgl.Map({
    container: 'map',
    center: [101.5889357, 3.1110193],
    zoom: 16,
    style: 'mapbox://styles/mapbox/streets-v11'
});

//Array to store the input addresses
let listOfAddressInput = [];

//testing for listOfAddressInput
// console.log(listOfAddressInput);
// console.log(listOfAddressInput[0]);

let listOfAddressCoordinate = [];
// console.log(listOfAddressCoordinate);

for (let i = 0; i < listOfAddressInput.length; i++) {
    // call opencage forward geocoding API using wrapper
    sendWebServiceRequestForForwardGeocoding(listOfAddressInput[i], "processData");

}
// Note that call should provide the function name as a string
function processData(data) {
    // data
    let location = {

        locationName: "Custom",
        coordinates: [data.results[0].geometry.lng, data.results[0].geometry.lat],
        description: data.results[0].formatted,
        categories: "Custom POI"
    }
    listOfAddressCoordinate.push(location);



    // console.log(location.coordinates);

    console.log(data);
}



let currentPosition = [];
//testing for current position
// console.log(currentPosition);

/**
 * Call the getUserCurrentLocationUsingGeolocation function from services.js
 */
getUserCurrentLocationUsingGeolocation(processPosition);

/**
 * processPosition function
 * The callback function for getUserCurrentLocationUsingGeolocation
 * get the corrdinate and push it to the
 * @param {*} lat the latitude result
 * @param {*} lng the longtitude result currentPosition arrey
 */
function processPosition(lat, lng) {

    sendWebServiceRequestForReverseGeocoding(lat, lng, "reverseCallbackForCurrentLacation");

    // currentPosition.push(currentLongtitude);
    // currentPosition.push(currentLatitude);

    //console.log(`lat: ${lat}\nlng: ${lng}`);
}

/**
 * function reverseCallbackForCurrentLacation
 * when the wrapper calls the function 
 * takes a data and organizes it into an object called location and push to the current location array 
 * @param {*} data // data is the result return from the wrapper
 */
function reverseCallbackForCurrentLacation(data) {
    let location = {

        locationName: "Custom",
        coordinates: [data.results[0].geometry.lng, data.results[0].geometry.lat],
        description: data.results[0].formatted,
        categories: "My Location"
    }
    currentPosition.push(location);
    // data
    // console.log(location);
}

/**
 * getMyLocation function
 * Runs when the My Location button is click
 * get the currentPosition coordination and put it as an object then pust to the listOfAddressCoordinate
 */
function getMyLocation() {

    listOfAddressCoordinate.push(currentPosition[0]);

    //calculate the route between two points for all POIs
    routeDistance();

    //Display/refresh the total distance value
    displayTotalDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the number of stops value
    displayNumberOfStops();

    //clear all markers in the map
    removeMarker();

    //Refresh marker layers
    marker();
}

/**
 * addAddress function
 * Run when click on the button Add
 * Get the input address and push it to the listOfAddressInput
 */
function addAddress() {

    let refSearch = document.getElementById("Search");
    let search = refSearch.value;

    if (search.length == 0) {
        listOfAddressInput.push(search);
    }


    //calculate the route between two points for all POIs
    routeDistance();

    //Display/refresh the total distance value
    displayTotalDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the number of stops value
    displayNumberOfStops();


    //clear all markers in the map
    removeMarker();

    //refresh marker layers
    marker();

    // reset the global variable listRouteCoordinates
    listRouteCoordinates.splice(0, listRouteCoordinates.length);

    //refresh route Coordinates
    routeCoordinates();

}

/**
 * clearInput function
 * Run when click on the button Add
 * Clear/empty the input text box
 */
function clearAddAddressInput() {
    let refSearch = document.getElementById("Search");
    refSearch.value = "";

}

let listOfSearchPOI = [];
let searchMarkers = [];

/**
 * searchPOICategories function
 * Runs when the Search button is click
 * Search for POIs near the lastest of last coordinates based on the category selected
 */
function searchPOICategories() {
    //conditional statement to make sure the user enters a address
    if (listOfAddressCoordinate.length == 0) {     
        alert("Please eneter starting location");
    }
    else {

        listOfSearchPOI.length = 0;
        searchMarkers.length = 0;

        let categoryOfSearch = ["attraction", "lodging", "gas station", "food"]

        let refPOICategories = document.getElementById("POICategories");
        let POIcategoriesIndex = refPOICategories.value - 1;

        let query = categoryOfSearch[POIcategoriesIndex];

        let index = listOfAddressCoordinate.length - 1;

        let lng = listOfAddressCoordinate[index].coordinates[0];
        let lat = listOfAddressCoordinate[index].coordinates[1];

        //Call the servicejs to find 10 nearby location based on the category selected and the coordinates
        sendXMLRequestForPlaces(query, lng, lat, successCallback)

        //Remove any previous search markers
        removeSearchMarker();

        addListOfSearchPOI();

        //Refresh the table
        displayPOI();

        //Display/refresh the number of stops value
        displayNumberOfStops();
    }

}

/**
 * successCallback function
 * Runs when called by the searchPOICategories function
 * Push the result data to the listOfSearchPOI array
 * @param {*} data 
 */
function successCallback(data) {

    listOfSearchPOI.push(data.features);

    addListOfSearchPOI();

    //testing
    // console.log(listOfSearchPOI[0]);
}

/**
 * addListOfSearchPOI function
 * Runs when the searchPOICategories function calls it
 * Get the result data location and make a drop down option for the users to choose
 * Will display temporary markers on the map to preview the location
 */
function addListOfSearchPOI() {

    let selectRef = document.getElementById("listOfSearchPOIOption");
    let output = `<option value="none"></option>`;

    for (let i = 0; i < listOfSearchPOI[0].length; i++) {
        output += `<option value="${i}">${listOfSearchPOI[0][i].text}</option>`
    }

    selectRef.innerHTML = output;

    let lng = listOfSearchPOI[0][0].geometry.coordinates[0];
    let lat = listOfSearchPOI[0][0].geometry.coordinates[1];

    let coordinates = [lng, lat];
    map.panTo(coordinates);

    // make temporary markers for list Of Search POI for users to see and choose
    for (let j = 0; j < listOfSearchPOI[0].length; j++) {
        let markerLng = listOfSearchPOI[0][j].geometry.coordinates[0];
        let markerLat = listOfSearchPOI[0][j].geometry.coordinates[1];
        let markerDescription = listOfSearchPOI[0][j].text;

        let searchMarker = new mapboxgl.Marker({
            "color": "#00FFFF"
        });

        searchMarker.setLngLat([markerLng, markerLat]);

        let popup = new mapboxgl.Popup({ offset: 40 });
        popup.setText(markerDescription);

        searchMarker.setPopup(popup);

        // Display the marker.
        searchMarker.addTo(map);

        // Display the popup.
        popup.addTo(map);

        searchMarkers.push(searchMarker);
    }
}

/**
 * removeSearchMarker function
 * Runs when call upon
 * Remoces the temporary search markers on the map
 */
function removeSearchMarker() {

    for (let i = 0; i < searchMarkers.length; i++) {
        searchMarkers[i].remove();
    }
    searchMarkers.length = 0;

}

/**
 * comfirmSearchPOI function
 * Runs when click the confirm button
 * Get the selected POI option value index as reference
 * Find the POI detail based on the value index and push to the listOfAddressCoordinate array
 */
function comfirmSearchPOI() {
    let refSelectedPOI = document.getElementById("listOfSearchPOIOption")
    let selectedPOI = refSelectedPOI.value;

    if (selectedPOI == "none") {
        //remove the temopary search markers on the map
        removeSearchMarker();
    }
    else {
        let name = listOfSearchPOI[0][selectedPOI].text;
        let lng = listOfSearchPOI[0][selectedPOI].geometry.coordinates[0];
        let lat = listOfSearchPOI[0][selectedPOI].geometry.coordinates[1];
        let descript = listOfSearchPOI[0][selectedPOI].place_name;
        let categ = listOfSearchPOI[0][selectedPOI].properties.category;

        let location = {

            locationName: name,
            coordinates: [lng, lat],
            description: descript,
            categories: categ
        }

        listOfAddressCoordinate.push(location);

        map.panTo(location.coordinates);

        //calculate the route between two points for all POIs
        routeDistance();

        //Display/refresh the total distance value
        displayTotalDistance();

        //Display/refresh the remaining distance value
        displayRemainingDistance();

        //Display/refresh the number of stops value
        displayNumberOfStops();

        //remove the temopary search markers on the map
        removeSearchMarker();

        //clear all markers in the map
        removeMarker();

        //refresh marker layers
        marker();

        // reset the global variable listRouteCoordinates
        listRouteCoordinates.splice(0, listRouteCoordinates.length);

        //refresh route Coordinates
        routeCoordinates();

        //refresh the table
        displayPOI()
    }



}

/**
 * panToCurrentLocation function
 * Runs when the pan to current location is click
 * pan the map box to the user location coordinate
 */
function panToCurrentLocation() {
    let lng = currentPosition[0].coordinates[0];
    let lat = currentPosition[0].coordinates[1];

    let userCurrentLocation = [lng, lat];
    map.panTo(userCurrentLocation);
    // console.log(userCurrentLocation);

    //clear all markers in the map
    removeMarker()

    //refresh marker layers
    marker()



}

//Allow the user to click on the map to get their coordinates
map.on('click', processMapClick);

/**
 * processMapClick function
 * Runs when the users click on the map to get the coordinates
 * Call the webservice to get the address
 * @param {*} data the coordinates data
 */
function processMapClick(data) {
    let lng = data.lngLat.lng;
    let lat = data.lngLat.lat;

    sendWebServiceRequestForReverseGeocoding(lat, lng, "reverseCallbackForOnClick")


    // coordinate object
    // console.log(data.lngLat);
}

function reverseCallbackForOnClick(data) {
    let location = {

        locationName: "Custom",
        coordinates: [data.results[0].geometry.lng, data.results[0].geometry.lat],
        description: data.results[0].formatted,
        categories: "Custom POI"
    }
    listOfAddressCoordinate.push(location)

    //clear all markers in the map
    removeMarker()

    //Refresh marker layers
    marker()

    // reset the global variable listRouteCoordinates
    listRouteCoordinates.splice(0, listRouteCoordinates.length);

    //Refresh the varaible 
    routeCoordinates()
    // data
    // console.log(location);
}

let markersCoordinates = [];

/**
 * removeMarker function
 * When called will remove all the markers that are in the markersCoordinates array
 */
function removeMarker() {

    for (let j = 0; j < markersCoordinates.length; j++) {
        markersCoordinates[j].remove();
    }
    markersCoordinates.length = 0;

}

//marker for map
// Create new markers.
function marker() {

    for (let i = 0; i < listOfAddressCoordinate.length; i++) {
        let location = listOfAddressCoordinate[i];
        let marker = new mapboxgl.Marker({ "color": "#FF8C00", draggable: true });
        marker.setLngLat(location.coordinates);

        let popup = new mapboxgl.Popup({ offset: 40 });
        popup.setText(location.description);

        marker.setPopup(popup);

        // Display the marker.
        marker.addTo(map);

        // Display the popup.
        popup.addTo(map);

        markersCoordinates.push(marker);
        // console.log(location);
    }

    displayPOI()

    // console.log(markersCoordinates)
}

/**
 * Function onDragEnd
 * Updating the information of the marker
 */
function onDragEnd() {
    const lngLat = marker.getLngLat();
    console.log(lngLat)

    //displaying the marker at the new
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;

    //getting the information for the new location
    let newLocation = sendWebServiceRequestForReverseGeocoding(lngLat.lat, lngLat.lng)

    //Changing the information of the last location to the new draged location
    let index = listOfAddressCoordinate.length - 1;
    listOfAddressCoordinate[index] = newLocation;

    //displaying the new information
    displayPOI();

    //displaying the marker on the map
    marker()

}




//list of results route coordinates for showPath function 
let listRouteCoordinates = []

/**
 * routeCoordinates Function
 * obtaining the coordinates of all the routes in the map example turnings 
 */
function routeCoordinates() {

    // reset the global variable listRouteCoordinates
    listRouteCoordinates.length = 0;

    for (let i = 0; i < listOfAddressCoordinate.length; i++) {

        let startLon = listOfAddressCoordinate[i].coordinates[0];
        let startLat = listOfAddressCoordinate[i].coordinates[1];
        let endLon = listOfAddressCoordinate[i + 1].coordinates[0];
        let endLat = listOfAddressCoordinate[i + 1].coordinates[1];

        //services.js function sendXMLRequestForRoute
        sendXMLRequestForRoute(startLat, startLon, endLat, endLon, directionsCallback)

    }
}

/**
 * directionsCallback function
 * callback function for sendXMLRequestForRoute and push the data to coordinates arrey
 * @param {*} data results coordinates from the webservice
 */
function directionsCallback(data) {
    // data
    let resultsCoordinate = data.routes[0].geometry.coordinates
    listRouteCoordinates.push(resultsCoordinate);
    // console.log(data);
}

/**
 * showPath function
 * Runs when the Show Path button is click
 * Display a path line of each POI
 */
function showPath() {


    //Clear previous routes/path for new path
    clearPath()

    let object = {
        type: "geojson",
        data: {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: []
            }
        }
    };
    // console.log(object.data.geometry.coordinates);

    for (let i = 0; i < listRouteCoordinates.length; i++) {
        for (let j = 0; j < listRouteCoordinates[i].length; j++) {
            object.data.geometry.coordinates.push(listRouteCoordinates[i][j]);
        }
    }


    map.addLayer({
        id: "routes",
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 6 }
    });


}

/**
 * clearPath function
 * Runs when the clear path button is click
 * cleat the path layers with the ID "routes"
 */
function clearPath() {
    removeLayerWithId("routes");
}

/**
 * displayPOI function
 * displays the POIS selected to the poi table
 */
function displayPOI() {


    //let reftBody = document.getElementById("addRow");


    let output1 =

        //new row  
        `<tr>
    <td class="mdl-data-table__cell--non-numeric">
    <b>Starting location: </b>${listOfAddressCoordinate[0].description}<div>
    <div><b>POI Order: </b><input style="width: 15px;" type="text" value=1  pattern="-?[0-9]*(\.[0-9]+)?" id="indexOrder0">
    <span class="mdl-textfield__error">Input is not a number!</span></div>
    <div><b>Name: </b>${listOfAddressCoordinate[0].locationName} </div>
    <b>Category: </b>${listOfAddressCoordinate[0].categories}</div></td>
    <td> <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" id = "remove button"><img
          src="img/removebutton.png" width="17" height="17" onclick="removePOI()">
        <i class="material-icons"></i>
      </button>
    </td>
  </tr>`

    document.getElementById("planningTable").innerHTML = output1;

    //create a new row for for each poi
    for (let i = 1; i < listOfAddressCoordinate.length; i++) {

        let output =

            //new row 
            `<tr>
            <td class="mdl-data-table__cell--non-numeric ">
                <b>POI ${i}:</b>${listOfAddressCoordinate[i].description}  
                <div><b>POI Order: </b><input style="width: 15px;" type="text" value=${i + 1}  pattern="-?[0-9]*(\.[0-9]+)?" id="indexOrder${i}">
                <span class="mdl-textfield__error">Input is not a number!</span></div>
                <div><b>Name: </b>${listOfAddressCoordinate[i].locationName} </div>
                <div><b>Distance: </b>${routeDistanceArray[i - 1] + "km"} </div> 
                <div><b>Category: </b>${listOfAddressCoordinate[i].categories}</div>
            </td>
    
            <td> 
            <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"><img
                src="img/removebutton.png" width="17" height="17" onclick="removePOI(${i})">
                <i class="material-icons"></i>
                </button>
            </td>
         </tr> `;

        document.getElementById("planningTable").innerHTML += output;


    }

}



/**
 * removePOI function
 * Runs when the remove button is click
 * Remove the address/coordinates from the main/global array
 * Refresh all the map layers(markers, pop up), the route Coordinates and refresh the table(the referesh table function is in the marker() function)
 * @param {*} Index 
 */
function removePOI(Index) {

    //Remove that particular address/coordinate at the main/global array "listOfAddressCoordinate" based on the Index 
    listOfAddressCoordinate.splice(Index, 1);

    //clear all markers in the map
    removeMarker();

    //refresh marker layers
    marker();

    // reset the global variable listRouteCoordinates
    listRouteCoordinates.splice(0, listRouteCoordinates.length);

    //refresh route Coordinates
    routeCoordinates();

    //calculate the route between two points for all POIs
    routeDistance();

    //Display/refresh the total distance value
    displayTotalDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the number of stops value
    displayNumberOfStops();

}

//The user selected vehicle information detail will be store here, containing avgDriveDistance and vehicle type
let selectedVehicle = [];

/**
 * addVehicle function
 * Runs when click the comfirm button to slected the vehicle
 * Get the references index and use that reference to get that vehicles information from the Class vehicles
 */
function addVehicle() {

    //Clear any previous selected vehicles, cause can only select one vehicle of choise
    selectedVehicle.length = 0;

    //get the index reference
    let refVehicleIndex = document.getElementById("Vehicle Type");
    let vehicleIndex = refVehicleIndex.value;

    //Get the vehicles information from the Class vehicles using the index ref
    let veh = vehicles.getVehicle(vehicleIndex);

    //Push to a global array selectedVehicle to have access to the data
    selectedVehicle.push(veh);


}

/**
 * removeLayerWithId function
 * Remove the called layer
 * @param {*} idToRemove The ID of the layer that is being remove
 */
function removeLayerWithId(idToRemove) {
    let hasPoly = map.getLayer(idToRemove)
    if (hasPoly !== undefined) {
        map.removeLayer(idToRemove)
        map.removeSource(idToRemove)
    }
}







/**
 * distanceBetween function
 * Runs when the fuction is called
 * A function to calculate the distance between two points
 * @param {*} lat1 first point latitude
 * @param {*} lon1 second point latitude
 * @param {*} lat2 first poin longtitude
 * @param {*} lon2 second point longtitude
 * @returns 
 */
function distanceBetween(lat1, lon1, lat2, lon2) {

    let R = 6371; //Earth's radius

    let x = (Math.sin(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180)) + (Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(lon2 * Math.PI / 180 - lon1 * Math.PI / 180));
    let d = Math.acos(x) * R; //Distance between two points
    return d
}

//array to save all the distances 
let routeDistanceArray = [];

/**
 * routeDistance function
 * calculate the route distance unsing the function distanceBetween
 */
function routeDistance() {

    //Reset the routeDistanceArray
    routeDistanceArray.length = 0;

    for (let j = 0; j < listRouteCoordinates.length; j++) {
        //Initialising and resetting the routeDistance value to 0
        let routeDistance = 0;
        for (let i = 0; i + 1 < listRouteCoordinates[j].length; i++) {
            //Calculating the distance between two closely located points 
            let distance = distanceBetween(listRouteCoordinates[j][i][0], listRouteCoordinates[j][i][1], listRouteCoordinates[j][i + 1][0], listRouteCoordinates[j][i + 1][1]);
            //Adding the distance into routeDistance to get the actual distance between 2 locations by road
            routeDistance += distance;
        }

        routeDistanceArray.push(routeDistance.toFixed(2))
    }

    //Calculate the total distance
    calTotalDistance();
}



let totalDistance = [];

/**
 * calTotalDistance function
 * Runs when called upon
 * Total up all the route distance
 */
function calTotalDistance() {

    //reset the totalDistance array
    totalDistance.length = 0;

    let distance = 0;

    //Accummulate the distance
    for (let i = 0; i < routeDistanceArray.length; i++) {
        distance += Number(routeDistanceArray[i]);
    }

    totalDistance.push(distance);

}





/**
 * displayTotalDistance function 
 * Runs when called upon
 * display total Distance in the page
 */
function displayTotalDistance() {

    //check the distance limit
    checkDistanceLimit();

    document.getElementById("totalDistance").innerHTML = `Total distance: ${totalDistance[0].toFixed(2)}`;


}

/**
 * displayRemainingDistance function 
 * Runs when called upon
 * display remaining Distance in the page
 */
function displayRemainingDistance() {


    let refVehicleDistance = selectedVehicle[0].avgDriveDistance;

    let distanceRemain = refVehicleDistance - totalDistance[0] + checkForGasStation();

    document.getElementById("remainingDistance").innerHTML = `Remaining distance: ${distanceRemain.toFixed(2)}`;
}

/**
 * checkForGasStation function
 * Runs when called upon
 * Will check if any of the POIs is a gas station
 * If yes, then the vehicle travel distance will increase
 * @returns the output distance remaining
 */
function checkForGasStation() {
    // get the reference of that vehicle travel distance
    const VEHICLEDISTANCE = selectedVehicle[0].avgDriveDistance;

    let output = 0;

    for (let i = 0; i < listOfAddressCoordinate.length; i++) {

        let refcategories = listOfAddressCoordinate[i].categories;

        //cehck if the POI is a gas station
        if (refcategories == "gas station, fuel, gas") {

            //add 20% of thet vehicle refuel
            output += VEHICLEDISTANCE * (20 / 100);
        }
    }

    return output;
}

/**
 * checkDates function
 * runs when the user click the comfirm button next to date
 * This function will check if the date is valid and not passed.
 * User will recieve a warning if a invalid date was input
 * user will not be able to select passed date or today date, must have a least one day difference
 */
function checkDates()
{
    let refDate = document.getElementById("dateSelected");

    let currentDate = new Date();
    let planDate = new Date(refDate.value);

    //Calculate the difference 
    let diff = currentDate - planDate;

    if (diff > 0 && diff < 50000000)
    {
        //Cannot choose today date
        //Warn the user
        alert("You cant choose today date!!! Please leave a day difference.");
    }
    else if (diff > 0) {
        //the date has passed
        // warn the user
        alert("Invalid Date!!! This date has paased. Please choose a proper date.");
    }

};


/**
 * checkDistanceLimit function
 * Runs when called upon
 * Check the total distance does not excess the vehicle limits
 */
function checkDistanceLimit() {
    //get the reference of the vehicle distance limit
    let refVehicleDistance = selectedVehicle[0].avgDriveDistance;

    if (refVehicleDistance < totalDistance[0]) {
        // warn the user
        alert("Exceeding Vehicle Driving Distanve!!! PLease remove some POIs.");
    }
}

let numberOfStops = 0;

/**
 * displayNumberOfStops function
 * Runs when called
 * Display the court of number of stops
 */
function displayNumberOfStops() {
    document.getElementById("numberOfStops").innerHTML = `Number of stops: ${listOfAddressCoordinate.length}`;
    numberOfStops = listOfAddressCoordinate.length;
}

/**
 * changePOIOrders function
 * Runs when the the change of orders is click
 * This function will reorganise or sort correctlly based on the new order
 */
function changePOIOrders() {

    //get a copy/reference of the original array
    let refArray = listOfAddressCoordinate;

    //the new orders indexes 
    let newPOIOrders = [];

    //the new array that will be replacing the old/original array
    let newArray = [];


    //get the reference of the input of the new POI order for each POIs
    for (let i = 0; i < refArray.length; i++) {
        let key = "indexOrder" + i;

        let refNewPOIOrder = document.getElementById(key).value;

        newPOIOrders.push(refNewPOIOrder);
    }

    //sort in the new order of POIs
    for (let j = 0; j < newPOIOrders.length; j++) {
        let index = newPOIOrders[j] - 1;
        let refData = refArray[index];
        newArray.push(refData);
    }

    // reset the global variable listRouteCoordinates
    listOfAddressCoordinate.splice(0, listOfAddressCoordinate.length);

    //add the new order of POIs array to the original array
    listOfAddressCoordinate = newArray;

    //calculate the route between two points for all POIs
    routeDistance();

    //Display/refresh the total distance value
    displayTotalDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the remaining distance value
    displayRemainingDistance();

    //Display/refresh the number of stops value
    displayNumberOfStops();


    //clear all markers in the map
    removeMarker();

    //refresh marker layers
    marker();

    // reset the global variable listRouteCoordinates
    listRouteCoordinates.splice(0, listRouteCoordinates.length);

    //refresh route Coordinates
    routeCoordinates();

}

/**
 * Function cancelPlan 
 * This function will ask the user a confimation question and if yes will be redirected to the index page
 */
function cancelPlan() {

    //Confirming if the user wants to cancel the plan 
    if (confirm(`Are you sure you want to cancel this plan?`)) {
        //redirecting the user to the homw page
        window.location = "index.html";
    }
}


/**
 * Function savePlan 
 * This function will run when save button is clicked
 */
function savePlan() {

    //confirming if user wants to save plan
    if (confirm(`Are you sure you want to save this plan?`)) {

        //create refrences
        let vacationNameRef = document.getElementById("vacationName");
        let dateRef = document.getElementById("dateSelected");
        let numberOfStopsRef = numberOfStops;
        let totalDistanceRef = totalDistance;
        let listOfPOIsRef = listOfAddressCoordinate;
        let vehicleTypeRef = selectedVehicle;
        let listOfRouteCoordinateRef = markersCoordinates;
        let listOfRouteDistanceRef = routeDistanceArray;

        //creating a new instance of plan class
        let plan = new Plan(); 
        plan.vacationName(vacationNameRef.value); //error, "function isnt working" on browser
        plan.date(dateRef.value);
        plan.numberOfStops(numberOfStopsRef);
        plan.totalDistance(totalDistanceRef);
        plan.listOfPOIs(listOfPOIsRef);
        plan.vehicleType(vehicleTypeRef);
        plan.listOfAddressCoordinate(listOfRouteCoordinateRef);
        plan.listOfRouteDistance(listOfRouteDistanceRef);

        listOfPlans.addPlanToPlanList(plan);

        //redirect the user to summary page
        window.location = "confirmation.html";

        //update LSData
        updateLSData(LIST_PLAN_KEY, listOfPlans);

    }
};