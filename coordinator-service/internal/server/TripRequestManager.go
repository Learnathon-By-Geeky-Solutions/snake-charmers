package server

import (
	"fmt"
)

type Driver struct {
	Name     string
	Mobile   string
}
type TripDetails struct {
	ClientID int
	Drivers  map[int]Driver
}

var ActiveTripRequest = make(map[int]TripDetails)

func InitiateTripRequest(reqID int, clientID int) {
	ActiveTripRequest[reqID] = TripDetails{
		ClientID: clientID,
		Drivers:  make(map[int]Driver), // Initialize an empty map for drivers
	}
	fmt.Println("Trip initiated:", ActiveTripRequest[reqID])
}

func EngageDriver(reqID int, driverID int, driver Driver) {
	trip, exists := ActiveTripRequest[reqID]
	if !exists {
		fmt.Println("Trip request not found!")
		return
	}

	trip.Drivers[driverID] = driver // Add driver to the map
	ActiveTripRequest[reqID] = trip // Update the map entry

	fmt.Println("Driver added to trip:", trip.Drivers)
}

func ReleaseDriver(reqID int, driverID int) {
	trip, exists := ActiveTripRequest[reqID]
	if !exists {
		fmt.Println("Trip request not found!")
		return
	}

	_, driverExists := trip.Drivers[driverID]
	if !driverExists {
		fmt.Println("Driver not found in this trip!")
		return
	}

	delete(trip.Drivers, driverID) // Remove driver from the map
	ActiveTripRequest[reqID] = trip // Update the map entry

	fmt.Println("Driver removed from trip:", trip.Drivers)
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