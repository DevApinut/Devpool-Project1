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
	Get(recipeID int) (model.Favorites, error)

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

func (service Service) Get(recipeID int) (model.Favorites, error) {
	favorites, err := service.Repository.Get(recipeID)
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
