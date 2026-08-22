package db

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbTLS := os.Getenv("DB_TLS")

	if dbHost == "" {
		dbHost = "127.0.0.1"
	}

	if dbPort == "" {
		dbPort = "3306"
	}

	tlsName := "false"

	if dbTLS == "true" {
		caCert, err := os.ReadFile("certs/ca.pem")
		if err != nil {
			log.Fatal("Cannot read Aiven CA certificate:", err)
		}

		certPool := x509.NewCertPool()

		if ok := certPool.AppendCertsFromPEM(caCert); !ok {
			log.Fatal("Failed to load Aiven CA certificate")
		}

		err = mysql.RegisterTLSConfig("aiven", &tls.Config{
			RootCAs:    certPool,
			ServerName: dbHost,
			MinVersion: tls.VersionTLS12,
		})
		if err != nil {
			log.Fatal("Failed to register TLS config:", err)
		}

		tlsName = "aiven"
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true&tls=%s",
		dbUser,
		dbPassword,
		dbHost,
		dbPort,
		dbName,
		tlsName,
	)

	var err error

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error initializing database connection:", err)
	}

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(10)
	DB.SetConnMaxLifetime(5 * time.Minute)

	if err = DB.Ping(); err != nil {
		log.Fatal("Cannot connect to database:", err)
	}

	log.Println("Database connected successfully")
}
