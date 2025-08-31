package favorite

import (
	"errors"
	"net/http"
	"strconv"
	"wongnok/internal/helper"
	"wongnok/internal/model/dto"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type IHandler interface {
	Get(ctx *gin.Context)
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

// Get godoc
// @Summary Get favorites
// @Description Get all favorites
// @Tags favorite
// @Accept json
// @Produce json
// @Success 200 {object} dto.FavoriteResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/food-recipes/favorites [get]
func (handler Handler) Get(ctx *gin.Context) {
	var id int

	pathParam := ctx.Param("id")
	if pathParam != "" {
		if parsed, err := strconv.Atoi(pathParam); err == nil && parsed > 0 {
			id = parsed
		}
	}
	favorite, err := handler.Service.Get(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "favorite not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, favorite.ToResponse())
}

// Create godoc
// @Summary Create a favorite
// @Description Create a new favorite for a food recipe by userID
// @Tags favorite
// @Accept json
// @Produce json
// @Param request body dto.FavoriteRequest true "Favorite Request"
// @Success 201 {object} dto.FavoriteResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Security BearerAuth
// @Router /api/v1/food-recipes/favorites [post]
func (handler Handler) Create(ctx *gin.Context) {
	var request dto.FavoriteRequest

	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	claims, err := helper.DecodeClaims(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}
	favorite, err := handler.Service.Create(request, claims)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.As(err, &validator.ValidationErrors{}) {
			statusCode = http.StatusBadRequest
		}

		ctx.JSON(statusCode, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, favorite.ToResponse())
}
