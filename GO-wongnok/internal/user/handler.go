package user

import (
	"net/http"
	"wongnok/internal/helper"
	"wongnok/internal/model"
	"wongnok/internal/model/dto"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type IHandler interface {
	GetRecipes(ctx *gin.Context)
	Update(ctx *gin.Context)
	Create(ctx *gin.Context)
}

type Handler struct {
	Service IService
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		Service: NewService(db),
	}
}

// GetRecipes godoc
// @Summary Get a food recipe by user ID
// @Description Get a food recipe by user ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} dto.FoodRecipesResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Security BearerAuth
// @Router /api/v1/users/{id}/food-recipes [get]
func (handler Handler) GetRecipes(ctx *gin.Context) {
	userID := ctx.Param("id")

	claims, err := helper.DecodeClaims(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	recipes, err := handler.Service.GetRecipes(userID, claims)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, recipes.ToResponse(int64(len(recipes))))
}

func (handler Handler) Create(ctx *gin.Context) {
	claims, err := helper.DecodeClaims(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	user, err := handler.Service.Create(claims)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user.ToResponse())
}

func (handler Handler) Update(ctx *gin.Context) {
	claims, err := helper.DecodeClaims(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}
	var request dto.UserRequest
	var users model.User

	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	user, err := handler.Service.Update(users.FromRequest(request, claims))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user.ToResponse())
}
