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

const DecodingError = "Error decoding: "

func HandleTripRequest(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripRequest
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	fmt.Printf("Trip requested by Rider with id %d\n", data.RiderID)
	res1, ok := TripManager.SendTripRequest(data)
	if !ok {
		fmt.Printf("Error sending the trip request to the trip-service\n")
		EventEmitter.SendErrorMessage(conn)
	} else {
		fmt.Printf("Successfully sent trip request to the trip-service. Now pinging drivers.\n")
		
		TripManager.InitiateTripRequest(res1.ReqID, data.RiderID)
		res2, ok := TripManager.RequestAmbulances(data)
		if !ok {
			fmt.Printf("Error sending the request to the ambulance finder service.\n")
			EventEmitter.SendErrorMessage(conn)
			TripManager.RequestTripRequestRemoval(res1.ReqID)
		} else {
			// print(res2)
			if len(res2) == 0 {
				fmt.Printf("No ambulance found nearby..");
			}
			for _, driver := range res2 {
				fmt.Printf("Pinging the driver with ID %d\n", driver.DriverID)
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
	ok := TripManager.RequestLocationUpdate(data, method, typ)
	if !ok {
		fmt.Printf("Error while %sing location\n", typ)
		EventEmitter.SendErrorMessage(conn)
		return
	}
	fmt.Printf("Location %sed successfully\n", typ)
}

func HandleTripRequestCheckout(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripCheckout
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	ok := TripManager.RequestTripCheckout(data)
	if !ok {
		fmt.Printf("Error while engaging the driver having ID %d\n", data.DriverID)
		EventEmitter.SendErrorMessage(conn)
		return
	}
	fmt.Printf("Driver having the ID %d engaged successfully\n", data.DriverID)
	TripManager.EngageDriver(data.ReqID, data.DriverID)
}

func HandleTripRequestDecline(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripDecline
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	ok := TripManager.RequestTripDecline(data)
	if !ok {
		fmt.Printf("Error while declining the trip by driver having ID %d\n", data.DriverID)
		EventEmitter.SendErrorMessage(conn)
	}else{
		fmt.Printf("Successfully declined the trip by driver having ID %d.\n", data.DriverID)
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
		fmt.Printf("Error sending bid from driver having ID %d\n", data.DriverID)
		EventEmitter.SendErrorMessage(conn)
		return
	}
	fmt.Printf("Successfully sent bid from driver having ID %d\n", data.DriverID)

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
		fmt.Printf("Error sending bid from client\n")
		EventEmitter.SendErrorMessage(conn)
	}
	fmt.Printf("Successfully sent bid from client\n")

}

func HandleTripConfirmation(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripConfirm
	err := Utils.DecodeMapToStruct(payload, &data)
	if err != nil {
		fmt.Println(DecodingError, err)
		return
	}
	res, ok := TripManager.RequestTripConfirmation(data)
	if !ok {
		fmt.Println(fmt.Errorf("error sending trip confirmation request to the trip service"))
		EventEmitter.SendErrorMessage(conn)
		return
	}
	err = EventEmitter.SendTripConfirmation(res)
	if err != nil {
		fmt.Println(fmt.Errorf("error sending trip confirmation to the driver"))
		EventEmitter.SendErrorMessage(conn)
		return        // need to implement retry mechanism here
	}
	ok = TripManager.RequestTripRequestRemoval(data.ReqID)
	if !ok {
		fmt.Println(fmt.Errorf("error sending trip request removal request to the trip service"))
		EventEmitter.SendErrorMessage(conn)	
		return        // need to implement retry mechanism here      
	}
	for driverID, _ := range TripManager.ActiveTripRequest[data.ReqID].Drivers {
		if driverID == data.DriverID {
			continue
		}
		fmt.Printf("Notifying other drivers about the trip confirmation\n")
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
	ok := TripManager.RequestEndTrip(data.TripID)
	if !ok {
		fmt.Println(fmt.Errorf("error while making request for ending the trip to the trip service"))
		EventEmitter.SendErrorMessage(conn)	
	}
	fmt.Printf("Request to the Trip service for ending trip sent successfully\n")
}
