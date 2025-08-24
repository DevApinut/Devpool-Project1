import { RecipeForm } from '@/app/create-recipe/page'
import { api } from '@/lib/axios'

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

type fetchRecipeRequest = {
  page: number
  limit: number
  search: string
}

export const fetchRecipes = async (data: fetchRecipeRequest) => {
  const recipesFetch = await api.get<{ results: Recipe[]; total: number }>(
    `/api/v1/food-recipes?page=${data.page}&limit=${data.limit}&search=${data.search}`
  )

  return recipesFetch.data
}

export const fetchRecipeDetails = async (id:number) => {
  const recipeDetails = await api.get<RecipeDetails>(`/api/v1/food-recipes/${id}`)
  return recipeDetails
}

export const createRecipe = async (data: RecipeForm) => {
  const recipeDetails = await api.post<RecipeForm>('/api/v1/food-recipes', {
    name: data.name,
    description: data.description,
    ingredient: data.ingredient,
    instruction: data.instruction,
    imageURL: data.imageURL ?? '',
    difficultyID: Number(data.difficulty),
    cookingDurationID: Number(data.duration),
  })
  return recipeDetails
}

export const fetchRecipesByUser = async (
  userId?: string,
  token: string = ''
) => {
  console.log('user', userId)
  const recipes = await api.get<{ results: Recipe[] }>(
    `/api/v1/users/${userId}/food-recipes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return recipes.data.results
}
