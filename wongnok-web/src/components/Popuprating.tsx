import Image from 'next/image'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { createRating } from '@/services/recipe.service'
import Star from '@/components/Rating'
import React, { useEffect, useState } from 'react'

type propsRecieve = {
  recipeId: number
  closePopup: (value: boolean) => void
}

const PopupRating = ({ recipeId, closePopup }: propsRecieve) => {
  const [selected, setSelected] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => closePopup(false), 400)
  }
  const router = useRouter()
  const { mutateAsync: giveRating } = useMutation({
    mutationFn: createRating,
    onError: () => {
      console.log('error fetching')
    },
    onSuccess: () => {
      router.replace('/')
    },
  })

  const handlerRating = (rating: number) => {
    giveRating({
      id: 0, // หรือ undefined ถ้า backend ไม่ใช้
      UserID: '', // หรือส่ง user id จริง ถ้ามี
      foodRecipeID: recipeId,
      score: rating,
    })
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center mx-30'>
      <div className='absolute inset-0 bg-Grayscale-50 opacity-75 pointer-events-none'></div>
      <div
        className={`w-[495px] h-[215px] relative border bg-white z-10 py-6 rounded-xl transition-all duration-500 ease-out transform ${
          showModal && !exiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-8'
        }`}
      >
        <div
          className='w-6 h-6 cursor-pointer absolute top-4 right-4'
          onClick={handleClose}
        >
          <Image
            src='/icons/exit.svg'
            alt='exit popup'
            width={14}
            height={14}
          />
        </div>
        <div className='flex flex-col jusitfy-center items-center mx-6'>
          <div className='text-2xl my-4'>ให้คะแนนสูตรอาหารนี้</div>
          <div className='flex flex-col justify-center items-center '>
            <div className='flex gap-1'>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  onClick={() => setSelected(i + 1)}
                  className='cursor-pointer'
                >
                  <Star fillPercent={i < selected ? 100 : 0} />
                </span>
              ))}
            </div>
            <Button
              className='mx-2 w-[152px] h-[40px] bg-secondary-500 text-white text-base cursor-pointer'
              variant='outline'
              onClick={() => {
                handlerRating(selected)
              }}
              disabled={selected === 0}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PopupRating
