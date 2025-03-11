package main

import (
	"fmt"
	"log"
	"net/http"
	"coordinator-service/pkg"
	"coordinator-service/internal/server"
	"github.com/joho/godotenv"
)
func loadEnv() {
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Print(err)
		log.Println("Error loading .env file")
	}
}

func main() {
	loadEnv()
	port := ":" + pkg.Config.Port

	// Initialize WebSocket server
	http.HandleFunc("/ws", Server.HandleConnections)
	// Start broadcaster
	// go server.HandleMessages()

	fmt.Println("WebSocket Server started on port", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
