package server

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

type ClientInfo struct {
	ID   int    `json:"id"`
	Role string `json:"role"`
}

var mutex = sync.Mutex{} 

var clients = make(map[*websocket.Conn]ClientInfo)
var drivers = make(map[int]*websocket.Conn)
var riders = make(map[int]*websocket.Conn)

func AddClient(conn *websocket.Conn, payload ClientInfo) {

	mutex.Lock()
	clients[conn] = payload
	if payload.Role == "driver" {
		drivers[payload.ID] = conn
		fmt.Println("driver joined:", conn.RemoteAddr())
	} else if payload.Role == "rider" {
		riders[payload.ID] = conn
		fmt.Println("rider joined:", conn.RemoteAddr())
	}
	mutex.Unlock()
	fmt.Println("Client added:", payload)
}

// Remove a client from the map
func RemoveClient(conn *websocket.Conn) {
	mutex.Lock()
	client, exists := clients[conn]
	if exists {
		if client.Role == "driver" {
			delete(drivers, client.ID)
		} else {
			delete(riders, client.ID)
		}
		delete(clients, conn)
	}
	mutex.Unlock()
	fmt.Println("Client removed:", conn.RemoteAddr())
}
