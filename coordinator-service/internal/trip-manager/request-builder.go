package TripManager

import (
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func SendTripRequest(payload Schemas.TripRequest) (Schemas.RequestBase, bool) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, statusCode, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/new-request", data)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return Schemas.RequestBase{}, false
	}
	var responseData Schemas.RequestBase
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return Schemas.RequestBase{}, false
	}
	return responseData, true
}

func RequestAmbulances(payload Schemas.TripRequest) ([]Schemas.Driver, bool) {
	url := fmt.Sprintf("http://localhost:8000/api/ambulances?radius=5&latitude=%f&longitude=%f", payload.Latitude, payload.Longitude)
	res, statusCode,err := Utils.MakeRequest(http.MethodGet, url, nil)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return []Schemas.Driver{}, false
	}
	var responseData []Schemas.Driver
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return []Schemas.Driver{}, false
	}
	return responseData, true
}

func RequestLocationUpdate(payload Schemas.LocationUpdate, method, typ string) bool {
	url := fmt.Sprintf("http://localhost:8000/api/location/%s", typ)
	_, statusCode, err := Utils.MakeRequest(method, url, payload)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}

func RequestTripCheckout(payload Schemas.TripCheckout) bool {
	data := map[string]any{
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
	}
	_, statusCode, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/engage-driver", data)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}

func RequestTripDecline(payload Schemas.TripDecline) bool {
	url := fmt.Sprintf("http://localhost:8000/api/trip/release-driver?driver_id=%d", payload.DriverID)
	_, statusCode, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}

func RequestTripConfirmation(payload Schemas.TripConfirm) (Schemas.TripConfirmResponse, bool) {
	res, statusCode, err := Utils.MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/start", payload)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return Schemas.TripConfirmResponse{}, false
	}
	var responseData Schemas.TripConfirmResponse
	if err = json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return Schemas.TripConfirmResponse{}, false
	}

	return responseData, true
}

func RequestTripRequestRemoval(reqID int) bool {
	url := fmt.Sprintf("http://localhost:8000/api/trip/remove-request?req_id=%d", reqID)
	_, statusCode, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}

func RequestEndTrip(tripID int) bool {
	data := map[string]any{
		"trip_id": tripID,
		"status":  "complete",
	}
	_, statusCode, err := Utils.MakeRequest(http.MethodPut, "http://localhost:8000/api/trip/update-status", data)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}
