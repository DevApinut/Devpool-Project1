'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const Myfavorite = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center py-8 '>
        <h1 className='font-bold text-4xl'>สูตรอาหารสุดโปรด</h1>
      </div>
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
            <Button className='bg-primary-500 cursor-pointer'>กลับหน้าสูตรอาหาร</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Myfavorite
