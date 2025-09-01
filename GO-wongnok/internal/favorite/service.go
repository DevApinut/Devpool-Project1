package favorite

import (
	"wongnok/internal/model"
	"wongnok/internal/model/dto"
	"wongnok/internal/user"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

type IUserService user.IService

type IService interface {
	Get(userID string) (model.Favorites, error)
	GetByUser(foodRecipeQuery model.FoodRecipeQuery, claims model.Claims) (model.FoodRecipes, error)
	Create(request dto.FavoriteRequest, claims model.Claims) (model.Favorite, error)
}

type Service struct {
	Repository  IRepository
	UserService IUserService
}

func NewService(db *gorm.DB) IService {
	return &Service{
		Repository:  NewRepository(db),
		UserService: user.NewService(db),
	}
}

func (service Service) GetByUser(foodRecipeQuery model.FoodRecipeQuery, claims model.Claims) (model.FoodRecipes, error) {

	recipes, err := service.Repository.GetByUser(foodRecipeQuery, claims.ID)
	if err != nil {
		return nil, err
	}
	recipes = recipes.CalculateAverageRatings()
	return recipes, nil
}

func (service Service) Get(userID string) (model.Favorites, error) {
	favorites, err := service.Repository.Get(userID)
	if err != nil {
		return nil, err
	}

	return favorites, nil
}

func (service Service) Create(request dto.FavoriteRequest, claims model.Claims) (model.Favorite, error) {
	validate := validator.New()
	if err := validate.Struct(request); err != nil {
		return model.Favorite{}, errors.Wrap(err, "request invalid")
	}

	userID, err := service.UserService.GetByID(claims)
	if err != nil {
		return model.Favorite{}, errors.Wrap(err, "create Favorite")
	}

	var favorite model.Favorite
	favorite = favorite.FromRequest(request)
	favorite.FoodRecipeID = uint(request.FoodRecipeID)
	favorite.UserID = userID.ID

	if err := service.Repository.Create(&favorite); err != nil {
		return model.Favorite{}, errors.Wrap(err, "create favorite")
	}

	return favorite, nil
}
