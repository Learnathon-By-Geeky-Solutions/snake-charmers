package Schemas

import (
	"github.com/golang-jwt/jwt/v5"
)


// TripRequest represents a trip request from a rider
type TripRequest struct {
	tripBase     `mapstructure:",squash"`
	LocationBase `mapstructure:",squash"`
	Fare        int `json:"fare" mapstructure:"fare"`
}

// LocationUpdate represents a driver's location update
type LocationUpdate struct {
	DriverBase   `mapstructure:",squash"`
	LocationBase `mapstructure:",squash"`
}

// TripCheckout represents trip checkout details
type TripCheckout struct {
	RequestBase   `mapstructure:",squash"`
	DriverBase    `mapstructure:",squash"`
}

// BidFromDriver represents a bid from a driver
type BidFromDriver struct {
	RequestBase `mapstructure:",squash"`
	DriverBase  `mapstructure:",squash"`
	DriverDetails `mapstructure:",squash"`
	Amount      int `json:"amount" mapstructure:"amount"`
}

// BidFromClient represents a bid from a client
type BidFromClient struct {
	RequestBase `mapstructure:",squash"`
	Amount      int `json:"amount" mapstructure:"amount"`
}

// TripDecline represents a trip decline by a driver
type TripDecline struct {
	RequestBase `mapstructure:",squash"`
	DriverBase  `mapstructure:",squash"`
}

// TripConfirm represents a confirmed trip
type TripConfirm struct {
	RequestBase `mapstructure:",squash"`
	tripBase    `mapstructure:",squash"`
	DriverBase  `mapstructure:",squash"`
	LocationBase `mapstructure:",squash"`
	RiderDetails `mapstructure:",squash"`
	DriverName string `json:"driver_name" mapstructure:"driver_name"`
	DriverMobile string `json:"driver_mobile" mapstructure:"driver_mobile"`
	Fare        int    `json:"fare" mapstructure:"fare"`
	Status      string `json:"status" mapstructure:"status"`
}

// TripConfirmResponse represents the response for a confirmed trip
type TripConfirmResponse struct {
	tripBase   `mapstructure:",squash"`
	DriverBase `mapstructure:",squash"`
	TripID     int    `json:"trip_id" mapstructure:"trip_id"`
	Fare       int    `json:"fare" mapstructure:"fare"`
	Status     string `json:"status" mapstructure:"status"`
}

type EndTrip struct {
	TripID     int    `json:"trip_id" mapstructure:"trip_id"`
	RiderID        int    `json:"rider_id" mapstructure:"rider_id"`
}

// Driver represents a driver's details
type Driver struct {
	DriverBase    `mapstructure:",squash"`
	DriverDetails `mapstructure:",squash"`
}

type TripDetails struct {
	ClientID int            `json:"client_id" mapstructure:"client_id"`
	Drivers  map[int]bool `json:"drivers" mapstructure:"drivers"`
}

type ClientInfo struct {
	ID   int    `json:"id" mapstructure:"id"`
	Role string `json:"role" mapstructure:"role"`
}

type Event struct {
	Name string         `json:"name" mapstructure:"name"`
	Data map[string]any `json:"data" mapstructure:"data"`
}

type Claims struct {
	Valid  bool   `json:"valid" mapstructure:"valid"`
	UserID int    `json:"user_id" mapstructure:"user_id"`
	Name   string `json:"name" mapstructure:"name"`
	Role   string `json:"role" mapstructure:"role"`
	Email  string `json:"email" mapstructure:"email"`
	Mobile string `json:"mobile" mapstructure:"mobile"`
	jwt.RegisteredClaims // Embed the standard claims to get the required methods

}
