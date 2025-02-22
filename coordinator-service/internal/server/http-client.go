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
// type SearchAmbulancesRequestResponse struct {
// 	DriverID int `json:"driver_id"`
// 	Name string `json:"driver_name"`
// 	Mobile string `json:"mobile"`
// }
type TripCheckout struct {
	ReqID int `json:"req_id"`
	DriverID int `json:"driver_id"`
	Name string `json:"driver_name"`
	Mobile string `json:"mobile"`
}
type BidFromDriver struct {
	ReqID int `json:"req_id"`
	DriverID int `json:"driver_id"`
	Amount int `json:"amount"`
}
type BidFromClient struct{
	ReqID int `json:"req_id"`
	Amount int `json:"amount"`
}

type TripDecline struct{
	ReqID int `json:"req_id"`
	DriverID int `json:"driver_id"`
}

type TripConfirm struct{
	ReqID   int  `json:"req_id"`
	RiderID int  `json:"rider_id"`
	DriverID int `json:"driver_id"`
	PickupLocation string `json:"pickup_location"`
	Destination string `json:"destination"`
	Fare int `json:"fare"`
	Status string `json:"status"`
}

type TripConfirmResponse struct{
	TripID   int  `json:"trip_id"`
	RiderID int  `json:"rider_id"`
	DriverID int `json:"driver_id"`
	PickupLocation string `json:"pickup_location"`
	Destination string `json:"destination"`
	Fare int `json:"fare"`
	Status string `json:"status"`
}

func SendTripRequest(payload TripRequest) (TripRequestResponse, error) {
	data := map[string]any{
		"rider_id":        payload.RiderID,
		"pickup_location": payload.PickupLocation,
		"destination":     payload.Destination,
	}
	res, err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/new-request", data)
	var responseData TripRequestResponse
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return TripRequestResponse{}, err
	}
	return responseData, err
}

func RequestAmbulances(payload TripRequest) ([]Driver, error) {
	url := fmt.Sprintf("http://localhost:8000/api/ambulances?radius=5&latitude=%f&longitude=%f", payload.Latitude, payload.Longitude)
	res, err := MakeRequest(http.MethodGet, url, nil)
	var responseData []Driver
	if err := json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return []Driver{}, err
	}
	return responseData, err
}

func RequestLocationUpdate(payload LocationUpdate, method, typ string) (error) {
	url := fmt.Sprintf("http://localhost:8000/api/location/%s", typ)
	_, err := MakeRequest(method, url, payload)
	return err
}

func RequestTripCheckout(payload TripCheckout) (error) {
	data := map[string]any{
		"req_id":         payload.ReqID,
		"driver_id":      payload.DriverID,
	}
	_, err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/engage-driver", data)
	return err
}

func RequestTripDecline(payload TripDecline) (error){
	url := fmt.Sprintf("http://localhost:8000/api/trip/release-driver?driver_id=%d", payload.DriverID)
	_, err := MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestTripConfirmation(payload TripConfirm)(TripConfirmResponse, error){
	res , err := MakeRequest(http.MethodPost, "http://localhost:8000/api/trip/start", payload)
	var responseData TripConfirmResponse
	if err = json.Unmarshal(res, &responseData); err != nil {
		log.Println("Error parsing JSON:", err)
		return TripConfirmResponse{}, err
	}

	return responseData, nil
}

func RequestTripRequestRemoval(reqID int)(error){
	url := fmt.Sprintf("http://localhost:8000/api/trip/remove-request?req_id=%d", reqID)
	_, err := MakeRequest(http.MethodDelete, url, nil)
	return err
}

func RequestEndTrip(tripID int)(error){
	data := map[string]any{
		"trip_id":      tripID,
		"status":       "complete",
	}
	_, err := MakeRequest(http.MethodPut, "http://localhost:8000/api/trip/update-status", data)
	return err
}