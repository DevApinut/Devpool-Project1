package favorite

import (
	"wongnok/internal/model"

	"gorm.io/gorm"
)

type IRepository interface {
	Get(userID string) (model.Favorites, error)
	Create(rating *model.Favorite) error
}

type Repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) IRepository {
	return &Repository{
		DB: db,
	}
}

func (repo Repository) Get(userID string) (model.Favorites, error) {
	var favorites model.Favorites

	if err := repo.DB.Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
		return nil, err
	}

	return favorites, nil
}

func (repo Repository) Create(favorite *model.Favorite) error {
	if err := repo.DB.Create(favorite).Error; err != nil {
		return err
	}

	return nil
}
