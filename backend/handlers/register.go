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

func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		SendError(w, "invalid Request", http.StatusBadRequest)
		return
	}

	hashpassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		SendError(w, "Error caught while hashing Password", http.StatusInternalServerError)
		return
	}

	hashPin, err := bcrypt.GenerateFromPassword([]byte(user.BankPin), bcrypt.DefaultCost)
	if err != nil {
		SendError(w, "Caught error trying to hash the pin", http.StatusInternalServerError)
		return
	}

	result, err := db.DB.Exec(`INSERT INTO users(first_name,middle_name,last_name,phone,email,country, bank_pin,password) VALUES(?,?,?,?,?,?,?,?)`,
		user.FirstName, user.MiddleName, user.LastName, user.Phone, user.Email, user.Country, string(hashPin), string(hashpassword))

	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			SendError(w, "An account with this email already exists", http.StatusInternalServerError)
			return

		}

		SendError(w, "Error Saving User", http.StatusInternalServerError)
		return
	}

	newID, err := result.LastInsertId()
	if err != nil {
		SendError(w, "Error retrieving new user ID", http.StatusInternalServerError)
		return
	}

	token, err := auth.GenarateToken(int(newID))
	if err != nil {
		SendError(w, "Error Generating token", http.StatusInternalServerError)
		return
	}

	Accountno, err := auth.GenerateAccountNo()
	if err != nil {
		SendError(w, "Error Genarating Account number", http.StatusInternalServerError)
		return
	}

	_, err = db.DB.Exec(`INSERT INTO accounts(user_id, account_number, balance) VALUES(?,?,?)`, newID, Accountno, 0.00)

	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			SendError(w, "Please try Again", http.StatusInternalServerError)
			return
		}
		SendError(w, "Error creating account", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		HttpOnly: true,
		Path:     "/",
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})

	resp := models.RegisterResponse{
		Message: "Registeration Succeessful",
		User: models.UserInfo{
			ID:        int(newID),
			FirstName: strings.Title(strings.ToLower(user.FirstName)),
			LastName:  strings.Title(strings.ToLower(user.LastName)),
			Email:     user.Email,
			AccountNo: Accountno,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

}
