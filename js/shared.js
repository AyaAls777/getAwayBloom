"use strict"


/**
 * Vehicles class
 */
class Vehicles {
    constructor() {
        // this._vehicleType = [];
        // this._vehicleAvegDriveDistance = "";
        this._vehicles = [];
    }

    /**
     * getter to access the vehicles arraylist
     */
    get vehicles() {
        return this._vehicles;
    }

    /**
     * add vehicle method
     * @param {string} vehicleType 
     * @param {number} distance 
     * adds a vehicle object with vehicle type and average distance properties to vehicles array list
     */
    addVehicle(vehicleType, distance) {
        let vehicle =
        {
            type: vehicleType,
            avgDriveDistance: distance
        }
        this._vehicles.push(vehicle)
    }

    /**
     * getVehicle method
     * @param {number} vehicleIndex 
     * @returns an element of the selected index from vehicle array list
     */
    getVehicle(vehicleIndex) {
        return this._vehicles[vehicleIndex]
    }

    /**
     * fromData method
     * @param {array} data 
     * restores class data from local storage
     */
    fromData(data) {
        this._vehicles = [];
        for (let i = 0; i < data._vehicles.length; i++) {
            let vehicle =
            {
                type: data._vehicles[i].type,
                avgDriveDistance: data._vehicle[i].avgDriveDistance
            }
            this._vehicles.push(vehicle);
        }
    }
}

// Add all the vehicle types
let vehicles = new Vehicles;
vehicles.addVehicle("Sedan", 1000);
vehicles.addVehicle("SUV", 850);
vehicles.addVehicle("Van", 600);
vehicles.addVehicle("Minibus", 450);

//testing for class Vehicle
// console.log(vehicles);
// console.log(vehicles.getVehicle(1));
// console.log(vehicles.getVehicle(2).type);
// console.log(vehicles.getVehicle(2).avgDriveDistance + "km");
// console.log((vehicles.getVehicle(0)));
// console.log((vehicles.getVehicle("3")));

/**
 * Plan class
 */
class Plan {
    constructor() {

        //private atributes of plan class
        this._vacationName = vacationName;
        this._vehicleType = [];
        this._listOfPOIs = [];
        this._date = 0;
        this._listOfRouteCoordinate = [];
        this._numberOfStops = 0;
        this._listOfRouteDistance = [];
        this._totalDistance = 0;
    }

    /**
     * getter to access vacation name
     * returns vacation name
     */
    get vacationName() {
        return this._vacationName;
    }

    /**
     * getter to access vehicle type
     * returns vehicle type
     */
    get vehicleType() {
        return this._vehicleType;
    }

    /**
     * getter to acces list of POIs array
     * returns an array of POIs
     */
    get listOfPOIs() {
        return this._listOfPOIs;
    }

    /**
     * getter to access date
     * return the selected date 
     */
    get date() {
        return this._date;
    }

    /**
     * getter to access list of route coordinate
     * returns list of coordinate array
     */
    get listOfRouteCoordinate() {
        this._listOfRouteCoordinate;
    }

    /**
     * getter to access list of number of stops
     * returns list of number of stops
     */
    get numberOfStops() {
        return this._numberOfStops;
    }

    /**
     * getter to access list of route distance
     * returns list of route distance
     */
    get listOfRouteDistance() {
        return this._listOfRouteDistance;
    }

    /**
     * getter to access total distance
     * returns the total distance of the trip
     */
    get totalDistance() {
        this._totalDistance;
    }

    //set 

    /**
     * Setter(mutator)
     * to change the private attribute vacationName
     * returns the new vacation name
     */
    set vacationName(newVacationName) {
        return this._vacationName = newVacationName;
    }

    /**
     * Setter(mutator)
     * to change the private attribute vehicleType
     * returns the new vehicle type
     */
    set vehicleType(newVehicleType) {
        return this._vehicleType = newVehicleType;
    }

    /**
     * Setter(mutator)
     * to change the private attribute listOfPOIs
     * returns the new list of pois
     */
    set listOfPOIs(newListOfPOIs) {
        return this._listOfPOIs = newListOfPOIs;
    }

    /**
     * Setter(mutator)
     * to change the private attribute date
     * returns the new date
     */
    set date(newDate) {
        return this._date = newDate;
    }

     /**
     * Setter(mutator)
     * to change the private attribute listOfRouteCoordinate
     * returns the new list of coordinate
     */
    set listOfRouteCoordinate(newListOfRouteCoordinate) {
        this._listOfRouteCoordinate = newListOfRouteCoordinate;
    }

     /**
     * Setter(mutator)
     * to change the private attribute numberOfStops
     * returns the new numberOfStops
     */
    set numberOfStops(newNumberOfStops) {
        return this._numberOfStops = newNumberOfStops;
    }

     /**
     * Setter(mutator)
     * to change the private attribute listOfRouteDistance
     * returns the new list of route distance
     */
    set listOfRouteDistance(newListOfRouteDistance) {
        return this._listOfRouteDistance = newListOfRouteDistance;
    }

     /**
     * Setter(mutator)
     * to change the private attribute totalDistance
     * returns the new total distance
     */
    set totalDistance(newTotalDistance) {
        this._totalDistance = newTotalDistance;
    }
    

    /**
     * fromData method
     * @param {any} data 
     * restores class data from local storage
     */
    fromData(data) {
        this._vacationName = data._vacationName;

        this._vehicleType = [];
        for (let i = 0; i < data._vehicleType.length; i++) {
            let vehicleTypeData =
            {
                avgDriveDistance: data.__vehicleType[i].avgDriveDistance,
                type: data.__vehicleType[i].type
            }
            this._vehicleTpe.push(vehicleTypeData);
        }

        this._listOfPOIs = [];
        for (let k = 0; k < data._listOfPOIs.length; k++) {
            let location =
            {
                locationName: data._listOfPOIs[j].locationName,
                coordinates: [],
                description: data._listOfPOIs[j].description,
                categories: data._listOfPOIs[j].categories
            }

            for (let j = 0; j < data._listOfPOIs[j].coordinates.length; j++) {

                let coordinates = data._listOfPOIs[i].coordinates[j];
                this._listOfPOIs[k].coordinates.push(coordinates);
            }
            this._listOfPOIs[k].push(location);
        }

        this._date = data._date;

        this._listOfRouteCoordinate = [];
        for (let p = 0; p < data._listOfPOIs.length; p++) {

            let singleRouteCoordinates = [];

            for (let s = 0; s < data._listOfPOIs[p].length; s++) {

                let coordinates = [];

                for (let d = 0; d < data._listOfPOIs[p][s].length; d++) {

                    let coordiantesData = data._listOfPOIs[p][s][d];
                    coordinates.push(coordiantesData);

                    listOfSingleRouteCoordinate.push(singleRouteCoordinates);
                }
                singleRouteCoordinates.push(coordinates);
            }
            this._listOfRouteCoordinate.push(singleRouteCoordinates);
        }

        this._numberOfStops = data._numberOfStops;

        this._listOfRouteDistance = [];
        for (let z = 0; z < data._listOfRouteDistance.length; z++) {
            let routeDistance = data._listOfRouteDistance[z];
            this._listOfRouteDistance.push(routeDistance);
        }

        this._totalDistance = data._totalDistance;

    }
}

/**
 * List of plans
 */

class ListOfPlans {
    constructor() {
        
        //listOfPlans attritbute
        this._planList = [];
    }


    /**
     * getter to access planList
     * returns the planListArray
     */
    get planList() {
        return this._planList
    }

    /**
     * addPlan method
     * @param {InstanceType} planName 
     * adds a plan object with name and details properites to the plan list array
     */
    addPlan(planName) {
        
        let plan =
        {
            name: planName,
            details: planDetails
        };
        this._planList.push(plan);
    }

    /**
     * addPlantoPlanList
     * @param {InstanceType} plan 
     * checks if plan is an instance of the class Plan
     * adds a plan object with name and details properites to the plan list array
     */
    addPlanToPlanList(plan, planIndex) {
        if (plan instanceof Plan) {
            this._planList[planIndex].details = plan;
        }
    }

    /**
     * getPlan method
     * @param {number} planIndex 
     * @returns an element of the selected index from vehicle array list
     */
    getPlan(planIndex) {
        return this._planList[planIndex]
    }

    /**
     * fromData method
     * @param {array} data 
     * restores class data from local storage
     */
    fromData(data) {
        this._planList = [];
        for (let i = 0; i < data._planList.length; i++) {
           
            let plan =
            {
                name: data._planList[i].name,
                details: data._planList[i]
            };
            this.__planList.push(plan);
        }
    }
}

let listOfPlans = new ListOfPlans;
//testing
// console.log(listOfPlans.planList.length);

/**
 * updateLSData function
 * Used to store JS data in LS at a specific key
 * @param {string} key LS key to be used
 * @param {any} data data to be stored
 */
function updateLSData(key, data) {
    let json = JSON.stringify(data);
    localStorage.setItem(key, json);
}