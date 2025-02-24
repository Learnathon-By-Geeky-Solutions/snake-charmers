package server

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/utils"
)

const DecodingError = "Error decoding:"

func HandleTripRequest(conn *websocket.Conn, payload map[string]any) {
	var data schemas.TripRequest
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
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

func HandleLocationUpdate(conn *websocket.Conn, payload map[string]any, typ string) {
	var data schemas.LocationUpdate
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
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

func HandleTripRequestCheckout(conn *websocket.Conn, payload map[string]any) {
	var data schemas.TripCheckout
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = RequestTripCheckout(data)
	if err != nil {
		// send error response
	}
	EngageDriver(data.ReqID, data.DriverID)
}
func HandleTripRequestDecline(conn *websocket.Conn, payload map[string]any) {
	var data schemas.TripDecline
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = RequestTripDecline(data)
	if err != nil {
		// send error response
	}else{
		ReleaseDriver(data.ReqID, data.DriverID)
	}
}
func HandleBidFromDriver(conn *websocket.Conn, payload map[string]any) {
	var data schemas.BidFromDriver
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = SendBidFromDriver(data)
	if err != nil {
		// send error response
	}
}

func HandleBidFromClient(conn *websocket.Conn, payload map[string]any) {
	var data schemas.BidFromClient
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = SendBidFromClient(data)
	if err != nil {
		// send error response
	}
}

func HandleTripConfirmation(conn *websocket.Conn, payload map[string]any) {
	var data schemas.TripConfirm
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
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
	for driverID, _ := range ActiveTripRequest[data.ReqID].Drivers {
		if driverID == data.DriverID {
			continue
		}
		go NotifyOtherDriver(data.DriverID)
	}
	DeleteTripRequest(data.ReqID)
}

func HandleEndTrip(conn *websocket.Conn, payload map[string]any) {
	var data schemas.TripID
	err := utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = RequestEndTrip(data.TripID)
	if err != nil {
		// send error response
	}
}
