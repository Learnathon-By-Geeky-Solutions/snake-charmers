package TripManager

import (
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func SendTripRequest(payload Schemas.TripRequest) (Schemas.RequestBase, error) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/new-request", data)
	var responseData Schemas.RequestBase
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return Schemas.RequestBase{}, err
	}
	return responseData, err
}

func RequestAmbulances(payload Schemas.TripRequest) ([]Schemas.Driver, error) {
	url := fmt.Sprintf("http://localhost:8000/api/ambulances?radius=5&latitude=%f&longitude=%f", payload.Latitude, payload.Longitude)
	res, err := Utils.MakeRequest(http.MethodGet, url, nil)
	var responseData []Schemas.Driver
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return []Schemas.Driver{}, err
	}
	return responseData, err
}

func RequestLocationUpdate(payload Schemas.LocationUpdate, method, typ string) error {
	url := fmt.Sprintf("http://localhost:8000/api/location/%s", typ)
	_, err := Utils.MakeRequest(method, url, payload)
	return err
}

func RequestTripCheckout(payload Schemas.TripCheckout) error {
	data := map[string]any{
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
	}
	_, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/engage-driver", data)
	return err
}

func RequestTripDecline(payload Schemas.TripDecline) error {
	url := fmt.Sprintf("http://localhost:8000/api/trip/release-driver?driver_id=%d", payload.DriverID)
	_, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestTripConfirmation(payload Schemas.TripConfirm) (Schemas.TripConfirmResponse, error) {
	res, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/start", payload)
	var responseData Schemas.TripConfirmResponse
	if err = json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return Schemas.TripConfirmResponse{}, err
	}

	return responseData, nil
}

func RequestTripRequestRemoval(reqID int) error {
	url := fmt.Sprintf("http://localhost:8000/api/trip/remove-request?req_id=%d", reqID)
	_, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestEndTrip(tripID int) error {
	data := map[string]any{
		"trip_id": tripID,
		"status":  "complete",
	}
	_, err := Utils.MakeRequest(http.MethodPut, "http://localhost:8000/api/trip/update-status", data)
	return err
}
