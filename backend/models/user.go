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

// CARRYING INFORMATION FROM REGISTER TO DASHBOARD
type UserInfo struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	AccountNo string `json:"account_number"`
}

// RegisterResponse is what the register endpoint returns to the client.
type RegisterResponse struct {
	Message string   `json:"message"`
	User    UserInfo `json:"user"`
}
