'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()

  const [hidden, sethidden] = useState<boolean>(false)

  const forSetHidden = () => {
    sethidden(!hidden)
  }

  return (
    <div className='flex justify-between'>
      <Link href={`/`}>
        <Image
          src='/wongnok-with-name-logo.png'
          width={182}
          height={49}
          alt='wongnok-logo'
        />
      </Link>

      {session ? (
        <div
          className='flex flex-col relative cursor-pointer'
          onClick={forSetHidden}
        >
          <div className='flex h-[40px] items-center justify-center'>
            <div className='text-primary-500'>{session.user?.name}</div>
            <div className='w-[24px] h-[24px] ms-1 flex justify-center items-center'>
              <span className='relative w-full h-full flex items-center justify-center'>
                <Image
                  src='/icons/down.svg'
                  width={11}
                  height={7}
                  alt='down menu logout'
                  className={`absolute transition-all duration-300 ease-in-out ${
                    hidden
                      ? 'opacity-0 translate-y-2'
                      : 'opacity-100 translate-y-0'
                  }`}
                />
                <Image
                  src='/icons/up.svg'
                  width={11}
                  height={7}
                  alt='up menu logout'
                  className={`absolute transition-all duration-300 ease-in-out ${
                    hidden
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-2'
                  }`}
                />
              </span>
            </div>
          </div>
          <div
            className={`bg-white w-[195px] h-auto border rounded-lg absolute mt-[64px] transition-all duration-300 ease-in-out
              ${
                hidden
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
          >
            <Link href={`/my-favorite?limit=5&page=1`}>
              <div className='w-[195px] h-[48px] flex items-center hover:bg-pinklittle rounded-lg'>
                <span className='text-end w-full px-4'>รายการโปรด</span>
              </div>
            </Link>
            <Link href={`/my-recipe`}>
              <div className='w-[195px] h-[48px] flex items-center hover:bg-pinklittle rounded-lg'>
                <span className='text-end w-full px-4'>สูตรอาหารของฉัน</span>
              </div>
            </Link>
            <Link href={`/my-profile`}>
              <div className='w-[195px] h-[48px] flex items-center hover:bg-pinklittle rounded-lg'>
                <span className='text-end w-full px-4'>ข้อมูลส่วนตัว</span>
              </div>
            </Link>
            <div
              className='w-[195px] h-[48px] flex items-center hover:bg-pinklittle rounded-lg '
              onClick={() => signOut()}
            >
              <span className='text-end w-full px-4'>ออกจากระบบ</span>
            </div>
          </div>
        </div>
      ) : (
        <Button
          className='text-primary-a cursor-pointer text-primary-500'
          variant='ghost'
          onClick={() => signIn('keycloak')}
        >
          <Image
            color='#E030F6'
            src='/icons/person.svg'
            alt='icon person'
            width={16}
            height={16}
          />
          เข้าระบบ
        </Button>
      )}
    </div>
  )
}

export default Navbar
