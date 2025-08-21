import { api } from '@/lib/axios'
import axios from 'axios'

type User = {
  id: string
  firstName: string
  lastName: string
}

type CookingDuration = {
  id: number
  name: string
}

type Difficulty = {
  id: number
  name: string
}

export type Recipe = {
  id: string
  name: string
  imageUrl: string
  description: string
  cookingDuration: CookingDuration
  difficulty: Difficulty
  user: User
}

type RecipeDetails = {
  id: number
  name: string
  description: string
  ingredient: string
  instruction: string
  imageUrl: string
  cookingDuration: CookingDuration
  difficulty: Difficulty
  createdAt: string
  updatedAt: string
  averageRating: number
  user: User
}

export const fetchRecipes = async () => {
  const recipesFetch = await api.get<{ results: Recipe[] }>(
    '/api/v1/food-recipes?page=1&limit=10'
  )

  return recipesFetch.data.results
}

export const fetchRecipeDetails = async () => {
  const recipeDetails = await api.get<RecipeDetails>('/recipe-details')
  return recipeDetails
}

export const fetchRecipesByUser = async (token: string = '') => {
  console.log('token', token)
  const recipes = await api.get<{ results: Recipe[]}>(
    '/api/v1/users/ba9872c8-49fa-42d8-8664-d9a44babe021/food-recipes',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return recipes.data.results
}
