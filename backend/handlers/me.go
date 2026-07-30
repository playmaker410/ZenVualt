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

	var firstname, lastname, email, AccountNo string

	err := db.DB.QueryRow(`SELECT u.first_name, u.last_name , u.email, a.account_number

	 FROM  users u 
	 JOIN accounts a ON a.user_id = u.id
	 WHERE u.id = ? `, userID).Scan(&firstname, &lastname, &email, &AccountNo)

	if err != nil {
		SendError(w, "User not found", http.StatusNotFound)
		return
	}

	resp := models.UserInfo{
		ID:        userID,
		FirstName: strings.Title(strings.ToLower(firstname)),
		LastName:  strings.Title(strings.ToLower(lastname)),
		Email:     email,
		AccountNo: AccountNo,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
