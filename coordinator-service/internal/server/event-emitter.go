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