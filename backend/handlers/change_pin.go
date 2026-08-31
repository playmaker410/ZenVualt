package handlers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"zenvault-backend/db"
	"zenvault-backend/middleware"

	"golang.org/x/crypto/bcrypt"
)

type ChangePINRequest struct {
	CurrentPIN string `json:"current_pin"`
	NewPIN     string `json:"new_pin"`
}

var bankPINPattern = regexp.MustCompile(`^\d{4}$`)

// ChangePIN verifies the current PIN before replacing its bcrypt hash.
// It is always called through RequireAuth, so the user ID comes from the signed session.
func ChangePIN(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not Allowed", http.StatusMethodNotAllowed)
		return

	}

	userID, ok := r.Context().Value(middleware.UserIdKey).(int)
	if !ok {
		SendError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req ChangePINRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if !bankPINPattern.MatchString(req.CurrentPIN) || !bankPINPattern.MatchString(req.NewPIN) {
		SendError(w, "PIN must contain exactly 4 digits", http.StatusBadRequest)
		return
	}
	if req.CurrentPIN == req.NewPIN {
		SendError(w, "Your new PIN must be different from your current PIN", http.StatusBadRequest)
		return
	}

	var storedPIN string
	if err := db.DB.QueryRow(`SELECT bank_pin FROM users WHERE id = ?`, userID).Scan(&storedPIN); err != nil {
		SendError(w, "Unable to update PIN", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedPIN), []byte(req.CurrentPIN)); err != nil {
		SendError(w, "Your current PIN is incorrect", http.StatusUnauthorized)
		return
	}

	hashedPIN, err := bcrypt.GenerateFromPassword([]byte(req.NewPIN), bcrypt.DefaultCost)
	if err != nil {
		SendError(w, "Unable to update PIN", http.StatusInternalServerError)
		return
	}

	if _, err := db.DB.Exec(`UPDATE users SET bank_pin = ? WHERE id = ?`, string(hashedPIN), userID); err != nil {
		SendError(w, "Unable to update PIN", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Bank PIN changed successfully"})
}
