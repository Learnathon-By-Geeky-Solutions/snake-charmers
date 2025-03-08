package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Define a struct to represent the expected JSON payload
type RequestPayload struct {
	Msg  string `json:"msg"`  // Exported field (uppercase)
	Data map[string]any    `json:"data"` // Exported field (uppercase)
}

// Handler function to process incoming requests
func handler(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON body into the RequestPayload struct
	var payload RequestPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Print the received data
	fmt.Printf("Received payload: %+v\n", payload)
	fmt.Printf("Type of payload.Data: %v\n", payload.Data)

	// Respond to the client
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Payload received successfully"))
}

func main() {
	// Define the route and handler
	http.HandleFunc("/process", handler)

	// Start the server on port 8080
	port := ":8080"
	fmt.Printf("Server is listening on port %s...\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Could not start server: %v\n", err)
	}
}