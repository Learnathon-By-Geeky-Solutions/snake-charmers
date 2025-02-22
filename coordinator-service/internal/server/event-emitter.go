package server
import(
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
)
func PingDrivers(driverID int, reqID int, pickupLocation string, destination string) {
	// for driverID, conn := range drivers {
		// Prepare the event data
		eventData := map[string]any{
			"event":            "new-trip-request",
			"req_id":           reqID,
			"pickup_location":  pickupLocation,
			"destination":      destination,
		}

		// Marshal event data into JSON
		eventMessage, err := json.Marshal(eventData)
		if err != nil {
			fmt.Println("Failed to marshal event data:", err)
			return 
		}

		// Send the event to the driver
		err = drivers[driverID].WriteMessage(websocket.TextMessage, eventMessage)
		if err != nil {
			fmt.Println("Failed to send message to driver", driverID, ":", err)
		} else {
			fmt.Println("Event sent to driver", driverID)
		}
}

func SendBidFromDriver(payload BidFromDriver) (error){
	// Prepare the event data
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

	// Send the event to the rider
	clientID := ActiveTripRequest[payload.ReqID].ClientID
	err = riders[clientID].WriteMessage(websocket.TextMessage, eventMessage)
	if err != nil {
		fmt.Println("Failed to send message to rider", payload.ReqID, ":", err)
		return err
	}
	return nil
}
func SendBidFromClient(payload BidFromClient) (error){
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
	for _,driver := range ActiveTripRequest[payload.ReqID].Drivers {
		err = drivers[driver.DriverID].WriteMessage(websocket.TextMessage, eventMessage)
		if err != nil {
			Err = err
			fmt.Println("Failed to send message to driver", driver.DriverID, ":", err)
		}
	}
	return Err
}