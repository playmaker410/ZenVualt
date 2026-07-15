package auth

import (
	"crypto/rand"
	"math/big"
	"strconv"
)

// GenerateAccountNo returns a random 10-digit account number as a string.
func GenerateAccountNo() (string, error) {
	// STEP 1: Define the boundaries of a "10-digit number".
	// Smallest 10-digit number = 1 followed by nine 0s.
	// Largest 10-digit number  = ten 9s.
	// Count your zeros/nines carefully here — this is the #1 place bugs creep in.
	const minvalue = 1000000000 // 10 digits
	const maxvalue = 9999999999 // 10 digits

	// STEP 2: Figure out how many possible numbers exist in that range.
	// +1 because the range is inclusive on both ends
	// (e.g. counting 1 to 5 inclusive = 5 numbers, not 4).
	rangeSize := big.NewInt(maxvalue - minvalue + 1)

	// STEP 3: crypto/rand only knows how to generate a random number
	// starting from 0 up to (but not including) rangeSize.
	// So right now `n` is NOT yet a valid account number — it's just
	// a random offset inside our range, e.g. 0 to 8,999,999,999.
	n, err := rand.Int(rand.Reader, rangeSize)
	if err != nil {
		return "", err
	}

	// STEP 4: Shift the 0-based random offset up into our real range
	// by adding minvalue. This is the "generate small, then shift" trick —
	// reusable anytime you need a random number in ANY custom range.
	accountno := n.Int64() + minvalue

	// STEP 5: Convert to string in base 10 (normal decimal digits).
	// Account numbers are stored/displayed as text, never used in math,
	// so a string is the right final type.
	return strconv.FormatInt(accountno, 10), nil
}
