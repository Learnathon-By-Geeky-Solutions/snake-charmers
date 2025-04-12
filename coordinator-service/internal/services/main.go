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

func HandleGetLocationOfDriver(conn *websocket.Conn, payload map[string]any) {
	var data Schemas.DriverBase
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return
	}
	
	fmt.Printf("Getting location of driver with ID %d\n", data.DriverID)
	res, ok := TripManager.RequestLocationOfDriver(data.DriverID)
	if !ok {
		handleError(conn, "Error getting location of the driver")
		return
	}
	
	EventEmitter.SendLocationOfDriver(conn, res.Latitude, res.Longitude)
}

func HandleTripRequest(conn *websocket.Conn, payload map[string]any) {
	// Parse and validate the trip request
	tripRequest, ok := parseTripRequest(conn, payload)
	if !ok {
		return // Error already handled in parseTripRequest
	}
	
	// Initialize the trip request
	reqID, ok := initializeTripRequest(conn, tripRequest)
	if !ok {
		return // Error already handled in initializeTripRequest
	}
	
	// Process available drivers for the trip
	err := findAndNotifyDrivers(conn, reqID, tripRequest)
	if err != nil {
		TripManager.RequestTripRequestRemoval(reqID)
	}
}

// Helper function to parse trip request
func parseTripRequest(conn *websocket.Conn, payload map[string]any) (Schemas.TripRequest, bool) {
	var data Schemas.TripRequest
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return data, false
	}
	fmt.Printf("Trip requested by Rider with id %d\n", data.RiderID)
	fmt.Print(data)
	return data, true
}

// Helper function to initialize a trip request
func initializeTripRequest(conn *websocket.Conn, data Schemas.TripRequest) (int, bool) {
	res, ok := TripManager.SendTripRequest(data)
	if !ok {
		handleError(conn, "Error sending the trip request to the trip-service")
		return 0, false
	}
	
	fmt.Printf("Successfully sent trip request to the trip-service\n")
	TripManager.InitiateTripRequest(res.ReqID, data.RiderID)
	return res.ReqID, true
}

// Helper function to find and notify drivers
func findAndNotifyDrivers(conn *websocket.Conn, reqID int, data Schemas.TripRequest) error {
	// Request ambulances
	drivers, ok := TripManager.RequestAmbulances(data)
	if !ok {
		handleError(conn, "Error sending the request to the ambulance finder service")
		return fmt.Errorf("ambulance request failed")
	}
	
	// Check if drivers are available
	if len(drivers) == 0 {
		fmt.Printf("No ambulance found nearby..\n")
		return nil
	}
	
	// Notify each driver
	notifyAvailableDrivers(drivers, reqID, data)
	return nil
}

// Helper function to notify available drivers
func notifyAvailableDrivers(drivers []Schemas.Driver, reqID int, data Schemas.TripRequest) {
	for _, driver := range drivers {
		fmt.Printf("Pinging the driver with ID %d\n", driver.DriverID)
		go EventEmitter.PingDrivers(driver.DriverID, reqID, data.PickupLocation, data.Destination, data.Fare, data.Latitude, data.Longitude)
	}
}

func HandleLocationUpdate(conn *websocket.Conn, payload map[string]any, typ string) {
	// Parse location update data
	locationData, ok := parseLocationUpdate(conn, payload)
	if !ok {
		return // Error already handled
	}
	
	// Determine HTTP method based on update type
	method := getMethodForLocationType(typ)
	
	// Send location update request
	if ok := TripManager.RequestLocationUpdate(locationData, method, typ); !ok {
		handleError(conn, fmt.Sprintf("Error while %sing location", typ))
		return
	}
	
	fmt.Printf("Location %sed successfully\n", typ)
}

// Helper function to parse location update
func parseLocationUpdate(conn *websocket.Conn, payload map[string]any) (Schemas.LocationUpdate, bool) {
	var data Schemas.LocationUpdate
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return data, false
	}
	return data, true
}

// Helper function to determine HTTP method
func getMethodForLocationType(typ string) string {
	if typ != "update" {
		return http.MethodPost
	}
	return http.MethodPut
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
	
	if !TripManager.RequestTripDecline(data.DriverID) {
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
	// Parse trip confirmation data
	tripConfirm, ok := parseTripConfirmation(conn, payload)
	if !ok {
		return // Error already handled
	}
	
	// Send confirmation to trip service
	tripID, ok := confirmTripWithService(conn, tripConfirm)
	if !ok {
		return // Error already handled
	}
	
	// Notify driver about confirmation
	ok = notifyDriverAboutConfirmation(conn, tripConfirm, tripID)
	if !ok {
		return // Error already handled
	}
	
	// Remove trip request
	ok = cleanupTripRequest(conn, tripConfirm.ReqID)
	if !ok {
		return // Error already handled
	}
	
	// Notify other drivers
	notifyOtherDrivers(tripConfirm)
}

// Helper function to parse trip confirmation
func parseTripConfirmation(conn *websocket.Conn, payload map[string]any) (Schemas.TripConfirm, bool) {
	var data Schemas.TripConfirm
	if err := decodePayload(payload, &data); err != nil {
		handleError(conn, DecodingError+err.Error())
		return data, false
	}
	return data, true
}

// Helper function to confirm trip with service
func confirmTripWithService(conn *websocket.Conn, data Schemas.TripConfirm) (int, bool) {
	res, ok := TripManager.RequestTripConfirmation(data)
	if !ok {
		handleError(conn, "Error sending trip confirmation request to the trip service")
		return 0, false
	}
	return res.TripID, true
}

// Helper function to notify driver about confirmation
func notifyDriverAboutConfirmation(conn *websocket.Conn, data Schemas.TripConfirm, tripID int) bool {
	if err := EventEmitter.SendTripConfirmation(data, tripID); err != nil {
		handleError(conn, "Error sending trip confirmation to the driver")
		return false
	}
	return true
}

// Helper function to cleanup trip request
func cleanupTripRequest(conn *websocket.Conn, reqID int) bool {
	if !TripManager.RequestTripRequestRemoval(reqID) {
		handleError(conn, "Error sending trip request removal request to the trip service")
		return false
	}
	
	TripManager.DeleteTripRequest(reqID)
	return true
}

// Helper function to notify other drivers
func notifyOtherDrivers(data Schemas.TripConfirm) {
	for driverID := range TripManager.ActiveTripRequest[data.ReqID].Drivers {
		if driverID == data.DriverID {
			continue
		}
		fmt.Printf("Notifying other drivers about the trip confirmation\n")
		go EventEmitter.NotifyOtherDriver(data.DriverID)
	}
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