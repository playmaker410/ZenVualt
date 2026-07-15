package middleware

import (
	"context"
	"net/http"
	"zenvault-backend/auth"
)

type contextKey string

const UserIdKey contextKey = "userID"

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			http.Error(w, "Missing or invalid authorization header", http.StatusUnauthorized)
			return
		}

		claims, err := auth.ValidateToken(cookie.Value)

		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), UserIdKey, claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
