package main

import (
	"context"
	"log"
	"wongnok/internal/auth"
	"wongnok/internal/config"
	"wongnok/internal/favorite"
	"wongnok/internal/foodrecipe"
	"wongnok/internal/middleware"
	"wongnok/internal/rating"
	"wongnok/internal/user"

	"github.com/caarlos0/env/v11"
	"github.com/coreos/go-oidc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"

	"golang.org/x/oauth2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	_ "wongnok/cmd/server/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Wongnok API
// @version 1.0
// @description This is an wongnok server.
// @host localhost:8080
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	// Context
	ctx := context.Background()

	// Load configuration
	var conf config.Config

	if err := env.Parse(&conf); err != nil {
		log.Fatal("Error when decoding configuration:", err)
	}

	// Database connection
	db, err := gorm.Open(postgres.Open(conf.Database.URL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Error when connect to database:", err)
	}
	// Ensure close connection when terminated
	defer func() {
		sqldb, _ := db.DB()
		sqldb.Close()
	}()

	// Provider

	provider, err := oidc.NewProvider(ctx, conf.Keycloak.RealmURL())
	if err != nil {
		log.Fatal("Error when make provider:", err)
	}
	verifierSkipClientIDCheck := provider.Verifier(&oidc.Config{SkipClientIDCheck: true})

	// Handler
	foodRecipeHandler := foodrecipe.NewHandler(db)
	ratingHandler := rating.NewHandler(db)
	favoriteHandler := favorite.NewHandler(db)
	authHandler := auth.NewHandler(
		db,
		conf.Keycloak,
		&oauth2.Config{
			ClientID:     conf.Keycloak.ClientID,
			ClientSecret: conf.Keycloak.ClientSecret,
			RedirectURL:  conf.Keycloak.RedirectURL,
			Endpoint:     provider.Endpoint(),
			Scopes: []string{
				oidc.ScopeOpenID,
				"profile",
				"email",
			},
		},
		provider.Verifier(&oidc.Config{
			ClientID:        conf.Keycloak.ClientID,
			SkipIssuerCheck: true,
		}),
	)
	userHandler := user.NewHandler(db)

	// Router
	router := gin.Default()

	// Swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Middleware
	corsConf := cors.DefaultConfig()
	corsConf.AllowAllOrigins = true
	corsConf.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}
	corsConf.AllowHeaders = []string{"Authorization", "Content-Type", "Accept", "Origin", "User-Agent", "DNT", "Cache-Control", "X-Mx-ReqToken", "X-Requested-With", "ngrok-skip-browser-warning"}
	corsConf.AllowCredentials = true

	router.Use(cors.New(corsConf))
	// router.Use(cors.Default())

	// Register route
	group := router.Group("/api/v1")

	// Food recipe
	group.POST("/food-recipes", middleware.Authorize(verifierSkipClientIDCheck), foodRecipeHandler.Create)
	group.GET("/food-recipes", foodRecipeHandler.Get)
	group.GET("/food-recipes/:id", foodRecipeHandler.GetByID)
	group.PUT("/food-recipes/:id", middleware.Authorize(verifierSkipClientIDCheck), foodRecipeHandler.Update)
	group.DELETE("/food-recipes/:id", middleware.Authorize(verifierSkipClientIDCheck), foodRecipeHandler.Delete)

	// Rating
	group.GET("/food-recipes/:id/ratings", ratingHandler.Get)
	group.POST("/food-recipes/:id/ratings", middleware.Authorize(verifierSkipClientIDCheck), ratingHandler.Create)

	// Favorite
	group.GET("/food-recipes/:id/favorites", favoriteHandler.Get)
	group.GET("/food-recipes/favorites", middleware.Authorize(verifierSkipClientIDCheck), favoriteHandler.GetByUser)
	group.POST("/food-recipes/favorites", middleware.Authorize(verifierSkipClientIDCheck), favoriteHandler.Create)

	// Auth
	group.GET("/login", authHandler.Login)
	group.GET("/callback", authHandler.Callback)
	group.GET("/logout", authHandler.Logout)

	// User
	group.GET("/users/:id/food-recipes", middleware.Authorize(verifierSkipClientIDCheck), userHandler.GetRecipes)

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Server error:", err)
	}
}
