package EventListener

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/client-manager"
	"coordinator-service/internal/services"
)

func ProcessEvents(conn *websocket.Conn, message []byte) {
	var event Schemas.Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		fmt.Println("Invalid event format:", err)
		return
	}

	switch event.Name {

		case "new-client":
			ClientManager.AddClient(conn, event.Data)

		case "request-trip":
			Services.HandleTripRequest(conn, event.Data)

		case "update-location":
			Services.HandleLocationUpdate(conn, event.Data, "update")
			fmt.Println("update-location:", event.Data)
			
		case "add-location":
			Services.HandleLocationUpdate(conn, event.Data, "add")
			fmt.Println("update-location:", event.Data)

		case "checkout-trip":
			Services.HandleTripRequestCheckout(conn, event.Data)
			fmt.Println("trip-checkout:", event.Data)

		case "place-bid-driver":
			Services.HandleBidFromDriver(conn, event.Data)
			fmt.Println("place-bid-driver:", event.Data)

		case "place-bid-rider":
			Services.HandleBidFromClient(conn, event.Data)
			fmt.Println("place-bid-rider:", event.Data)

		case "confirm-trip":
			Services.HandleTripConfirmation(conn, event.Data)
			fmt.Println("confirm-trip:", event.Data)

		case "decline-trip":
			Services.HandleTripRequestDecline(conn, event.Data)
			fmt.Println("decline-trip:", event.Data)

		case "end-trip":
			Services.HandleEndTrip(conn, event.Data)
			fmt.Println("end-trip:", event.Data)

		default:
			fmt.Println("unknown-event:", event.Name)
	}
}