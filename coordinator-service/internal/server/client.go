package server

import (
	"fmt"
	"sync"
	"github.com/mitchellh/mapstructure"
	"github.com/gorilla/websocket"
)

type ClientInfo struct {
	ID   int    `json:"id"`
	Role string `json:"role"`
}

var mutex = sync.Mutex{} 

var clients = make(map[*websocket.Conn]ClientInfo)
var activeDrivers = make(map[int]*websocket.Conn)
var activeRiders = make(map[int]*websocket.Conn)

func AddClient(conn *websocket.Conn, payload any) {

	var data ClientInfo
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode client payload:", err)
		return
	}

	mutex.Lock()
	clients[conn] = data
	if data.Role == "driver" {
		activeDrivers[data.ID] = conn
		fmt.Println("driver joined:", conn.RemoteAddr())
	} else if data.Role == "rider" {
		activeRiders[data.ID] = conn
		fmt.Println("rider joined:", conn.RemoteAddr())
	}
	mutex.Unlock()
	fmt.Println("Client added:", data)
}

// Remove a client from the map
func RemoveClient(conn *websocket.Conn) {
	mutex.Lock()
	client, exists := clients[conn]
	if exists {
		if client.Role == "driver" {
			delete(activeDrivers, client.ID)
		} else {
			delete(activeRiders, client.ID)
		}
		delete(clients, conn)
	}
	mutex.Unlock()
	fmt.Println("Client removed:", conn.RemoteAddr())
}
