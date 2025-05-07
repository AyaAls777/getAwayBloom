"use strict";

// retrieving the plan index of the most recent plan
let planIndex = retrieveLSData(PLAN_KEY);

//retrieving the most recent plan
let plan = listOfPlans.getPlan(planIndex);

/**
 * displayNameAndDate function
 * the function will only run when its being called
 * the function only updates the Vacation Name and Date
 */
function displayNameAndDate() {
    let refVacName = document.getElementById("vacationName");
    let refVacDate = document.getElementById("vacationDate");
    refVacName.value = plan.details.vacationName;
    refVacDate.value = plan.details.date;
}


// coordinated for starting location
// let lngStart = plan.details.listOfPOIs[0].coordinates[0];
// let latStart = plan.details.listOfPOIs[0].coordinates[1];

mapboxgl.accessToken = MAPBOX_KEY
let map = new mapboxgl.Map({
    container: 'map',
    center: [144.9648731, -37.8182711],
    zoom: 16,
    style: 'mapbox://styles/mapbox/streets-v11'
});

//marker for map
// Create new markers.
function marker() {

    for (let i = 0; i < plan.details.listOfPOIs.length; i++) {
        let location = plan.details.listOfPOIs[i];
        let marker = new mapboxgl.Marker({ "color": "#FF8C00", draggable: true });
        marker.setLngLat(plan.details.listOfPOIs[i].coordinates);

        let popup = new mapboxgl.Popup({ offset: 40 });
        popup.setText(plan.details.listOfPOIs[i].description);

        marker.setPopup(popup);

        // Display the marker.
        marker.addTo(map);

        // Display the popup.
        popup.addTo(map);

        // markersCoordinates.push(marker);
        // console.log(location);
    }
}

/**
 * showPath function
 * Runs when the Show Path button is click
 * Display a path line of each POI
 */
function showPath() {

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

    for (let i = 0; i < plan.details.listOFRouteCoordinate.length; i++) {
        for (let j = 0; j < plan.details.listOFRouteCoordinate[i].length; j++) {
            object.data.geometry.coordinates.push(plan.details.listOFRouteCoordinate[i][j]);
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
 * panToStartingLocation function
 * Runs when the pan to Starting location is click
 * pan the map box to the Starting location coordinates
 */
function panToStartingLocation() {

    let lng = plan.details.listOfPOIs[0].coordinates[0];
    let lat = plan.details.listOfPOIs[0].coordinates[1];

    let startingLocation = [lng, lat];
    map.panTo(startingLocation);
}


/**
 * displayTotalNumStop function
 * the function will only run when its being called
 * the function modifies the total number of stops
 */
function displayTotalNumStop() {
    let refNumStop = document.getElementById("numOfStop");
    refNumStop.value = plan.details.numberOfStops;
}
/**
 * displayTable function 
 * the function will only run when its being called
 * the function create the rows of the table base on the list of POI data
 */
function displayTable() {
    let output = ""

    output += `<tr >
    <!-- <td class="mdl-data-table__cell--non-numeric" > -->
        <td>
        <!--Vacation Name-->
        <p><b>Starting Location:</b><br>${plan.details.listOfPOIs[0].description}</p>
        <p><b>POI Order: 1</b></p>
        <p><b>Name:</b>${plan.details.listOfPOIs[0].locationName}</p>
        <p><b>Category:</b> ${plan.details.listOfPOIs[0].categories}</p>
        </td>
        
</tr>`
    for (let i = 1; i < plan.details.listOfPOIs.length; i++) {
        output += ` <tr >
        <!-- <td class="mdl-data-table__cell--non-numeric" > -->
            <td>
            <!--Vacation Name-->
            <p><b>Starting Location:</b><br>${plan.details.listOfPOIs[i].description}</p>
            <p><b>POI Order: 1</b></p>
            <p><b>Name:</b>${plan.details.listOfPOIs[i].locationName}</p>
            <p><b>Category:</b> ${plan.details.listOfPOIs[i].categories}</p>
            </td>
            <td>
                <p><b>Distance:</b><br>${plan.details.listOfRouteDistance[i - 1]}</p>
            </td>
    </tr>`
    }
    output += `<tr>
    <td>
        <p><b>Total Distance:</b><br>${plan.details.totalDistance}</p>
    </td>
</tr>`

    document.getElementById("listOfPlanscontainer").innerHTML = output;
}

//redirect the user back to the list of plans page
function backToListOfPlan() {
    //redirect the user to list of plan page
    window.location = "listOfPlans.html";

}
//calling the functions to display all data on page

marker();
showPath();
displayNameAndDate();
displayTotalNumStop();
displayTable();


