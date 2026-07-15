package auth

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func GenerateAccountNo() (string, error) {
	max := big.NewInt(9999999999)
	n, err := rand.Int(rand.Reader, max)

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%10d", n), nil
}
