package ClientManager

import (
	"fmt"
	"sync"
	"github.com/mitchellh/mapstructure"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/trip-manager"

)

type ClientInfo struct {
	ID   int    `json:"id"`
	Role string `json:"role"`
}

var mutex = sync.Mutex{} 

var clients = make(map[*websocket.Conn]ClientInfo)
var ActiveDrivers = make(map[int]*websocket.Conn)
var ActiveRiders = make(map[int]*websocket.Conn)

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
		fmt.Println("A driver connected. ")
		ActiveDrivers[data.ID] = conn
		fmt.Println("driver joined:", conn.RemoteAddr())
	} else if data.Role == "rider" {
		fmt.Println("A rider connected. ")
		ActiveRiders[data.ID] = conn
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
			go TripManager.RequestLocationRemoval(client.ID)
			delete(ActiveDrivers, client.ID)

		} else {
			delete(ActiveRiders, client.ID)
		}
		delete(clients, conn)
	}
	mutex.Unlock()
	fmt.Println("Client removed:", conn.RemoteAddr())
}
