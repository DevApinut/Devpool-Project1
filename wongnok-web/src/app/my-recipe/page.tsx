'use client'
import CardRecipe from '@/components/CardRecipe'
import { Button } from '@/components/ui/button'
import { fetchRecipesByUser } from '@/services/recipe.service'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const MyRecipe = () => {
  const { data: session } = useSession()

  const { data } = useQuery({
    queryKey: ['recipesByUser'],
    queryFn: () => fetchRecipesByUser(session?.accessToken),
  })

  return (
    <div>
      <div className='flex justify-between items-center py-8'>
        <h1 className='font-bold text-4xl'>สูตรอาหารของฉัน</h1>
        <Button className='bg-primary-500'>​+ สร้างสูตรอาหาร</Button>
      </div>
      {data && data.length > 0 ? (
        <div>
          {data.map((recipe) => (
            <CardRecipe key={recipe.id} {...recipe} />
          ))}
        </div>
      ) : (
        <div>ยังไม่มีสูตรอาหารของตัวเอง</div>
      )}
    </div>
  )
}

export default MyRecipe
