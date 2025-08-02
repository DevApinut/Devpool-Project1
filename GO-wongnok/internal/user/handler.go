package user

import (
	"net/http"
	"wongnok/internal/helper"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type IHandler interface {
	GetRecipes(ctx *gin.Context)
}

type Handler struct {
	Service IService
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		Service: NewService(db),
	}
}

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
