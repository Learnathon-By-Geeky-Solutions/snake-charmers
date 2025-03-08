package Server

import (
	"fmt"
	"net/http"
	"coordinator-service/internal/client-manager"
	"coordinator-service/internal/event-listener"
	"github.com/gorilla/websocket"
)


// Handle WebSocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := UpgradeConnection(w, r)
	if err != nil {
		return
	}
	
	// Handle messages in a separate Goroutine
	go handleMessages(conn)

}

func handleMessages(conn *websocket.Conn){
	defer ClientManager.RemoveClient(conn)
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Error reading message:", err)
				break // Exit loop if error occurs (disconnect)
			}
			EventListener.ProcessEvents(conn, message)
		}
}