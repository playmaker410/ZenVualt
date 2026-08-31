package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
	"zenvault-backend/auth"
	"zenvault-backend/db"
	"zenvault-backend/models"

	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		SendError(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	var id int
	var firstname, lastname, email, StoredPassword, AccountNo string

	err = db.DB.QueryRow(`SELECT u.id,
	   u.first_name,
	   u.last_name,
	   u.password,
	   u.email ,
		a.account_number 
		FROM users u
		JOIN accounts  a ON a.user_id = u.id
		WHERE u.email = ?`, req.Email).Scan(&id, &firstname, &lastname, &StoredPassword, &email, &AccountNo)

	if err != nil {
		SendError(w, "Invalid Email or Password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(StoredPassword), []byte(req.Password))

	if err != nil {
		SendError(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenarateToken(id)
	if err != nil {
		SendError(w, "Failed to create authentication token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})
	resp := models.RegisterResponse{
		Message: "Login Succesful",
		User: models.UserInfo{
			ID:        id,
			FirstName: strings.Title(strings.ToLower(firstname)),
			LastName:  strings.Title(strings.ToLower(lastname)),
			Email:     email,
			AccountNo: AccountNo,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
