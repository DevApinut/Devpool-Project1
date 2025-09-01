package favorite

import (
	"wongnok/internal/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IRepository interface {
	Get(userID string) (model.Favorites, error)
	GetByUser(foodRecipeQuery model.FoodRecipeQuery, userID string) (model.FoodRecipes, error)
	Create(favorite *model.Favorite) error
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
func (repo Repository) GetByUser(query model.FoodRecipeQuery, userID string) (model.FoodRecipes, error) {
	var recipes = make(model.FoodRecipes, 0)
	offset := (query.Page - 1) * query.Limit
	db := repo.DB.
		Model(&model.FoodRecipe{}).
		Joins("JOIN favorites fav ON food_recipes.id = fav.food_recipe_id").
		Where("fav.user_id = ?", userID).
		Preload(clause.Associations).
		Find(&recipes)

	if query.Search != "" {
		db = db.Where("name LIKE ?", "%"+query.Search+"%").Or("description LIKE ?", "%"+query.Search+"%")
	}

	if err := db.Order("name asc").Limit(query.Limit).Offset(offset).Find(&recipes).Error; err != nil {
		return nil, err
	}
	return recipes, nil

}

func (repo Repository) Create(favorite *model.Favorite) error {
	if err := repo.DB.Create(favorite).Error; err != nil {
		return err
	}

	return nil
}
