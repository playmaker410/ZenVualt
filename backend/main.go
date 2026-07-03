package main

import (
	"fmt"
	"log"
	"net/http"
	"zenvault-backend/db"
	"zenvault-backend/handlers"

	"github.com/joho/godotenv"
)

func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system env vars")
	}

	db.Connect()

	mux := http.NewServeMux()

	mux.HandleFunc("/api/register", CorsMiddleware(handlers.Register))
	mux.HandleFunc("/api/login", CorsMiddleware(handlers.Login))
	mux.HandleFunc("/api/contactus", CorsMiddleware(handlers.RecieveEmail))

	fmt.Println("Zenvault backend starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
