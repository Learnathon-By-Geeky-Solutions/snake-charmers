package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"log"
	"fmt"
	"github.com/mitchellh/mapstructure"
	
)
import "github.com/gorilla/websocket"


func HandleTripRequest(conn *websocket.Conn, payload any) {
	// ✅ Directly marshal the struct without using map[string]interface{}
	var data TripRequest
	err := mapstructure.Decode(payload, &data)
	if err != nil {
		fmt.Println("Failed to decode request payload:", err)
		return
	}
	SendTripRequest(data)
}

func HandleLocationUpdate(conn *websocket.Conn, payload any){

}

func HandleTripCheckout(conn *websocket.Conn, payload any){

}

func HandleBidFromDriver(conn *websocket.Conn, payload any){

}

func HandleBidFromClient(conn *websocket.Conn, payload any){

}

func HandleTripConfirmation(conn *websocket.Conn, payload any){

}

func HandleTripDecline(conn *websocket.Conn, payload any){

}

func HandleEndTrip(conn *websocket.Conn, payload any){

}
