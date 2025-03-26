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

// RequestConfig holds configuration for HTTP requests
type RequestConfig struct {
	URL        string
	Method     string
	Data       interface{}
	Target     interface{}
	StatusOpts []int
}

// makeServiceRequest is a generic function to handle HTTP requests
func makeServiceRequest(config RequestConfig) (bool, error) {
	if config.StatusOpts == nil {
		config.StatusOpts = []int{200, 201, 202, 203, 204}
	}

	res, statusCode, err := Utils.MakeRequest(config.Method, config.URL, config.Data)
	if err != nil {
		return false, err
	}

	// Check if status code is acceptable
	statusValid := false
	for _, validStatus := range config.StatusOpts {
		if *statusCode == validStatus {
			statusValid = true
			break
		}
	}

	if !statusValid {
		return false, fmt.Errorf("invalid status code: %d", *statusCode)
	}

	// Unmarshal if target is provided
	if config.Target != nil {
		if err := json.Unmarshal(res, config.Target); err != nil {
			log.Printf("Error parsing JSON: %v", err)
			return false, err
		}
	}

	return true, nil
}

// SendTripRequest creates a new trip request
func SendTripRequest(payload Schemas.TripRequest) (Schemas.RequestBase, bool) {
	data := map[string]interface{}{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}

	var responseData Schemas.RequestBase
	config := RequestConfig{
		URL:     fmt.Sprintf("%s/new-request", os.Getenv("TRIP_SERVICE_URL")),
		Method:  http.MethodPost,
		Data:    data,
		Target:  &responseData,
	}

	ok, err := makeServiceRequest(config)
	if err != nil || !ok {
		return Schemas.RequestBase{}, false
	}

	return responseData, true
}

// RequestAmbulances finds available ambulances within a radius
func RequestAmbulances(payload Schemas.TripRequest) ([]Schemas.Driver, bool) {
	url := fmt.Sprintf("%s?radius=5&lat=%f&lon=%f", 
		os.Getenv("AMBULANCE_FINDER_URL"), 
		payload.Latitude, 
		payload.Longitude,
	)

	var drivers []Schemas.Driver
	config := RequestConfig{
		URL:     url,
		Method:  http.MethodGet,
		Target:  &drivers,
	}

	ok, err := makeServiceRequest(config)
	if err != nil || !ok {
		return []Schemas.Driver{}, false
	}

	return drivers, true
}

// RequestLocationUpdate updates location information
func RequestLocationUpdate(payload Schemas.LocationUpdate, method, typ string) bool {
	url := fmt.Sprintf("%s/%s", os.Getenv("LOCATION_SERVICE_URL"), typ)
	
	config := RequestConfig{
		URL:     url,
		Method:  method,
		Data:    payload,
	}

	ok, _ := makeServiceRequest(config)
	return ok
}

// RequestLocationRemoval removes a driver's location
func RequestLocationRemoval(id int) {
	url := fmt.Sprintf("%s/remove?driver_id=%d", os.Getenv("LOCATION_SERVICE_URL"), id)
	
	config := RequestConfig{
		URL:     url,
		Method:  http.MethodDelete,
		StatusOpts: []int{200, 204, 404},
	}

	ok, err := makeServiceRequest(config)
	if !ok {
		log.Printf("Error removing location for driver %d: %v", id, err)
		return
	}
	log.Printf("Successfully removed location for disconnected driver %d", id)
}

// RequestTripCheckout handles driver engagement for a trip
func RequestTripCheckout(payload Schemas.TripCheckout) bool {
	data := map[string]interface{}{
		"req_id":    payload.ReqID,
		"driver_id": payload.DriverID,
	}

	config := RequestConfig{
		URL:     fmt.Sprintf("%s/engage-driver", os.Getenv("TRIP_SERVICE_URL")),
		Method:  http.MethodPost,
		Data:    data,
	}

	ok, _ := makeServiceRequest(config)
	return ok
}

// RequestTripDecline handles driver release from a trip
func RequestTripDecline(DriverID int) bool {
	url := fmt.Sprintf("%s/release-driver?driver_id=%d", os.Getenv("TRIP_SERVICE_URL"), DriverID)
	
	config := RequestConfig{
		URL:     url,
		Method:  http.MethodDelete,
		StatusOpts: []int{200, 204, 404},
	}

	ok, _ := makeServiceRequest(config)
	return ok
}

// RequestTripConfirmation confirms and starts a trip
func RequestTripConfirmation(payload Schemas.TripConfirm) (Schemas.TripConfirmResponse, bool) {
	var responseData Schemas.TripConfirmResponse
	
	config := RequestConfig{
		URL:     fmt.Sprintf("%s/start", os.Getenv("TRIP_SERVICE_URL")),
		Method:  http.MethodPost,
		Data:    payload,
		Target:  &responseData,
	}

	ok, err := makeServiceRequest(config)
	if err != nil || !ok {
		return Schemas.TripConfirmResponse{}, false
	}

	return responseData, true
}

// RequestTripRequestRemoval removes a specific trip request
func RequestTripRequestRemoval(reqID int) bool {
	url := fmt.Sprintf("%s/remove-request/%d", os.Getenv("TRIP_SERVICE_URL"), reqID)
	
	config := RequestConfig{
		URL:     url,
		Method:  http.MethodDelete,
	}

	ok, _ := makeServiceRequest(config)
	return ok
}

// RequestEndTrip marks a trip as complete
func RequestEndTrip(tripID int) bool {
	data := map[string]interface{}{
		"trip_id": tripID,
		"status":  "complete",
	}

	config := RequestConfig{
		URL:     fmt.Sprintf("%s/update-status", os.Getenv("TRIP_SERVICE_URL")),
		Method:  http.MethodPut,
		Data:    data,
	}

	ok, _ := makeServiceRequest(config)
	return ok
}