package handlers

import (
	"encoding/json"
	"net/http"
	"zenvault-backend/db"
	"zenvault-backend/models"

	"golang.org/x/crypto/bcrypt"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, "invalid Request", http.StatusBadRequest)
		return
	}

	hashpassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		http.Error(w, "Error caught while hashing Password", http.StatusInternalServerError)
		return
	}

	hashPin, err := bcrypt.GenerateFromPassword([]byte(user.BankPin), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Caught error trying to hash the pin", http.StatusInternalServerError)
		return
	}

	_, err = db.DB.Exec(`INSERT INTO users(first_name,middle_name,last_name,phone,email,country, bank_pin,password) VALUES(?,?,?,?,?,?,?,?)`,
		user.FirstName, user.MiddleName, user.LastName, user.Phone, user.Email, user.Country, string(hashPin), string(hashpassword))

	if err != nil {
		http.Error(w, "Encountering error saving user:"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content_Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Registeration Succesful",
	})

}
