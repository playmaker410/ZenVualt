package middleware

import (
	"context"
	"net/http"
	"zenvault-backend/auth"
	"zenvault-backend/db"
)

const AdminKey contextKey = "adminID"
const AdminRoleKey contextKey = "adminRole"

func RequireAdminAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("admin_token")
		if err != nil {
			http.Error(w, "Missing or invalid authorization header", http.StatusUnauthorized)
			return
		}

		claims, err := auth.ValidateToken(cookie.Value)

		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		var Role string
		var IsActive bool

		err = db.DB.QueryRow(`SELECT role, is_active FROM admins WHERE  id = ? `, claims.UserID).Scan(&Role, &IsActive)

		if err != nil {
			http.Error(w, "Err connecting database", http.StatusUnauthorized)
			return

		}

		if !IsActive {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), AdminKey, claims.UserID)
		ctx = context.WithValue(ctx, AdminRoleKey, Role)
		next.ServeHTTP(w, r.WithContext(ctx))

	}

}
