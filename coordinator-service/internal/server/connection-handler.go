package Server

import (
	"fmt"
	"log"
	"net/http"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
	"coordinator-service/internal/client-manager"
	"coordinator-service/internal/event-listener"
	"coordinator-service/internal/schemas"
)

const jwtSecret = "d7450020550cd26bbf20fdeab58eb1f2e3d9c268cd84e22e2a76d969d29e25cb593e401be8e53906b77660e1e1f919747e986241a1ff6b33d0ebf90244a49b5246c30d8e67dc405e3355afef7844f15f61cdbc9219576cae74558595199cf7e1e3b525ee3215c62aba6adc8f3053bb3628eedf229f78d3daa63dacc622f3c6db6b5f2f414ec0e59d7c4c63278c7cb57281ab6bdc829772db4e576f8bff5199a0adf56f9895459442d3dd1d392120dffed256efc41be4056b013f4db0eb3a13bdc9758c6b05ac5283e9db1636f91156b22e2aa1c200bd8e1ae86281d559b5262665df0f44db72d722f9c3e91a8786da7b16b7e9e5edbe91f1877cf9dcbadf1a27"

// Extract JWT token from the Authorization header or query parameter
func extractToken(r *http.Request) (string, error) {
	// Extract token from HTTP-only cookie
	cookie, err := r.Cookie("auth_token")
	if err != nil {
		if err == http.ErrNoCookie {
			return "", fmt.Errorf("auth_token cookie not found")
		}
		return "", fmt.Errorf("error retrieving cookie: %w", err)
	}
	
	// Return the token value from the cookie
	return cookie.Value, nil
}

// Validate the JWT token
func validateToken(tokenString string) (*Schemas.Claims, error) {
	claims := &Schemas.Claims{}

	// Parse and validate the token
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

// Handle WebSocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	tokenString, err := extractToken(r)
	if err != nil {
		log.Printf("Authentication failed: %v", err)
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	// Validate the token
	_, err = validateToken(tokenString)
	if err != nil {
		log.Printf("Token validation failed: %v", err)
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}
	
	conn, err := UpgradeConnection(w, r)
	if err != nil {
		return
	}
	
	// Handle messages in a separate Goroutine
	go handleMessages(conn)
}

func handleMessages(conn *websocket.Conn){
	defer ClientManager.RemoveClient(conn)
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Error reading message:", err)
				break // Exit loop if error occurs (disconnect)
			}
			EventListener.ProcessEvents(conn, message)
		}
}