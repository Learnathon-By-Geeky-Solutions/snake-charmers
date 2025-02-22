package server

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
)


func HandleTripRequest(conn *websocket.Conn, payload any) {
	// ✅ Directly marshal the struct without using map[string]interface{}
	var data TripRequest
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	res1, err := SendTripRequest(data)
	if err != nil {
		// send error response
	} else {
		InitiateTripRequest(res1.ReqID, data.RiderID)
		res2, err := SearchAmbulancesRequest(data)
		if err != nil {
			// send error response
		} else {
			for _, driver := range res2 {
				go PingDrivers(driver.DriverID, res1.ReqID, data.PickupLocation, data.Destination)
			}
		}
	}
}

func HandleLocationUpdate(conn *websocket.Conn, payload any, typ string) {
	var data LocationUpdate
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	var method string
	if typ == "update" {
		method = http.MethodPut
	} else {
		method = http.MethodPost
	}
	_, err = LocationUpdateRequest(data, method, typ)
	if err != nil {
		// send error response
	}

}

func HandleTripCheckout(conn *websocket.Conn, payload any) {
	var data TripCheckout
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	_, err = TripCheckoutRequest(data)
	if err != nil {
		// send error response
	}
	EngageDriver(data.ReqID, data.DriverID, Driver{
		Name: data.Name,
		Mobile: data.Mobile,
	})
}

// func HandleBidFromDriver(conn *websocket.Conn, payload any) {

// }

// func HandleBidFromClient(conn *websocket.Conn, payload any) {

// }

// func HandleTripConfirmation(conn *websocket.Conn, payload any) {

// }

// func HandleTripDecline(conn *websocket.Conn, payload any) {

// }

// func HandleEndTrip(conn *websocket.Conn, payload any) {

// }
