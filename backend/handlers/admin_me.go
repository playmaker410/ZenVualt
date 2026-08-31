package handlers

import (
	"encoding/json"
	"net/http"
	"zenvault-backend/db"
	"zenvault-backend/middleware"
	"zenvault-backend/models"
)

func AdminMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Mehtod not allowed", http.StatusMethodNotAllowed)
		return
	}
	adminID, ok := r.Context().Value(middleware.AdminKey).(int)

	if !ok {
		SendError(w, "UnAuthorized", http.StatusUnauthorized)
		return
	}

	var admin models.Admin

	err := db.DB.QueryRow(`SELECT id, first_name, last_name, email , role FROM admins WHERE id = ?`, adminID).Scan(
		&admin.ID, &admin.FirstName, &admin.LastName, &admin.Email, &admin.Role,
	)

	if err != nil {
		SendError(w, "Admin not found", http.StatusUnauthorized)
		return
	}

	resp := models.AdminInfo{
		ID:        admin.ID,
		FirstName: admin.FirstName,
		LastName:  admin.LastName,
		Email:     admin.Email,
		Role:      admin.Role,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
