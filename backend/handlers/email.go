package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
	"os"
)

type ContactUs struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func SendContactEmail(req ContactUs) error {

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASS")
	to := os.Getenv("CONTACT_RECEIVER")

	auth := smtp.PlainAuth("", from, password, smtpHost)

	subject := "New Nontact Submission:" + req.Subject
	body := fmt.Sprintf("Name: %s\nEmail: %s\n\nMessage:\n%s", req.Name, req.Email, req.Message)

	msg := []byte("To:" + to + "\r\n" + "Subject:" + subject + "\r\n" + "\r\n" + body + "\r\n")

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
}

func RecieveEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var em ContactUs
	err := json.NewDecoder(r.Body).Decode(&em)

	if err != nil {
		http.Error(w, "invalid Request Method", http.StatusBadRequest)
		return
	}

	if em.Name == "" || em.Email == "" || em.Subject == "" || em.Message == "" {
		http.Error(w, "Missing Fields", http.StatusBadRequest)
		return
	}

	err = SendContactEmail(em)
	if err != nil {
		fmt.Println("Email not sent", err)
		http.Error(w, "Failed to send Message", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "Sent"})

}
