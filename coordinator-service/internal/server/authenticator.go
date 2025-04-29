package Server

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	Schemas "coordinator-service/internal/schemas"
)


// extractToken extracts the JWT token from either the HTTP-only cookie or query parameter
func extractToken(r *http.Request) (string, error) {
	// First try to extract from cookie
	cookie, err := r.Cookie("auth_token")
	if err == nil {
		return cookie.Value, nil
	}
	
	// If cookie not found, check for token in query parameters
	token := r.URL.Query().Get("token")
	if token != "" {
		return token, nil
	}
	
	// If we've gotten this far, no token was found
	return "", fmt.Errorf("auth_token not found in cookie or query parameters")
}

// validateToken validates the JWT token and returns the claims
func validateToken(tokenString string) (*Schemas.Claims, error) {

	claims := &Schemas.Claims{}
	jwtSecret := os.Getenv("JWT_SECRET_KEY")

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

// authenticateRequest validates the authentication of an HTTP request
func authenticateRequest(w http.ResponseWriter, r *http.Request) error {
	// Extract token from request
	tokenString, err := extractToken(r)
	if err != nil {
		log.Printf("Authentication failed: %v", err)
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return err
	}

	// Validate the token
	_, err = validateToken(tokenString)
	if err != nil {
		log.Printf("Token validation failed: %v", err)
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return err
	}
	
	return nil
}