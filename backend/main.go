package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"zenvault-backend/db"
	"zenvault-backend/handlers"
	"zenvault-backend/middleware"

	"github.com/joho/godotenv"
)

func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	allowedOrigin := os.Getenv("FRONTEND_URL")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5173"
	}
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT, PATCH, DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

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
	mux.HandleFunc("/api/change-pin", CorsMiddleware(middleware.RequireAuth(handlers.ChangePIN)))
	mux.HandleFunc("/api/contactus", CorsMiddleware(handlers.RecieveEmail))
	mux.HandleFunc("/api/me", CorsMiddleware(middleware.RequireAuth(handlers.Me)))
	mux.HandleFunc("/api/logout", CorsMiddleware(middleware.RequireAuth(handlers.Logout)))
	mux.HandleFunc("/api/adminlogin", CorsMiddleware(handlers.AdminLogin))
	mux.HandleFunc("/api/adminlogout", CorsMiddleware(middleware.RequireAdminAuth(handlers.AdminLogout)))
	mux.HandleFunc("/api/admin_me", CorsMiddleware(middleware.RequireAdminAuth(handlers.AdminMe)))
	mux.Handle("/admin/users", CorsMiddleware(middleware.RequireAdminAuth(handlers.GetAllUsers)))
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}
	fmt.Printf("Zenvault backend starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
