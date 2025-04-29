package main

import (
	"fmt"
	"log"
	"net/http"
	"coordinator-service/pkg"
	"coordinator-service/internal/server"
)

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func main() {
	
	port := ":" + pkg.Config.Port

	// Initialize WebSocket server
	http.HandleFunc("/ws", Server.HandleConnections)

	http.HandleFunc("/healthz", healthCheckHandler)

	fmt.Println("WebSocket Server started on port", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
