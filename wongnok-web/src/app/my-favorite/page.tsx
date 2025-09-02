'use client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Recipe } from '@/services/recipe.service'
import CardRecipe from '@/components/CardRecipe'
import { Button } from '@/components/ui/button'
import { getFavorite } from '@/services/recipe.service'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import SkeletonCardLoading from '@/components/SkeletonCardLoading'

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

const Myfavorite = () => {
  // query path

  const [recipesData, setRecipesData] = useState<{
    results: Recipe[]
    total: number
  }>({
    results: [],
    total: 0,
  })
  const {
    mutateAsync: getRecipe,
    isPending: isRecipeLoading,
    isError: isRecipeError,
  } = useMutation({
    mutationFn: getFavorite,
    onError: () => {
      console.log('error fetching')
    },
    onSuccess: (data) => {
      if (
        Number(searchParams.get('page')) >
        Math.ceil(data.data.total / Number(searchParams.get('limit')))
      ) {
        params.set('search', searchParams.get('search') ?? '')
        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`)
        setCurrentPage(1)
        
      }
      setRecipesData(data.data)
    },
  })
  const limitDataPerPage = 5
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  params.set('limit', String(limitDataPerPage))

  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get('page') ?? 1)
  )
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get('search') ?? ''
  )

  useEffect(() => {
    params.set('page', String(currentPage))
    router.replace(`${pathname}?${params.toString()}`)
    getRecipe({
      page: Number(currentPage),
      limit: limitDataPerPage,
      search: searchInput,
    })
  }, [currentPage])

  const handleSearch = useDebouncedCallback((data) => {
    params.set('page', '1')
    if (searchInput === '') {
      params.delete('search')
    } else {
      params.set('search', searchInput)
    }
    router.replace(`${pathname}?${params.toString()}`)
    getRecipe({
      page: Number(currentPage),
      limit: limitDataPerPage,
      search: data,
    })
  }, 1000)

  if (isRecipeError)
    return (
      <>
        <div>
          <div className='w-full flex justify-center items-center my-8'>
            <div className='flex w-[584px] h-[40px] relative'>
              <div className='absolute mx-4 h-full flex justify-center items-center'>
                <Image
                  color='#E030F6'
                  src='/icons/search.svg'
                  alt='icon search'
                  width={18}
                  height={18}
                />
              </div>

              <Input
                className='rounded-3xl text-center'
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  handleSearch(e.target.value)
                }}
              />
            </div>
          </div>

          <h1 className='pt-6 pb-8 text-4xl font-bold '>สูตรอาหารทั้งหมด</h1>
          <div className='py-2 px-3 bg-pinklittle rounded-lg flex items-center'>
            <div className='mx-2'>
              <Image
                src='/icons/errorclound.svg'
                alt='error search'
                width={18}
                height={18}
              />
            </div>

            <div>
              ไม่สามารถดึงข้อมูลสูตรอาหารได้ กรุณา “รีเฟรช”
              หน้าจอเพื่อลองใหม่อีกครั้ง
            </div>
          </div>
        </div>
      </>
    )
  if (isRecipeLoading || status === 'loading')
    return (
      <div>
        <div className='w-full flex justify-center items-center my-8'>
          <div className='flex w-[584px] h-[40px] relative'>
            <div className='absolute mx-4 h-full flex justify-center items-center'>
              <Image
                color='#E030F6'
                src='/icons/search.svg'
                alt='icon search'
                width={18}
                height={18}
              />
            </div>

            <Input
              className='rounded-3xl text-center'
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </div>
        </div>
        <div className='flex justify-between items-center py-8 '>
          <h1 className='font-bold text-4xl'>สูตรอาหารสุดโปรด</h1>
        </div>

        <div>
          <div className='flex flex-wrap gap-8 '>
            {[1, 2, 3, 4].map((i) => {
              return <SkeletonCardLoading key={i} />
            })}
          </div>
        </div>
      </div>
    )

  return (
    <div>
      <div className='w-full flex justify-center items-center my-8'>
        <div className='flex w-[584px] h-[40px] relative'>
          <div className='absolute mx-4 h-full flex justify-center items-center'>
            <Image
              color='#E030F6'
              src='/icons/search.svg'
              alt='icon search'
              width={18}
              height={18}
            />
          </div>
          <Input
            className='rounded-3xl text-center'
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              handleSearch(e.target.value)
            }}
          />
        </div>
      </div>
      <div className='flex justify-between items-center py-8 '>
        <h1 className='font-bold text-4xl'>สูตรอาหารสุดโปรด</h1>
      </div>
      {!isRecipeLoading && !isRecipeError && recipesData.results.length > 0 ? (
        <div className='flex flex-wrap gap-8'>
          {recipesData.results.map((recipe) => {
            return (
              <Link key={recipe.id} href={`recipe-details/${recipe.id}`}>
                <CardRecipe key={recipe.id} {...recipe} />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className='flex flex-col'>
          <div className='flex-1 flex justify-center items-center'>
            <div className='flex-1 flex flex-col justify-center items-center '>
              <Image
                src='/Food_butcher.png'
                alt='food butcher'
                width={290}
                height={282}
              />
              <div className='text-lg my-6'>ยังไม่มีรายการสูตรอาหารสุดโปรด</div>
              <Link href={'/'}>
                <Button className='bg-primary-500 cursor-pointer'>
                  กลับหน้าสูตรอาหาร
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                setCurrentPage((prev) => {
                  return prev <= 1 ? prev : prev - 1
                })
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{currentPage}</PaginationLink>
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                setCurrentPage((prev) => {
                  return prev >= Math.ceil(recipesData.total / limitDataPerPage)
                    ? prev
                    : prev + 1
                })
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Myfavorite
