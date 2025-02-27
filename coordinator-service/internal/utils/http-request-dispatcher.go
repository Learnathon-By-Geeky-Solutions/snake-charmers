package Utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// HTTPClient with a timeout
var HTTPClient = &http.Client{Timeout: 5 * time.Second}

// MakeRequest is a generic function for handling HTTP requests (GET, POST, PUT, DELETE)
func MakeRequest(method, url string, payload any) ([]byte, error) {
	var req *http.Request
	var err error

	// Convert payload to JSON if provided
	var jsonData []byte
	if payload != nil {
		jsonData, err = json.Marshal(payload)
		if err != nil {
			log.Println("Error marshalling JSON:", err)
			return nil, err
		}
	}

	// Create a new HTTP request
	if payload != nil {
		req, err = http.NewRequest(method, url, bytes.NewBuffer(jsonData))
	} else {
		req, err = http.NewRequest(method, url, nil)
	}
	if err != nil {
		log.Println("Error creating HTTP request:", err)
		return nil, err
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// Send request
	res, err := HTTPClient.Do(req)
	if err != nil {
		log.Println("Error making HTTP request:", err)
		return nil, err
	}
	defer res.Body.Close()

	// Handle non-200 responses
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		log.Println("Received non-OK response:", res.Status)
		return nil, fmt.Errorf("HTTP error: %s", res.Status)
	}

	// Read response body
	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}
	return body, err
}
