package Services

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/trip-manager"
	"coordinator-service/internal/event-emitter"
	"coordinator-service/internal/utils"
)

const DecodingError = "Error decoding:"

func HandleTripRequest(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripRequest
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	res1, err := TripManager.SendTripRequest(data)
	if err != nil {
		// send error response
	} else {
		TripManager.InitiateTripRequest(res1.ReqID, data.RiderID)
		res2, err := TripManager.RequestAmbulances(data)
		if err != nil {
			// send error response
		} else {
			for _, driver := range res2 {
				go EventEmitter.PingDrivers(driver.DriverID, res1.ReqID, data.PickupLocation, data.Destination)
			}
		}
	}
}

func HandleLocationUpdate(conn *websocket.Conn, payload map[string]any, typ string) {
	var data Schemas.LocationUpdate
	err := Utils.DecodeMapToStruct(payload, &data)
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
	err = TripManager.RequestLocationUpdate(data, method, typ)
	if err != nil {
		// send error response
	}

}

func HandleTripRequestCheckout(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripCheckout
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = TripManager.RequestTripCheckout(data)
	if err != nil {
		// send error response
	}
	TripManager.EngageDriver(data.ReqID, data.DriverID)
}
func HandleTripRequestDecline(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripDecline
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = TripManager.RequestTripDecline(data)
	if err != nil {
		// send error response
	}else{
		TripManager.ReleaseDriver(data.ReqID, data.DriverID)
	}
}
func HandleBidFromDriver(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.BidFromDriver
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = EventEmitter.SendBidFromDriver(data)
	if err != nil {
		// send error response
	}
}

func HandleBidFromClient(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.BidFromClient
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = EventEmitter.SendBidFromClient(data)
	if err != nil {
		// send error response
	}
}

func HandleTripConfirmation(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripConfirm
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	res, err := TripManager.RequestTripConfirmation(data)
	if err != nil {
		// send error response
	}
	err = EventEmitter.SendTripConfirmation(res)
	if err != nil {
		//handle error
	}
	err = TripManager.RequestTripRequestRemoval(data.ReqID)
	if err != nil {
		//handle error	
	}
	for driverID, _ := range TripManager.ActiveTripRequest[data.ReqID].Drivers {
		if driverID == data.DriverID {
			continue
		}
		go EventEmitter.NotifyOtherDriver(data.DriverID)
	}
	TripManager.DeleteTripRequest(data.ReqID)
}

func HandleEndTrip(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripID
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	err = TripManager.RequestEndTrip(data.TripID)
	if err != nil {
		// send error response
	}
}
