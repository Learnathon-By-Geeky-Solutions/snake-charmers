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

// decodePayload is a generic function to decode payload into a specific struct
func decodePayload[T any](payload map[string]any, data *T) error {
	return Utils.DecodeMapToStruct(payload, data)
}

// handleError logs the error and sends an error message through WebSocket
func handleError(conn *websocket.Conn, errorMessage string) {
	fmt.Println(errorMessage)
	EventEmitter.SendErrorMessage(conn)
}

func HandleTripRequest(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripRequest
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	fmt.Printf("Trip requested by Rider with id %d\n", data.RiderID)
	fmt.Print(data)

	res1, ok := TripManager.SendTripRequest(data)
	if !ok {
		handleError(conn, "Error sending the trip request to the trip-service")
		return
	}

	fmt.Printf("Successfully sent trip request to the trip-service. Now pinging drivers.\n")
	TripManager.InitiateTripRequest(res1.ReqID, data.RiderID)

	if err := processTripRequestDrivers(conn, res1.ReqID, data); err != nil {
		TripManager.RequestTripRequestRemoval(res1.ReqID)
	}
}

func processTripRequestDrivers(conn *websocket.Conn, reqID int, data Schemas.TripRequest) error {
	res2, ok := TripManager.RequestAmbulances(data)
	if !ok {
		handleError(conn, "Error sending the request to the ambulance finder service")
		return fmt.Errorf("ambulance request failed")
	}

	if len(res2) == 0 {
		fmt.Printf("No ambulance found nearby..")
		return nil
	}

	for _, driver := range res2 {
		fmt.Printf("Pinging the driver with ID %d\n", driver.DriverID)
		go EventEmitter.PingDrivers(driver.DriverID, reqID, data.PickupLocation, data.Destination, data.Fare)
	}

	return nil
}

func HandleLocationUpdate(conn *websocket.Conn, payload map[string]any, typ string) {
	var data Schemas.LocationUpdate
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	method := http.MethodPut
	if typ != "update" {
		method = http.MethodPost
	}

	if ok := TripManager.RequestLocationUpdate(data, method, typ); !ok {
		handleError(conn, fmt.Sprintf("Error while %sing location", typ))
		return
	}

	fmt.Printf("Location %sed successfully\n", typ)
}

func HandleTripRequestCheckout(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripCheckout
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	if !TripManager.RequestTripCheckout(data) {
		handleError(conn, fmt.Sprintf("Error while engaging the driver having ID %d", data.DriverID))
		return
	}

	fmt.Printf("Driver having the ID %d engaged successfully\n", data.DriverID)
	TripManager.EngageDriver(data.ReqID, data.DriverID)
}

func HandleTripRequestDecline(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripDecline
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	if !TripManager.RequestTripDecline(data) {
		handleError(conn, fmt.Sprintf("Error while declining the trip by driver having ID %d", data.DriverID))
		return
	}

	fmt.Printf("Successfully declined the trip by driver having ID %d.\n", data.DriverID)
	TripManager.ReleaseDriver(data.ReqID, data.DriverID)
}

func HandleBidFromDriver(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.BidFromDriver
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	if err := EventEmitter.SendBidFromDriver(data); err != nil {
		handleError(conn, fmt.Sprintf("Error sending bid from driver having ID %d", data.DriverID))
		return
	}

	fmt.Printf("Successfully sent bid from driver having ID %d\n", data.DriverID)
}

func HandleBidFromClient(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.BidFromClient
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	if err := EventEmitter.SendBidFromClient(data); err != nil {
		handleError(conn, "Error sending bid from client")
		return
	}

	fmt.Printf("Successfully sent bid from client\n")
}

func HandleTripConfirmation(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.TripConfirm
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	res, ok := TripManager.RequestTripConfirmation(data)
	if !ok {
		handleError(conn, "Error sending trip confirmation request to the trip service")
		return
	}

	if err := EventEmitter.SendTripConfirmation(res); err != nil {
		handleError(conn, "Error sending trip confirmation to the driver")
		return
	}

	if !TripManager.RequestTripRequestRemoval(data.ReqID) {
		handleError(conn, "Error sending trip request removal request to the trip service")
		return
	}

	notifyOtherDrivers(data)
}

func notifyOtherDrivers(data Schemas.TripConfirm) {
	for driverID := range TripManager.ActiveTripRequest[data.ReqID].Drivers {
		if driverID == data.DriverID {
			continue
		}
		fmt.Printf("Notifying other drivers about the trip confirmation\n")
		go EventEmitter.NotifyOtherDriver(data.DriverID)
	}
	TripManager.DeleteTripRequest(data.ReqID)
}

func HandleEndTrip(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.EndTrip
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}

	if !TripManager.RequestEndTrip(data.TripID) {
		handleError(conn, "Error while making request for ending the trip to the trip service")
		return
	}

	fmt.Printf("Request to the Trip service for ending trip sent successfully\n")
	EventEmitter.SendEndTripNotification(data.RiderID)
}