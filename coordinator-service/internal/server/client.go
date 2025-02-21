package server

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

// Store active clients
var clients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{} // Prevents concurrent map modifications

// Add a client to the map
func AddClient(conn *websocket.Conn) {
	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()
	fmt.Println("Client added:", conn.RemoteAddr())
}

// Remove a client from the map
func RemoveClient(conn *websocket.Conn) {
	mutex.Lock()
	delete(clients, conn)
	mutex.Unlock()
	fmt.Println("Client removed:", conn.RemoteAddr())
}
