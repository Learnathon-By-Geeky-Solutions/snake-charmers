package server

import (
	"encoding/json"
	"fmt"
	"github.com/mitchellh/mapstructure"
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
			var data ClientInfo
			err := mapstructure.Decode(event.Data, &data)
			if err != nil {
				fmt.Println("Failed to decode client payload:", err)
				return
			}
			AddClient(conn, data)

		case "request-trip":
			HandleTripRequest(conn, event.Data)

		case "update-location":
			HandleLocationUpdate(conn, event.Data)
			fmt.Println("update-location:", event.Data)

		case "checkout-trip":
			// HandleTripCheckout(conn, event.Data)
			fmt.Println("trip-checkout:", event.Data)

		case "place-bid-driver":
			// HandleBidFromDriver(conn, event.Data)
			fmt.Println("place-bid-driver:", event.Data)

		case "place-bid-client":
			// HandleBidFromClient(conn, event.Data)
			fmt.Println("place-bid-client:", event.Data)

		case "confirm-trip":
			// HandleTripConfirmation(conn, event.Data)
			fmt.Println("confirm-trip:", event.Data)

		case "decline-trip":
			// HandleTripDecline(conn, event.Data)
			fmt.Println("decline-trip:", event.Data)

		case "end-trip":
			// HandleEndTrip(conn, event.Data)
			fmt.Println("end-trip:", event.Data)

		default:
			fmt.Println("unknown-event:", event.Name)
	}
}