package db

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
	var err error

	DB, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/Zenvault")

	if err != nil {
		log.Fatal("Error caught while connecting to database", err)
	}

	err = DB.Ping()

	if err != nil {
		log.Fatal("Cant reach the database, something is incorrect", err)
	}

	log.Println("Log in Successful")
}
