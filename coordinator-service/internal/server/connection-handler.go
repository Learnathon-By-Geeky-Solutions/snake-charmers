package Server

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	ClientManager "coordinator-service/internal/client-manager"
	EventListener "coordinator-service/internal/event-listener"
)



// handleMessages processes incoming messages from a WebSocket connection
func handleMessages(conn *websocket.Conn) {
	defer ClientManager.RemoveClient(conn)
	
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break // Exit loop if error occurs (disconnect)
		}
		EventListener.ProcessEvents(conn, message)
	}
}

// HandleConnections is the main WebSocket connection handler
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	// Authenticate the request
	if err := authenticateRequest(w, r); err != nil {
		return // Authentication failed, response already sent
	}
	
	// Upgrade connection to WebSocket
	conn, err := UpgradeConnection(w, r)
	if err != nil {
		return // Error already logged and response sent
	}
	
	// Handle messages in a separate Goroutine
	go handleMessages(conn)
}