package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
	var err error

	dsn := fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error caught while connecting to database", err)
	}

	err = DB.Ping()

	if err != nil {
		log.Fatal("Cant reach the database, something is incorrect", err)
	}

	log.Println("Log in Successful")
}
