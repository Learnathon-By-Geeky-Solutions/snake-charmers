package TripManager

import (
	"fmt"
	"sync"
	"coordinator-service/internal/schemas"
)

var mutex = sync.Mutex{} 
var ActiveTripRequest = make(map[int]Schemas.TripDetails)

func InitiateTripRequest(reqID int, clientID int) {
	mutex.Lock()
	defer mutex.Unlock()

	ActiveTripRequest[reqID] = Schemas.TripDetails{
		ClientID: clientID,
		Drivers:  make(map[int]bool),
	}
	fmt.Println("Trip initiated:", ActiveTripRequest[reqID])
}

func EngageDriver(reqID int, driverID int) {
	mutex.Lock()
	defer mutex.Unlock()

	reqDetails, ok := ActiveTripRequest[reqID]
	if !ok {
		fmt.Println("Trip request not found while engaging driver!")
		return
	}
	
	reqDetails.Drivers[driverID] = true
	ActiveTripRequest[reqID] = reqDetails
	
	fmt.Println("Driver added to trip:", reqDetails.Drivers)
}

func ReleaseDriver(reqID int, driverID int) {
	mutex.Lock()
	defer mutex.Unlock()

	reqDetails, ok := ActiveTripRequest[reqID]
	if !ok {
		fmt.Println("Trip request not found while releasing the driver!")
		return
	}

	if _, exists := reqDetails.Drivers[driverID]; !exists {
		fmt.Println("Driver not found while releasing in this trip!")
		return
	}
	
	delete(reqDetails.Drivers, driverID)
	ActiveTripRequest[reqID] = reqDetails
	
	fmt.Println("Driver removed from trip:", reqDetails.Drivers)
}

func DeleteTripRequest(reqID int) {
	mutex.Lock()
	defer mutex.Unlock()

	if _, ok := ActiveTripRequest[reqID]; !ok {
		fmt.Println("Trip request not found!")
		return
	}

	delete(ActiveTripRequest, reqID)
	fmt.Println("Trip request deleted:", reqID)
}