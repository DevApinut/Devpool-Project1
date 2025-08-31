'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import DeleteRecipe from '@/components/DeleteRecipe'
import { fetchRecipeDetails } from '@/services/recipe.service'
import { useQuery } from '@tanstack/react-query'

type RecipeDetailsIdProps = {
  params: Promise<{ recipeId: string }>
}

export default function RecipeDetailsId({ params }: RecipeDetailsIdProps) {
  const [closePopup, setClosePopup] = useState<boolean>(false)
  const { recipeId } = React.use(params)
  const { data: session, status } = useSession()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipeDetail', recipeId],
    queryFn: () => fetchRecipeDetails(Number(recipeId)),
  })

  if (isLoading || status === 'loading') return <div>Loading...</div>

  if (isError) return <div>Error</div>

  return (
    <div className='flex flex-col gap-y-5'>
      {closePopup && (
        <DeleteRecipe recipeId={Number(recipeId)} closePopup={setClosePopup} />
      )}
      <div className='flex flex-col gap-y-5'>
        {session?.userId &&
          data?.data?.user?.id &&
          data?.data?.user?.id === session.userId && (
            <div className='flex justify-between items-center'>
              <h1 className='font-bold text-4xl'>{data?.data.name}</h1>
              <div className='flex justify-center '>
                <Link href={`/edit-recipe/${recipeId}`}>
                  <Button
                    className='border text-primary-500 mx-2 cursor-pointer bg-white'
                    variant='secondary'
                  >
                    <Image
                      src='/icons/Edit.svg'
                      width={12}
                      height={12}
                      alt='edit logo'
                    />
                    แก้ไขสูตรอาหาร
                  </Button>
                </Link>

                <Button
                  className='border bg-Accent-Error-500 mx-2 cursor-pointer text-white'
                  variant='secondary' onClick={() => setClosePopup(true)}
                >
                  <Image
                    src='/icons/trash.svg'
                    width={12}
                    height={12}
                    alt='edit logo'
                  />
                  <div className='ms-2'>ลบสูตรอาหาร</div>
                </Button>
              </div>
            </div>
          )}
        <div>
          <p>{data?.data.description}</p>
          <p className='text-secondary text-xs'>{data?.data.updatedAt}</p>
        </div>
        <div>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>Oatter</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className='flex gap-x-8'>
        <div className='flex flex-col gap-6'>
          <div className='relative w-[584px] h-[334px]'>
            <Image
              src={data?.data.imageUrl || '/beef_wellington.png'}
              alt='beef wellington'
              fill
            />
          </div>
          <div className='rounded-sm px-2 bg-secondary-100 text-secondary-900'>
            <p>{data?.data.cookingDuration.name} นาที</p>
          </div>
        </div>
        <div>
          <h1 className='text-3xl font-bold'>วัตถุดิบ</h1>
          <p>เนื้อสันใน 300 กรับ</p>
        </div>
      </div>
    </div>
  )
}
