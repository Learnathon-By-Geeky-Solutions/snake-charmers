package server

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

type Event struct {
	Name string  `json:"name"` // Event type (e.g., "message", "join")
	Data any `json:"data"` // Event data (message content, user details)
}

func ProcessEvent(conn *websocket.Conn, message []byte) {
	fmt.Println("Processing event:", string(message))
	var event Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		fmt.Println("Invalid event format:", err)
		return
	}

	switch event.Name {
	case "message":
		fmt.Println("Received message event:", event.Data)
		// BroadcastMessage(message)
	case "join":
		fmt.Println("User joined:", event.Data)
		// BroadcastMessage([]byte(`{"name":"system", "data":"A new user joined"}`))
	case "leave":
		fmt.Println("User left:", event.Data)
		// BroadcastMessage([]byte(`{"name":"system", "data":"A user left"}`))
	default:
		fmt.Println("Unknown event:", event.Name)
	}
}