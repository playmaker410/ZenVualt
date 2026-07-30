package handlers

import (
	"encoding/json"
	"net/http"
)

func SendError(w http.ResponseWriter, message string, statuscode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statuscode)

	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}
