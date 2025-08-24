'use client'
import CardRecipe from '@/components/CardRecipe'
import { Button } from '@/components/ui/button'
import { fetchRecipesByUser } from '@/services/recipe.service'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const MyRecipe = () => {
  const { data: session } = useSession()

  const { data } = useQuery({
    queryKey: ['recipesByUser'],
    queryFn: () => fetchRecipesByUser(session?.userId, session?.accessToken),
  })

  return (
    <div>
      <div className='flex justify-between items-center py-8'>
        <h1 className='font-bold text-4xl'>สูตรอาหารของฉัน</h1>
        <Link href={'/create-recipe'}>
          <Button className='bg-primary-500'>​+ สร้างสูตรอาหาร</Button>
        </Link>
      </div>
      {data && data.length > 0 ? (
        <div className='flex flex-wrap gap-8'>
          {data.map((recipe, i) => (
            <CardRecipe {...recipe} key={i} />
          ))}
        </div>
      ) : (
        <div>ยังไม่มีสูตรอาหารของตัวเอง</div>
      )}
    </div>
  )
}

export default MyRecipe
