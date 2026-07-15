package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"zenvault-backend/db"
	"zenvault-backend/middleware"
	"zenvault-backend/models"
)

func Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIdKey).(int)

	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var firstname, lastname, email string

	err := db.DB.QueryRow("SELECT first_name, last_name FROM  users WHERE id = ? ", userID).Scan(&firstname, &lastname)

	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	resp := models.UserInfo{
		ID:        userID,
		FirstName: strings.Title(strings.ToLower(firstname)),
		LastName:  strings.Title(strings.ToLower(lastname)),
		Email:     email,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
