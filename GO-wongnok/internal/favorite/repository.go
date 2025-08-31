package favorite

import (
	"wongnok/internal/model"

	"gorm.io/gorm"
)

type IRepository interface {
	Get(recipeID int) (model.Favorites, error)
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

func (repo Repository) Get(recipeID int) (model.Favorites, error) {
	var favoraites model.Favorites

	if err := repo.DB.Where("food_recipe_id = ?", recipeID).Find(&favoraites).Error; err != nil {
		return nil, err
	}

	return favoraites, nil
}

func (repo Repository) Create(favorite *model.Favorite) error {
	if err := repo.DB.Create(favorite).Error; err != nil {
		return err
	}

	return nil
}
