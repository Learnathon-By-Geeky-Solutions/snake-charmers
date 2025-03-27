package EventEmitter

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/client-manager"
	"coordinator-service/internal/trip-manager"
)

const (
	MarshalError       = "Failed to marshal event data:"
	DriverNotFoundMsg  = "driver not found for ID"
)

// sendWebSocketMessage is a generic function to send WebSocket messages
func sendWebSocketMessage(conn *websocket.Conn, eventData map[string]any) error {
	eventMessage, err := json.Marshal(eventData)
	if err != nil {
		fmt.Println(MarshalError, err)
		return err
	}

	err = conn.WriteMessage(websocket.TextMessage, eventMessage)
	if err != nil {
		fmt.Println("Failed to send WebSocket message:", err)
		return err
	}
	return nil
}

// getClientConnection retrieves a WebSocket connection based on client type
func getClientConnection(clientType string, id int) (*websocket.Conn, bool) {
	switch clientType {
	case "driver":
		conn, exists := ClientManager.ActiveDrivers[id]
		return conn, exists
	case "rider":
		conn, exists := ClientManager.ActiveRiders[id]
		return conn, exists
	default:
		return nil, false
	}
}

func PingDrivers(driverID int, reqID int, pickupLocation string, destination string, fare int, latitude float64, longitude float64) {
	driverConn, exists := getClientConnection("driver", driverID)
	if !exists {
		fmt.Printf("driver with ID %d not found for pinging\n", driverID)
		return
	}

	eventData := map[string]any{
		"event": "new-trip-request",
		"data": map[string]any{
			"req_id":          reqID,
			"pickup_location": pickupLocation,
			"destination":     destination,
			"fare":            fare,
			"latitude":        latitude,
			"longitude":       longitude,
		},
	}

	if err := sendWebSocketMessage(driverConn, eventData); err != nil {
		fmt.Println("Failed to ping driver with id ", driverID)
		return
	}
	fmt.Println("Ping sent to driver with id ", driverID)
}

func SendLocationOfDriver(conn *websocket.Conn, latitude float64, longitude float64) {
	eventData := map[string]any{
		"event": "driver-location",
		"data": map[string]any{
			"latitude":  latitude,
			"longitude": longitude,
		},
	}

	if err := sendWebSocketMessage(conn, eventData); err != nil {
		fmt.Println("Failed to send location of driver:", err)
		return
	}
	fmt.Println("Sent location of driver to the client")
}

func SendBidFromDriver(payload Schemas.BidFromDriver) error {
	riderID := TripManager.ActiveTripRequest[payload.ReqID].ClientID
	riderConn, exists := getClientConnection("rider", riderID)
	if !exists {
		return fmt.Errorf("rider with ID %d not found for sending bid from driver", riderID)
	}

	eventData := map[string]any{
		"event": "bid-from-driver",
		"data": map[string]any{
			"req_id":    payload.ReqID,
			"driver_id": payload.DriverID,
			"amount":    payload.Amount,
			"name":      payload.Name,
			"mobile":    payload.Mobile,
		},
	}

	return sendWebSocketMessage(riderConn, eventData)
}

func SendBidFromClient(payload Schemas.BidFromClient) error {
	eventData := map[string]any{
		"event": "bid-from-rider",
		"data": map[string]any{
			"req_id": payload.ReqID,
			"amount": payload.Amount,
		},
	}

	return broadcastToDrivers(payload.ReqID, eventData)
}

func broadcastToDrivers(reqID int, eventData map[string]any) error {
	var lastError error
	drivers := TripManager.ActiveTripRequest[reqID].Drivers

	for driverID := range drivers {
		driverConn, exists := getClientConnection("driver", driverID)
		if !exists {
			fmt.Println(DriverNotFoundMsg, driverID)
			continue
		}

		if err := sendWebSocketMessage(driverConn, eventData); err != nil {
			lastError = err
			fmt.Println("Failed to send message to driver", driverID, ":", err)
		}
	}

	return lastError
}

func SendTripConfirmation(payload Schemas.TripConfirmResponse) error {
	driverConn, exists := getClientConnection("driver", payload.DriverID)
	if !exists {
		fmt.Println(DriverNotFoundMsg, payload.DriverID)
		return fmt.Errorf(DriverNotFoundMsg+" %d", payload.DriverID)
	}

	eventData := map[string]any{
		"event": "trip-confirmed",
		"data": map[string]any{
			"trip_id":         payload.TripID,
			"rider_id":        payload.RiderID,
			"driver_id":       payload.DriverID,
			"pickup_location": payload.PickupLocation,
			"destination":     payload.Destination,
			"fare":            payload.Fare,
			"status":          payload.Status,
		},
	}

	return sendWebSocketMessage(driverConn, eventData)
}

func SendEndTripNotification(riderID int) {
	riderConn, exists := getClientConnection("rider", riderID)
	if !exists {
		fmt.Println("Rider not found for ID", riderID)
		return
	}

	eventData := map[string]any{
		"event": "trip-ended",
	}

	if err := sendWebSocketMessage(riderConn, eventData); err != nil {
		fmt.Println("Failed to send message to rider", riderID, ":", err)
	}
}

func NotifyOtherDriver(driverID int) error {
	driverConn, exists := getClientConnection("driver", driverID)
	if !exists {
		fmt.Println(DriverNotFoundMsg, driverID)
		return fmt.Errorf(DriverNotFoundMsg+" %d", driverID)
	}

	eventData := map[string]any{
		"event": "trip-booked",
	}

	return sendWebSocketMessage(driverConn, eventData)
}

func SendErrorMessage(conn *websocket.Conn) {
	eventData := map[string]any{
		"event": "unexpected-error",
	}

	if err := sendWebSocketMessage(conn, eventData); err != nil {
		fmt.Println("Failed to send error message to client:", err)
	}
}