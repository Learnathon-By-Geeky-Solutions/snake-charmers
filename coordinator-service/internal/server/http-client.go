package server

import (
	"fmt"
	"net/http"
	"encoding/json"
	"log"
)

type TripRequest struct {
	RiderID        int     `json:"rider_id"`
	PickupLocation string  `json:"pickup_location"`
	Destination    string  `json:"destination"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
}
type LocationUpdate struct {
	DriverID  int     `json:"driver_id"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
type TripRequestResponse struct {
	ReqID int `json:"req_id"`
}
type SearchAmbulancesRequestResponse struct {
	DriverID int `json:"driver_id"`
	Name string `json:"driver_name"`
	Mobile string `json:"mobile"`
}
func SendTripRequest(payload TripRequest) (TripRequestResponse, error) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, err := MakeRequest(http.MethodGet, "http://localhost:8000/api/trip/request/add", data)
	var responseData TripRequestResponse
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return TripRequestResponse{}, err
	}
	return responseData, err
}

func SearchAmbulancesRequest(payload TripRequest) ([]SearchAmbulancesRequestResponse, error) {
	url := fmt.Sprintf("http://localhost:8000/api/ambulances/search?radius=5&latitude=%f&longitude=%f", payload.Latitude, payload.Longitude)
	res, err := MakeRequest(http.MethodGet, url, nil)
	var responseData []SearchAmbulancesRequestResponse
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return []SearchAmbulancesRequestResponse{}, err
	}
	return responseData, err
}

func LocationUpdateRequest(payload LocationUpdate, method, typ string) (any, error) {
	url := fmt.Sprintf("http://localhost:8000/api/location/%s", typ)
	res, err := MakeRequest(method, url, payload)
	return res, err
}

