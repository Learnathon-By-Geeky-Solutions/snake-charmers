package Schemas


type RequestBase struct {
	ReqID int `json:"req_id" mapstructure:"req_id"`
}


type LocationBase struct {
	Latitude  float64 `json:"latitude" mapstructure:"latitude"`
	Longitude float64 `json:"longitude" mapstructure:"longitude"`
}


type DriverBase struct {
	DriverID int    `json:"driver_id" mapstructure:"driver_id"`
}

type DriverDetails struct {
	Name     string `json:"name" mapstructure:"name"`
	Mobile   string `json:"mobile" mapstructure:"mobile"`
}


type tripBase struct {
	RiderID        int    `json:"rider_id" mapstructure:"rider_id"`
	PickupLocation string `json:"pickup_location" mapstructure:"pickup_location"`
	Destination    string `json:"destination" mapstructure:"destination"`
}
