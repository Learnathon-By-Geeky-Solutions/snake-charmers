package TripManager

import (
	"fmt"
	"sync"
	"coordinator-service/internal/schemas"
)

var mutex = sync.Mutex{} 
var ActiveTripRequest = make(map[int]Schemas.TripDetails)

func InitiateTripRequest(reqID int, clientID int) {
	ActiveTripRequest[reqID] = Schemas.TripDetails{
		ClientID: clientID,
		Drivers:  make(map[int]bool), // Initialize an empty map for drivers
	}
	fmt.Println("Trip initiated:", ActiveTripRequest[reqID])
}

func EngageDriver(reqID int, driverID int){
	reqDetails, exists := ActiveTripRequest[reqID]
	if !exists {
		fmt.Println("Trip request not found while engaging driver!")
		return
	}
	mutex.Lock()
	reqDetails.Drivers[driverID] = true // Add driver to the map
	ActiveTripRequest[reqID] = reqDetails // Update the map entry
	mutex.Unlock()
	fmt.Println("Driver added to trip:", reqDetails.Drivers)
	// return nil
}

func ReleaseDriver(reqID int, driverID int) {
	reqDetails, exists := ActiveTripRequest[reqID]
	if !exists {
		fmt.Println("Trip request not found while releasing the driver!")
		return
	}

	_, driverExists := reqDetails.Drivers[driverID]
	if !driverExists {
		fmt.Println("Driver not found while releasing in this trip!")
		return
	}
	mutex.Lock()
	delete(reqDetails.Drivers, driverID) // Remove driver from the map
	ActiveTripRequest[reqID] = reqDetails // Update the map entry
	mutex.Unlock()
	fmt.Println("Driver removed from trip:", reqDetails.Drivers)
}

func DeleteTripRequest(reqID int) {
	_, exists := ActiveTripRequest[reqID]
	if !exists {
		fmt.Println("Trip request not found!")
		return
	}

	delete(ActiveTripRequest, reqID) // Remove the trip entry from the map

	fmt.Println("Trip request deleted:", reqID)
}