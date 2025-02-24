package server
import(
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/schemas"
)
func PingDrivers(driverID int, reqID int, pickupLocation string, destination string) {

		driverConn, exists := activeDrivers[driverID]
		if !exists {
			fmt.Println("Driver not found for ID", driverID)
			return
		}
		eventData := map[string]any{
			"event":            "new-trip-request",
			"req_id":           reqID,
			"pickup_location":  pickupLocation,
			"destination":      destination,
		}

		eventMessage, err := json.Marshal(eventData)
		if err != nil {
			fmt.Println("Failed to marshal event data:", err)
			return 
		}

		// Send the event to the driver
		err = driverConn.WriteMessage(websocket.TextMessage, eventMessage)
		if err != nil {
			fmt.Println("Failed to send message to driver", driverID, ":", err)
		} else {
			fmt.Println("Event sent to driver", driverID)
		}
}

func SendBidFromDriver(payload schemas.BidFromDriver) (error){
	// Prepare the event data
	riderID := ActiveTripRequest[payload.ReqID].ClientID
	riderConn, exists := activeRiders[riderID]
	if !exists {
		fmt.Println("Driver not found for ID",  riderID)
		// return error
	}

	eventData := map[string]any{
		"event":     "bid-from-driver",
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
		"amount":    payload.Amount,
	}
	
	// Marshal event data into JSON
	eventMessage, err := json.Marshal(eventData)
	if err != nil {
		fmt.Println("Failed to marshal event data:", err)
		return err
	}
	
	err = riderConn.WriteMessage(websocket.TextMessage, eventMessage)
	// Send the event to the rider
	if err != nil {
		fmt.Println("Failed to send message to rider", payload.ReqID, ":", err)
		return err
	}
	return nil
}
func SendBidFromClient(payload schemas.BidFromClient) (error){
	// Prepare the event data
	eventData := map[string]any{
		"event":     "bid-from-client",
		"req_id":    payload.ReqID,
		"amount":    payload.Amount,
	}
	// Marshal event data into JSON
	eventMessage, err := json.Marshal(eventData)
	if err != nil {
		fmt.Println("Failed to marshal event data:", err)
		return err
	}
	//send event to the drivers
	var Err error = nil
	for driverID,_ := range ActiveTripRequest[payload.ReqID].Drivers {
		driverConn, exists := activeDrivers[driverID]
		if !exists {
			fmt.Println("Driver not found for ID", driverID)
			continue
		}
		err = driverConn.WriteMessage(websocket.TextMessage, eventMessage)
		if err != nil {
			Err = err
			fmt.Println("Failed to send message to driver", driverID, ":", err)
		}
	}
	return Err
}

func SendTripConfirmation(payload schemas.TripConfirmResponse)(error){
	driverConn, exists := activeDrivers[payload.DriverID]
	if !exists {
		fmt.Println("Driver not found for ID", payload.DriverID)
		// return error
	}
	eventData := map[string]any{
		"event":          "trip-confirmed",
		"trip_id":         payload.TripID,
		"rider_id":        payload.RiderID,
		"driver_id":       payload.DriverID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
		"fare":            payload.Fare,
		"status":          payload.Status,
	}
	eventMessage, err := json.Marshal(eventData)
	if err != nil {
		fmt.Println("Failed to marshal event data:", err)
		return err
	}
	err = driverConn.WriteMessage(websocket.TextMessage, eventMessage)
	return err
}

func NotifyOtherDriver(driverID int)(error){
	driverConn, exists := activeDrivers[driverID]
	if !exists {
		fmt.Println("Driver not found for ID", driverID)
		// return error
	}
	eventData := map[string]any{
		"event":  "trip-booked",
	}
	eventMessage, err := json.Marshal(eventData)
	if err != nil {
		fmt.Println("Failed to marshal event data:", err)
		return err
	}
	err = driverConn.WriteMessage(websocket.TextMessage, eventMessage)
	return err
}