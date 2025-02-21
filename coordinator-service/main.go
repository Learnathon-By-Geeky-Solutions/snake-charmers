package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections
	},
}

// Store clients
var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan string)
var mutex = sync.Mutex{} // Prevent concurrent map access

// Handle WebSocket connections
func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket Upgrade Error:", err)
		return
	}

	// Add the new client
	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	fmt.Println("New client connected:", conn.RemoteAddr())

	// Handle this client in a separate Goroutine
	go handleClient(conn)
}

// Handles messages from a single WebSocket connection
func handleClient(conn *websocket.Conn) {
	defer func() {
		// Cleanup on disconnect
		mutex.Lock()
		delete(clients, conn)
		mutex.Unlock()
		conn.Close()
		fmt.Println("Client disconnected:", conn.RemoteAddr())
	}()

	// Read messages from the client
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break // Exit if client disconnects
		}
		broadcast <- string(message)
	}
}

// Broadcasts messages to all connected clients
func handleMessages() {
	for {
		message := <-broadcast

		mutex.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, []byte(message))
			if err != nil {
				fmt.Println("Error sending message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}

func main() {
	// WebSocket endpoint
	http.HandleFunc("/ws", handleConnections)

	// Start message broadcaster in a separate Goroutine
	go handleMessages()

	port := "8080"
	fmt.Println("WebSocket Server started on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}