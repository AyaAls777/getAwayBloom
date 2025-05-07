"use strict"

mapboxgl.accessToken = MAPBOX_KEY
let map = new mapboxgl.Map({
  container: 'map',
  center: [144.9648731, -37.8182711],
  zoom: 16,
  style: 'mapbox://styles/mapbox/streets-v11'
});

//retrieve the data of the current plan from the local storage
let data = retrieveLSData(LIST_PLAN_KEY);

//getting the most recent plan added into the list
let i = data.length - 1;
let plan = data[i];

//marker for map
// Create new markers.
function marker() {

  for (let i = 0; i < plan.details.listOfPOIs.length; i++) {
      let location = plan.detatails.listOfPOIs[i];
      let marker = new mapboxgl.Marker({ "color": "#FF8C00", draggable: true });
        marker.setLngLat(location.coordinates);

        let popup = new mapboxgl.Popup({ offset: 40 });
        popup.setText(location.description);

        marker.setPopup(popup);

        // Display the marker.
        marker.addTo(map);

        // Display the popup.
        popup.addTo(map);

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


//initialising the details to be displayed as an empty string
let output = "";

//HTML code to display the general details of the plan
let planDetails = `
<ul class="demo-list-item mdl-list">
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    <img src="img/time icon.png" width="25" height="25">
    <p>${plan.details.date}</p>
  </span>
</li>
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    <img src="img/car.png" width="25" height="25">
    <p>${plan.details.vehicleType}</p>
  </span>
</li>
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    Total Distance: 
    <p>${plan.details.totalDistance}</p>
  </span>
</li>
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    Number of Stops: 
    <p>${plan.detatils.numberOfStops}</p>
  </span>
</li>
</ul>`

//HTML code to initialise the table used to display the POIs
let tableHead = `
<table class="mdl-data-table mdl-js-data-table" id="POI table">
    <thead>
        <tr>
            <th class="mdl-data-table__cell--non-numeric">Sequence</th>
            <th class="mdl-data-table__cell--non-numeric">Location</th>
            <th class="mdl-data-table__cell--non-numeric">Category</th>
        </tr>
    </thead>
    <tbody>`

    //initialising the table content as an empty string
let tableContent = "";

//using a for loop to add each of the POI in the plan list into the table
for (let i = 0; i < plan.listOfPOI.length; i++) {
  tableContent += `
        <tr>
            <td class="mdl-data-table__cell--non-numeric">${i + 1}</td>
            <td class="mdl-data-table__cell--non-numeric">${listOfPOI[i]}</td>
            <td class="mdl-data-table__cell--non-numeric">${category}</td>
        </tr>`
}

//closing the table
let tableEnd = `
    </tbody>    
</table>
`
//combining the contents to be displayed on the page
output = planDetails + tableHead + tableContent + tableEnd;

//dsplaying the content on the HTML page
let displayContentRef = document.getElementById("displayContent")
displayContentRef.innerHTML = output;


// saving the plan to the
function confirmPlan() {

  //prompting a message to ensure the user wants to save this plan
  if (confirm("Are you sure you want to confirm and save this plan?" )){

  //get the last/latest saved plan
  let newPlanIndex = listOfPlans.length - 1;

  //store data in LS
  localStorage.setItem(PLAN_KEY, newPlanIndex);

  //redirect to more detail page
  window.location = "moreDetail.html";
  }

}


// deleting the plan from the plan list if the user decides to cancel the plan
function cancelSave()
{
  //prompts a message to ensure the user wants to cancel the saved plan
  if (confirm("Are you sure you want to cancel this plan and go back to the home page?" )){

  //get the last/latest saved plan in the LS
  let newPlanIndex = listOfPlans.length - 1;

  // remove that saved plan
  listOfPlans.splice(newPlanIndex, 1);

  //update LS
  updateLSData(LIST_PLAN_KEY, listOfPlans)

//redirecting users back to the planning page
  window.location = "index.html";
  }
}



//displaying the markers on the map
marker()

//displaying the path that the users would have to travel through
showPath()

