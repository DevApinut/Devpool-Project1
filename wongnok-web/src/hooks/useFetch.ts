import { Recipe, fetchRecipes } from '@/services/recipe.service'
import { useState, useEffect } from 'react'

export const useFetch = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    ;(async () => {
      const recipesFetch = await fetchRecipes()
      setRecipes(recipesFetch.data)
    })()
  }, [])

  return recipes
}
