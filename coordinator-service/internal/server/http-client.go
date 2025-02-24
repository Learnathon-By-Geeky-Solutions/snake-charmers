package server

import (
	"coordinator-service/internal/schemas"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func SendTripRequest(payload schemas.TripRequest) (schemas.RequestBase, error) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/new-request", data)
	var responseData schemas.RequestBase
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return schemas.RequestBase{}, err
	}
	return responseData, err
}

func RequestAmbulances(payload schemas.TripRequest) ([]schemas.Driver, error) {
	url := fmt.Sprintf("http://localhost:8000/api/ambulances?radius=5&latitude=%f&longitude=%f", payload.Latitude, payload.Longitude)
	res, err := MakeRequest(http.MethodGet, url, nil)
	var responseData []schemas.Driver
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return []schemas.Driver{}, err
	}
	return responseData, err
}

func RequestLocationUpdate(payload schemas.LocationUpdate, method, typ string) error {
	url := fmt.Sprintf("http://localhost:8000/api/location/%s", typ)
	_, err := MakeRequest(method, url, payload)
	return err
}

func RequestTripCheckout(payload schemas.TripCheckout) error {
	data := map[string]any{
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
	}
	_, err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/engage-driver", data)
	return err
}

func RequestTripDecline(payload schemas.TripDecline) error {
	url := fmt.Sprintf("http://localhost:8000/api/trip/release-driver?driver_id=%d", payload.DriverID)
	_, err := MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestTripConfirmation(payload schemas.TripConfirm) (schemas.TripConfirmResponse, error) {
	res, err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/start", payload)
	var responseData schemas.TripConfirmResponse
	if err = json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return schemas.TripConfirmResponse{}, err
	}

	return responseData, nil
}

func RequestTripRequestRemoval(reqID int) error {
	url := fmt.Sprintf("http://localhost:8000/api/trip/remove-request?req_id=%d", reqID)
	_, err := MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestEndTrip(tripID int) error {
	data := map[string]any{
		"trip_id": tripID,
		"status":  "complete",
	}
	_, err := MakeRequest(http.MethodPut, "http://localhost:8000/api/trip/update-status", data)
	return err
}
