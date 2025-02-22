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
		res2, err := RequestAmbulances(data)
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
	err = RequestLocationUpdate(data, method, typ)
	if err != nil {
		// send error response
	}

}

func HandleTripRequestCheckout(conn *websocket.Conn, payload any) {
	var data TripCheckout
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	err = RequestTripCheckout(data)
	if err != nil {
		// send error response
	}
	EngageDriver(data.ReqID, data.DriverID, Driver{
		Name: data.Name,
		Mobile: data.Mobile,
	})
}
func HandleTripRequestDecline(conn *websocket.Conn, payload any) {
	var data TripDecline
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	err = RequestTripDecline(data)
	if err != nil {
		// send error response
	}else{
		ReleaseDriver(data.ReqID, data.DriverID)
	}
}
func HandleBidFromDriver(conn *websocket.Conn, payload any) {
	var data BidFromDriver
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	err = SendBidFromDriver(data)
	if err != nil {
		// send error response
	}
}

func HandleBidFromClient(conn *websocket.Conn, payload any) {
	var data BidFromClient
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	err = SendBidFromClient(data)
	if err != nil {
		// send error response
	}
}

func HandleTripConfirmation(conn *websocket.Conn, payload any) {
	var data TripConfirm
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	res, err := RequestTripConfirmation(data)
	if err != nil {
		// send error response
	}
	err = SendTripConfirmation(res)
	if err != nil {
		//handle error
	}
	err = RequestTripRequestRemoval(data.ReqID)
	if err != nil {
		//handle error	
	}
	for _, driver := range ActiveTripRequest[data.ReqID].Drivers {
		if driver.DriverID == data.DriverID {
			continue
		}
		go NotifyOtherDriver(data.DriverID)
	}
	DeleteTripRequest(data.ReqID)
}

func HandleEndTrip(conn *websocket.Conn, payload any) {
	tripID, ok := payload.(int)
	if !ok {
		fmt.Println("Failed to convert payload to int")
		return
	}
	err := RequestEndTrip(tripID)
	if err != nil {
		// send error response
	}
}
