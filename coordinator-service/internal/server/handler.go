package server

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

// Handle WebSocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := UpgradeConnection(w, r)
	if err != nil {
		return
	}
	// AddClient(conn)
	// fmt.Println("New client connected:", conn.RemoteAddr())
	
	// Handle messages in a separate Goroutine
	go handleMessages(conn)

}

func handleMessages(conn *websocket.Conn){
	defer RemoveClient(conn)
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Error reading message:", err)
				break // Exit loop if error occurs (disconnect)
			}
			ProcessEvents(conn, message)
		}
}