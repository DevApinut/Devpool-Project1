'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { deleteMyRecipe, fetchRecipeDetails } from '@/services/recipe.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

type RecipeDetailsIdProps = {
  params: Promise<{ recipeId: string }>
}

export default function RecipeDetailsId({ params }: RecipeDetailsIdProps) {
  const [alertVisible, setAlertVisible] = useState(false);
  const { recipeId } = React.use(params)
  const { data: session, status } = useSession()
  const router = useRouter()

  const { mutateAsync: deleteMyrecipe } = useMutation({
    mutationFn: deleteMyRecipe,
    onError: () => {
      console.log('error fetching')
    },
    onSuccess: () => {
      setAlertVisible(true); // แสดง Alert พร้อม animation
      setTimeout(() => {
        setAlertVisible(false);
        router.replace('/');
      }, 1800); // 1.8 วินาทีแล้ว redirect
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipeDetail', recipeId],
    queryFn: () => fetchRecipeDetails(Number(recipeId)),
  })

  if (isLoading || status === 'loading') return <div>Loading...</div>

  if (isError) return <div>Error</div>

  const delteMyRecipeAlert = () => {
    deleteMyrecipe(Number(recipeId))
  }

  return (
    <div className='flex flex-col gap-y-5'>
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-fit transition-all duration-500 ease-in-out
          ${alertVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
        aria-live="assertive"
      >
        <Alert variant="destructive">
          <Terminal />
          <AlertTitle>ลบสำเร็จ!</AlertTitle>
          <AlertDescription>
            สูตรอาหารถูกลบเรียบร้อยแล้ว
          </AlertDescription>
        </Alert>
      </div>
      <div className='flex flex-col gap-y-5'>
        {session?.userId &&
          data?.data?.user?.id &&
          data?.data?.user?.id === session.userId && (
            <div className='flex justify-between items-center'>
              <h1 className='font-bold text-4xl'>{data?.data.name}</h1>
              <div className='flex justify-center '>
                <Link href={'/create-recipe'}>
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
                  variant='secondary'
                >
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className='flex cursor-pointer'>
                        <Image
                          src='/icons/trash.svg'
                          width={12}
                          height={12}
                          alt='edit logo'
                        />
                        <div className='ms-2'>ลบสูตรอาหาร</div>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณต้องการลบข้อมูลถาวรใช่หรือไม่
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer'>
                          ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className='cursor-pointer'
                          onClick={delteMyRecipeAlert}
                        >
                          ใช่
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
