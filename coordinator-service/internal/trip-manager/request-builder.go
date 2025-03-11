package TripManager

import (
	"coordinator-service/internal/schemas"
	"coordinator-service/internal/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)


func SendTripRequest(payload Schemas.TripRequest) (Schemas.RequestBase, bool) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, statusCode, err := Utils.MakeRequest(http.MethodPost, fmt.Sprintf("%s/new-request", os.Getenv("TRIP_SERVICE_URL")), data)
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
	url := fmt.Sprintf("%s?radius=5&lat=%f&lon=%f",os.Getenv("AMBULANCE_FINDER_URL"), payload.Latitude, payload.Longitude)
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
	url := fmt.Sprintf("%s/%s", os.Getenv("LOCATION_SERVICE_URL"), typ)
	_, statusCode, err := Utils.MakeRequest(method, url, payload)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}
func RequestLocationRemoval(id int) {
	url := fmt.Sprintf("%s/remove?driver_id=%d", os.Getenv("LOCATION_SERVICE_URL"), id)
	_, statusCode, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		fmt.Println(fmt.Errorf("error while removing location"))
	}
	fmt.Printf("Successfully remove location for the disconneted driver having id %d\n", id)
}

func RequestTripCheckout(payload Schemas.TripCheckout) bool {
	data := map[string]any{
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
	}
	_, statusCode, err := Utils.MakeRequest(http.MethodPost, fmt.Sprintf("%s/engage-driver", os.Getenv("TRIP_SERVICE_URL")), data)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}

func RequestTripDecline(payload Schemas.TripDecline) bool {
	url := fmt.Sprintf("%s/release-driver?driver_id=%d", os.Getenv("TRIP_SERVICE_URL"), payload.DriverID)
	_, statusCode, err := Utils.MakeRequest(http.MethodDelete, url, nil)
	if err == nil && (*statusCode == 404 || *statusCode == 204) {
		return true
	}
	return true
}

func RequestTripConfirmation(payload Schemas.TripConfirm) (Schemas.TripConfirmResponse, bool) {
	res, statusCode, err := Utils.MakeRequest(http.MethodPost, fmt.Sprintf("%s/start", os.Getenv("TRIP_SERVICE_URL")), payload)
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
	url := fmt.Sprintf("%s/remove-request/%d",os.Getenv("TRIP_SERVICE_URL"), reqID)
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
	_, statusCode, err := Utils.MakeRequest(http.MethodPut, fmt.Sprintf("%s/update-status",os.Getenv("TRIP_SERVICE_URL")), data)
	if err != nil || *statusCode < 200 || *statusCode >= 300 {
		return false
	}
	return true
}
