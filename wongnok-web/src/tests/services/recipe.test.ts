import { RecipeForm } from '@/app/create-recipe/page'
import { api } from '@/lib/axios'
import {
  createRecipe,
  fetchRecipeDetails,
  RecipeDetails,
  RecipePayload,
} from '@/services/recipe.service'
import { describe, expect, it, Mock, vi } from 'vitest'

vi.mock('@/lib/axios')

// Arrange
const mockCookingDuration = {
  id: 1,
  name: '60+ minutes',
}

const mockRecipeDetails: RecipeDetails = {
  id: 1,
  name: 'Pose Egg',
  description: 'Description of pose egg',
  ingredient: 'water eggs',
  instruction: 'this is a instruction',
  imageUrl: 'https://assets.wongnok.com/image1.png',
  cookingDuration: mockCookingDuration,
  difficulty: {
    id: 1,
    name: 'EASY',
  },
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  averageRating: 4,
  user: {
    id: 'user-id-1',
    firstName: 'Joey',
    lastName: 'Wasin',
  },
}

const mockCreateRecipePayload: RecipePayload = {
  name: 'Pose Egg',
  description: 'Description of pose egg',
  ingredient: 'water eggs',
  instruction: 'this is a instruction',
  imageURL: 'https://assets.wongnok.com/image1.png',
  difficultyID: 1,
  cookingDurationID: 1,
}

const mockCreateRecipeResponse: RecipeForm = {
  name: 'Pose Egg',
  description: 'Description of pose egg',
  ingredient: 'water eggs',
  instruction: 'this is a instruction',
  imageURL: 'https://assets.wongnok.com/image1.png',
  difficulty: '1',
  duration: '1',
}

describe('Verify get recipe details from API', () => {
  it('Should return recipe details when call fetching API', async () => {
    // arrange
    ;(api.get as unknown as Mock).mockResolvedValueOnce({
      data: { results: mockRecipeDetails },
    })

    // act
    const result = await fetchRecipeDetails()

    // assert
    expect(api.get).toHaveBeenCalledWith('/recipe-details')
    expect(result).toEqual({ data: { results: mockRecipeDetails } })
  })

  it('Should throw internal server error when get recipe details', async () => {
    ;(api.get as unknown as Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    )

    // act
    const result = fetchRecipeDetails()

    // assert
    expect(api.get).toHaveBeenCalledWith('/recipe-details')
    await expect(result).rejects.toThrow('Internal Server Error')
  })
})

describe('Verify create recipe', () => {
  it('Should return recipe information after create recipe success', async () => {
    // arrange
    ;(api.post as unknown as Mock).mockResolvedValueOnce({
      data: { ...mockCreateRecipeResponse },
    })

    // act
    const response = await createRecipe(mockCreateRecipePayload)

    // assert
    expect(api.post).toHaveBeenCalledWith('/api/v1/food-recipes', {
      ...mockCreateRecipePayload,
    })
    expect(response.data).toEqual(mockCreateRecipeResponse)
  })
})
