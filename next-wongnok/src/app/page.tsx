import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'

export default function Home() {
  return (
    <Card className='w-[275px] h-[390px]'>
      <div>
        <div className='h-[158px] w-[276px] relative rounded-t-lg pb-4'>
          <Image
            src='/beef_wellington.png'
            alt='beef wellington'
            fill
            objectFit='cover'
          />
        </div>
        <div>
          <CardContent>
            <h1 className='font-bold'>Beef wellington</h1>
            <p className='text-secondary line-clamp-3'>
              อยากทำเมนูอาหารต่างประเทศหรู ๆ กินเองที่บ้าน แต่ไม่รู้ว่าจะต้องซื้อหรือทำอะไรบ้าง กล่องนี้ ทำง่าย ครบ จบในกล่องเดียว
            </p>
          </CardContent>
        </div>
      </div>

      <div>
        <CardFooter>
          <div className='flex w-full item-center'>
            <div className='flex p-1 grow'>
              <img src='/level.svg' alt='av timer' />
              <p>ยาก</p>
            </div>
            <div className='flex p-1 grow'>
              <img src='/av_timer.svg' alt='level' />
              <p>60+ นาที</p>
            </div>
          </div>
          <div>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
