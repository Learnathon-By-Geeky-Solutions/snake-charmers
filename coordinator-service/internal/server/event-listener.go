package server

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
)

type Event struct {
	Name string  `json:"name"` 
	Data any `json:"data"`
}

func ProcessEvents(conn *websocket.Conn, message []byte) {
	var event Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		fmt.Println("Invalid event format:", err)
		return
	}

	switch event.Name {

		case "new-client":
			AddClient(conn, event.Data)

		case "request-trip":
			HandleTripRequest(conn, event.Data)

		case "update-location":
			HandleLocationUpdate(conn, event.Data, "update")
			fmt.Println("update-location:", event.Data)
			
		case "add-location":
			HandleLocationUpdate(conn, event.Data, "add")
			fmt.Println("update-location:", event.Data)

		case "checkout-trip":
			HandleTripRequestCheckout(conn, event.Data)
			fmt.Println("trip-checkout:", event.Data)

		case "place-bid-driver":
			HandleBidFromDriver(conn, event.Data)
			fmt.Println("place-bid-driver:", event.Data)

		case "place-bid-client":
			HandleBidFromClient(conn, event.Data)
			fmt.Println("place-bid-client:", event.Data)

		case "confirm-trip":
			HandleTripConfirmation(conn, event.Data)
			fmt.Println("confirm-trip:", event.Data)

		case "decline-trip":
			HandleTripRequestDecline(conn, event.Data)
			fmt.Println("decline-trip:", event.Data)

		case "end-trip":
			HandleEndTrip(conn, event.Data)
			fmt.Println("end-trip:", event.Data)

		default:
			fmt.Println("unknown-event:", event.Name)
	}
}