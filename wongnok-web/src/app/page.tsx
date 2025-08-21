'use client'

import CardRecipe from '@/components/CardRecipe'
import SkeletonCardLoading from '@/components/SkeletonCardLoading'
import { fetchRecipes } from '@/services/recipe.service'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

type User = {
  id: string
  firstName: string
  lastName: string
}

export type CardRecipeProps = {
  id: string
  name: string
  imageUrl: string
  description: string
  cookingDuration: {
    id: number
    name: string
  }
  difficulty: {
    id: number
    name: string
  }
  user: User
}

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  if (isLoading) {
    return (
      <div>
        <h1 className='pt-6 pb-8 text-4xl font-bold'>สูตรอาหารทั้งหมด</h1>
        <div className='flex flex-wrap gap-8'>
          {[1,2,3,4,5,6,7].map((i) => {
            return (
             <SkeletonCardLoading key={i} />
            )
          })}
        </div>
      </div>
    )
  }

  if (isError) return <h1>Error</h1>

  return (
    <div>
      <h1 className='pt-6 pb-8 text-4xl font-bold'>สูตรอาหารทั้งหมด</h1>
      <div className='flex flex-wrap gap-8'>
        {data && data.length > 0 && data.map((recipe) => {
          
          return (
            <Link key={recipe.id} href={`recipe-details/${recipe.id}`}>
              <CardRecipe key={recipe.id} {...recipe} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
