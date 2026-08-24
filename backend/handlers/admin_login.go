package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
	"zenvault-backend/auth"
	"zenvault-backend/db"
	"zenvault-backend/models"

	"golang.org/x/crypto/bcrypt"
)

type AdminLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func AdminLogin(w http.ResponseWriter, r *http.Request) {
	var req AdminLoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		SendError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var admin models.Admin

	err = db.DB.QueryRow(`SELECT id, first_name, last_name, email, password, role, is_active
		  FROM admins
		  WHERE email = ?`, req.Email).Scan(
		&admin.ID, &admin.FirstName, &admin.LastName, &admin.Email, &admin.Password, &admin.Role, &admin.IsActive)

	if err != nil {
		SendError(w, "Invalid Email or Password", http.StatusUnauthorized)
		return
	}

	if !admin.IsActive {
		SendError(w, "Invalid Email or Password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password))

	if err != nil {
		SendError(w, "Invalid Email or Password", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenarateToken(admin.ID)

	if err != nil {
		SendError(w, "Error generating jwt", http.StatusInternalServerError)
		return
	}

	_, err = db.DB.Exec(`UPDATE admins SET last_login = ? WHERE id = ?`, time.Now(), admin.ID)
	if err != nil {
		log.Println("failed to update last_login:", err)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "admin_token",
		Value:    token,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})

	resp := models.AdminLoginResponse{
		Message: "Login Successful",
		Admin: models.AdminInfo{
			ID:        admin.ID,
			FirstName: strings.Title(strings.ToLower(admin.FirstName)),
			LastName:  strings.Title(strings.ToLower(admin.LastName)),
			Email:     admin.Email,
			Role:      admin.Role,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
