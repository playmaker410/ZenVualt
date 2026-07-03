package models

type User struct {
	ID         int    `json:"id"`
	FirstName  string `json:"first_name"`
	MiddleName string `json:"middle_name"`
	LastName   string `json:"last_name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
	Country    string `json:"country"`
	BankPin    string `json:"bank_pin"`
	Password   string `json:"password"`
}
