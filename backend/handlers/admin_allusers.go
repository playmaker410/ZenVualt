package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"zenvault-backend/db"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`SELECT 
	u.id,
	u.first_name, 
	u.last_name,
	 u.email,
	 u.phone,
	 a.account_number,
	  a.balance,
	    u.created_at, 
	   u.kyc_status,
		u.status
	
	FROM users u
	LEFT JOIN accounts a ON a.user_id = u.id
	ORDER  BY u.created_at DESC
	`)

	if err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var users []map[string]interface{}

	for rows.Next() {
		var id, firstname, lastname, email, phone, createdat, kycStatus, Status string
		var AccountNo sql.NullString
		var balance sql.NullFloat64

		if err := rows.Scan(&id, &firstname, &lastname, &email, &phone, &AccountNo, &balance, &createdat, &kycStatus, &Status); err != nil {
			http.Error(w, "Failed to scan user", http.StatusInternalServerError)
			return
		}

		users = append(users, map[string]interface{}{
			"id":            id,
			"fullName":      firstname + " " + lastname,
			"email":         email,
			"accountNumber": AccountNo.String,
			"balance":       balance.Float64,
			"createdat":     createdat,
			"kycStatus":     kycStatus,
			"status":        Status,
			"phone":         phone,
		})

	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
