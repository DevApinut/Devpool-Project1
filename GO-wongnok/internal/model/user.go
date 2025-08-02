package model

import (
	"time"
	"wongnok/internal/model/dto"
)

type User struct {
	ID        string `gorm:"primaryKey"`
	FirstName string
	LastName  string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `gorm:"index"`
}

func (user User) FromClaims(claims Claims) User {
	return User{
		ID:        claims.ID,
		FirstName: claims.FirstName,
		LastName:  claims.LastName,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		DeletedAt: user.DeletedAt,
	}
}

func (user User) ToResponse() dto.UserResponse {
	return dto.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
}
