import { RecipeForm } from '@/app/create-recipe/page'
import { RecipeFormUpdate } from '@/app/edit-recipe/[recipeId]/page'
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

export type Rating ={
  foodRecipeID : number
  score : number 
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
export const deleteMyRecipe = async (id:number) => {
  const recipeDetails = await api.delete<RecipeDetails>(`/api/v1/food-recipes/${id}`)
  return recipeDetails
}
export const updateMyRecipe = async (data:RecipeFormUpdate) => {
  const recipeDetails = await api.put<RecipeFormUpdate>(`/api/v1/food-recipes/${data.id}`,{
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


export const createRating = async (data: Rating) => {
  const recipeRating = await api.post<Rating>(`/api/v1/food-recipes/${data.foodRecipeID}/ratings`, {
    score: data.score
  })
  return recipeRating

}

export const getFavorite = async () => {
  const recipeFavorite= await api.get<{ results: Recipe[] }>(`/api/v1/food-recipes/favorites`,)
  return recipeFavorite

}
