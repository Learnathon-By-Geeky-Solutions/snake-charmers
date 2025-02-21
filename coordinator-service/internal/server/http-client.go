package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"log"
	"fmt"
	
)
type TripRequest struct {
	RiderID  int    `json:"rider_id"`
	PickupLocation  string `json:"pickup_location"`
	Destination string `json:"destination"`
}
type AmbulanceRequest struct {
	Radius    int     `json:"radius"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

func SendTripRequest(payload TripRequest) (*http.Response, error){
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error marshalling JSON:", err)
		return nil, err
	}
	res, err := http.Post("http://localhost:8000/api/trip/request/add", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Println("Error making HTTP request:", err)
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		log.Println("Received non-OK response:", res.Status)
		return nil, fmt.Errorf("Received non-OK response: %s", res.Status)	
	}
	return res, nil
}

func SearchAmbulances(payload AmbulanceRequest) (map[string]any, error) {

	url := fmt.Sprintf("http://localhost:8000/api/ambulances/search?radius=%d&latitude=%f&longitude=%f", payload.Radius, payload.Latitude, payload.Longitude)
	res, err := http.Get(url)
	if err != nil {
		log.Println("Error making HTTP request:", err)
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Println("Received non-OK response:", res.Status)
		return nil, fmt.Errorf("Received non-OK response: %s", res.Status)
	}

	var responseData map[string]any
	if err := json.NewDecoder(res.Body).Decode(&responseData); err != nil {
		log.Println("Error decoding response JSON:", err)
		return nil, err
	}
	return responseData, nil
}