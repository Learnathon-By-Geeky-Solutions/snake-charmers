package main

import (
	"fmt"
	"log"
	"net/http"
	"coordinator-service/pkg"
	"coordinator-service/internal/server"
)

func main() {
	port := ":" + pkg.Config.Port

	// Initialize WebSocket server
	http.HandleFunc("/ws", server.HandleConnections)

	// Start broadcaster
	// go server.HandleMessages()

	fmt.Println("WebSocket Server started on port", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
