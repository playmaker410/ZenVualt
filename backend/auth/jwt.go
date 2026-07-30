// jwt.NewWithClaims(...)A==  Assemble the token's contents (header + claims) in memory

//token.SignedString(...) ===  Encode + cryptographically sign everything into the final string

package auth

import (
	"errors"
	"log"
	"os"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	jwtSecret     []byte
	jwtSecretOnce sync.Once
) // Turning the secret key to byte(computer readable) so it can be used in cryptographic machinery

func GetSecret() string {
	secret := os.Getenv("JWT_SECRET") // Get the secret key from the environment
	if secret == "" {                 // if the secret key is empty or not fund return error
		log.Fatal("Unable to find  the environment")
	}
	return secret // return secret key if there is no errror
}

func GetjwtSecret() []byte {
	jwtSecretOnce.Do(func() {
		jwtSecret = []byte(GetSecret())

	})

	return jwtSecret
}

type Claims struct { // declaring the struct that the JWT will hold.
	UserID               int `json:"user_id"` // hold the id of the user
	jwt.RegisteredClaims     // this package from  "github.com/golang-jwt/jwt/v5". it has many thing inside that struct. so am embeding it here. You can go find full thing in these struct in go documentation.

}

func GenarateToken(userID int) (string, error) { // fuction that takes in the user  id and generate the string if error then print error
	claims := Claims{ // declaring the struct we declared earlier
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // this means 24 hour. th
			IssuedAt:  jwt.NewNumericDate(time.Now()),                     // when it stout counting. immediately it creates
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims) // builds an unsigned token *in memory* — combines:
	//   - a header saying "this will be signed with HS256"
	//   - your claims struct (UserID, ExpiresAt, IssuedAt)
	// nothing is encoded or signed yet — just assembled

	return token.SignedString(GetjwtSecret())
	// this is where the REAL work happens:
	//  1. converts header -> JSON -> base64url string
	//  2. converts claims -> JSON -> base64url string
	//  3. joins them: header.payload
	//  4. runs HMAC-SHA256 over "header.payload" using jwtSecret as the key
	//  5. base64url-encodes that signature
	//  6. glues it all together: header.payload.signature
	//
	// returns that final string, plus any error from the signing process
}

func ValidateToken(tokenString string) (*Claims, error) { // saying give me the token you created, either match the claimm(thats the information on the struct) or print error
	claims := &Claims{} // create an empty struct because it will be filled with information from the token

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		return GetjwtSecret(), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
