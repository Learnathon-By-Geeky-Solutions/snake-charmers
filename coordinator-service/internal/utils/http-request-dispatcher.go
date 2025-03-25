package Utils

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

// HTTPClient with a timeout
var HTTPClient = &http.Client{Timeout: 5 * time.Second}

// MakeRequest is a generic function for handling HTTP requests (GET, POST, PUT, DELETE)
func MakeRequest(method, url string, payload any) ([]byte, *int, error) {
	// Convert payload to JSON if provided
	var jsonData []byte
	var err error
	if payload != nil {
		jsonData, err = marshalPayload(payload)
		if err != nil {
			return nil, nil, err
		}
	}

	// Create request with error handling
	req, err := createRequest(method, url, jsonData)
	if err != nil {
		return nil, nil, err
	}

	// Send request and handle response
	return executeRequest(req)
}

// marshalPayload converts payload to JSON
func marshalPayload(payload any) ([]byte, error) {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error marshalling JSON:", err)
		return nil, err
	}
	return jsonData, nil
}

// createRequest prepares the HTTP request
func createRequest(method, url string, jsonData []byte) (*http.Request, error) {
	var req *http.Request
	var err error

	// Create request based on payload
	if jsonData != nil {
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

	return req, nil
}

// executeRequest sends the request and processes the response
func executeRequest(req *http.Request) ([]byte, *int, error) {
	// Send request
	res, err := HTTPClient.Do(req)
	if err != nil {
		log.Println("Error making HTTP request:", err)
		return nil, nil, err
	}
	defer res.Body.Close()

	// Handle non-200 responses
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		log.Println("Received non-OK response:", res.Status)
		return nil, &res.StatusCode, nil
	}

	// Read response body
	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, nil, err
	}

	return body, &res.StatusCode, nil
}