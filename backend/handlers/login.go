package handlers

import (
	"encoding/json"
	"net/http"
	"zenvault-backend/db"

	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}
	var StoredPassword string

	err = db.DB.QueryRow("SELECT password FROM users WHERE email = ?", req.Email).Scan(&StoredPassword)
	if err != nil {
		http.Error(w, "Invalid Email or Password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(StoredPassword), []byte(req.Password))

	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login Successful",
	})
}
